import "server-only";

import crypto from "crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  ACCESS_TOKEN_DURATION_MS,
  REFRESH_TOKEN_DURATION_MS,
  decryptAccessToken,
  decryptRefreshToken,
  encryptAccessToken,
  encryptRefreshToken,
} from "@/lib/session";

// ─── Types ────────────────────────────────────────────────────────────────────
export type SafeUser = {
  id: string;
  name: string;
  email: string;
  address: string;
  role: string;
  isVerified: boolean;
  createdAt: Date;
};

type SessionUser = {
  id: string;
  email: string;
  role: string;
  name?: string;
  address?: string;
  isVerified?: boolean;
  createdAt?: Date;
};

// ─── Cookie helpers ───────────────────────────────────────────────────────────
function cookieOptions(maxAgeMs: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: Math.floor(maxAgeMs / 1000),
  };
}

// ─── Hash a refresh token for DB storage ─────────────────────────────────────
function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// ─── Create session (login) ───────────────────────────────────────────────────
export async function createSession(user: SessionUser) {
  const db = getDb();
  const cookieStore = await cookies();

  // Generate a unique JTI for the refresh token
  const jti = crypto.randomUUID();

  const [accessToken, refreshToken] = await Promise.all([
    encryptAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      address: user.address,
      isVerified: user.isVerified,
      createdAt: user.createdAt?.getTime(),
    }),
    encryptRefreshToken({ userId: user.id, jti }),
  ]);

  await db.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_DURATION_MS),
    },
  });

  // Set both cookies
  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, cookieOptions(ACCESS_TOKEN_DURATION_MS));
  cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, cookieOptions(REFRESH_TOKEN_DURATION_MS));
}

// ─── Refresh session (rotate refresh token) ───────────────────────────────────
export async function refreshSession(): Promise<boolean> {
  const db = getDb();
  const cookieStore = await cookies();
  const rawRefresh = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!rawRefresh) return false;

  const payload = await decryptRefreshToken(rawRefresh);
  if (!payload) return false;

  const tokenHash = hashToken(rawRefresh);
  try {

  // Look up token in DB — must exist and not be revoked
  const storedToken = await db.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: { select: { id: true, email: true, role: true } } },
  });

  if (
    !storedToken ||
    storedToken.revokedAt !== null ||
    storedToken.expiresAt < new Date()
  ) {
    // Possible token theft — revoke all tokens for user
    if (storedToken) {
      await db.refreshToken.updateMany({
        where: { userId: storedToken.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
    return false;
  }

  // Rotate: revoke old token, issue new tokens
  const jti = crypto.randomUUID();
  const user = storedToken.user;

  const [newAccessToken, newRefreshToken] = await Promise.all([
    encryptAccessToken({ userId: user.id, email: user.email, role: user.role }),
    encryptRefreshToken({ userId: user.id, jti }),
  ]);

  await db.$transaction([
    db.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    }),
    db.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(newRefreshToken),
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_DURATION_MS),
      },
    }),
  ]);

  cookieStore.set(ACCESS_TOKEN_COOKIE, newAccessToken, cookieOptions(ACCESS_TOKEN_DURATION_MS));
  cookieStore.set(REFRESH_TOKEN_COOKIE, newRefreshToken, cookieOptions(REFRESH_TOKEN_DURATION_MS));

  return true;
  } catch (err) {
    console.warn("[SESSION REFRESH DB SKIP]", err);
    return false;
  }
}

// ─── Delete session (logout) ──────────────────────────────────────────────────
export async function deleteSession() {
  const db = getDb();
  const cookieStore = await cookies();
  const rawRefresh = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  // Revoke refresh token in DB
  if (rawRefresh) {
    const payload = await decryptRefreshToken(rawRefresh);
    if (payload) {
      try {
        await db.refreshToken.updateMany({
          where: { userId: payload.userId, revokedAt: null },
          data: { revokedAt: new Date() },
        });
      } catch (err) {
        console.warn("[SESSION LOGOUT DB SKIP]", err);
      }
    }
  }

  // Delete both cookies
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}

// ─── Get session (reads access token, auto-refreshes if expired) ──────────────
export const getSession = cache(async () => {
  const cookieStore = await cookies();
  const raw = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  const payload = await decryptAccessToken(raw);
  if (payload) return payload;

  // Access token expired — attempt refresh
  const refreshed = await refreshSession();
  if (!refreshed) return null;

  // Re-read the newly set access token
  const newRaw = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  return decryptAccessToken(newRaw);
});

// ─── Get current user (safe — no passwordHash) ────────────────────────────────
export const getCurrentUser = cache(async (): Promise<SafeUser | null> => {
  const session = await getSession();
  if (!session) return null;

  try {
    return await getDb().user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });
  } catch (err) {
    console.error("[CURRENT USER DB ERROR]", err);
    return null;
  }
});

// ─── Require user (throws redirect if not authenticated) ──────────────────────
export async function requireUser(): Promise<SafeUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

// ─── Require role (throws redirect if insufficient role) ─────────────────────
export async function requireRole(role: "ADMIN" | "SELLER"): Promise<SafeUser> {
  const user = await requireUser();
  if (user.role !== role) {
    // Redirect to appropriate dashboard if wrong role
    if (user.role === "ADMIN") redirect("/admin");
    else if (user.role === "SELLER") redirect("/seller");
    else redirect("/dashboard");
  }
  return user;
}

// ─── Require Admin OR Seller (e.g. for shared management pages) ──────────────
export async function requireAdminOrSeller(): Promise<SafeUser> {
  const user = await requireUser();
  if (user.role !== "ADMIN" && user.role !== "SELLER") {
    redirect("/dashboard");
  }
  return user;
}
