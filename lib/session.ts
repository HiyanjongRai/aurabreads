import { SignJWT, jwtVerify } from "jose";

// ─── Cookie names ───────────────────────────────────────────────────────────
export const ACCESS_TOKEN_COOKIE = "ab_access";
export const REFRESH_TOKEN_COOKIE = "ab_refresh";

// ─── Expiry durations ────────────────────────────────────────────────────────
export const ACCESS_TOKEN_DURATION_MS = 15 * 60 * 1000; // 15 minutes
export const REFRESH_TOKEN_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// Keep legacy name for any existing code that imports it
export const sessionCookieName = ACCESS_TOKEN_COOKIE;
export const sessionDurationMs = REFRESH_TOKEN_DURATION_MS;

// ─── Payload types ───────────────────────────────────────────────────────────
export type AccessTokenPayload = {
  userId: string;
  email: string;
  role: string;
  name?: string;
  address?: string;
  isVerified?: boolean;
  createdAt?: number;
  expiresAt: number;
};

export type RefreshTokenPayload = {
  userId: string;
  jti: string; // unique token ID for rotation / revocation
  expiresAt: number;
};

// Re-export legacy type so existing imports don't break
export type SessionPayload = AccessTokenPayload;

// ─── Secret getters ──────────────────────────────────────────────────────────
function getSecret(envVar: string, label: string) {
  const secret = process.env[envVar];
  if (!secret || secret.length < 32) {
    throw new Error(`${envVar} must be set to at least 32 characters (${label}).`);
  }
  return new TextEncoder().encode(secret);
}

function getAccessSecret() {
  return getSecret("SESSION_SECRET", "access token signing");
}

function getRefreshSecret() {
  return getSecret("REFRESH_TOKEN_SECRET", "refresh token signing");
}

// ─── Access Token ────────────────────────────────────────────────────────────
export async function encryptAccessToken(
  payload: Omit<AccessTokenPayload, "expiresAt">,
) {
  const expiresAt = Date.now() + ACCESS_TOKEN_DURATION_MS;

  return new SignJWT({ ...payload, expiresAt })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt / 1000))
    .sign(getAccessSecret());
}

export async function decryptAccessToken(
  token?: string,
): Promise<AccessTokenPayload | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getAccessSecret(), {
      algorithms: ["HS256"],
    });

    if (
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.role !== "string" ||
      typeof payload.expiresAt !== "number" ||
      payload.expiresAt <= Date.now()
    ) {
      return null;
    }

    return payload as AccessTokenPayload;
  } catch {
    return null;
  }
}

// ─── Refresh Token ────────────────────────────────────────────────────────────
export async function encryptRefreshToken(
  payload: Omit<RefreshTokenPayload, "expiresAt">,
) {
  const expiresAt = Date.now() + REFRESH_TOKEN_DURATION_MS;

  return new SignJWT({ ...payload, expiresAt })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt / 1000))
    .sign(getRefreshSecret());
}

export async function decryptRefreshToken(
  token?: string,
): Promise<RefreshTokenPayload | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getRefreshSecret(), {
      algorithms: ["HS256"],
    });

    if (
      typeof payload.userId !== "string" ||
      typeof payload.jti !== "string" ||
      typeof payload.expiresAt !== "number" ||
      payload.expiresAt <= Date.now()
    ) {
      return null;
    }

    return payload as RefreshTokenPayload;
  } catch {
    return null;
  }
}

// ─── Legacy compat — used by any existing callers of encryptSession ───────────
export const encryptSession = encryptAccessToken;
export const decryptSession = decryptAccessToken;
