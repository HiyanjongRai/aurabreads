import { SignJWT, jwtVerify } from "jose";

export const sessionCookieName = "aurabeads_session";
export const sessionDurationMs = 7 * 24 * 60 * 60 * 1000;

export type SessionPayload = {
  userId: string;
  email: string;
  expiresAt: number;
};

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be set to at least 32 characters.");
  }

  return new TextEncoder().encode(secret);
}

export async function encryptSession(payload: Omit<SessionPayload, "expiresAt">) {
  const expiresAt = Date.now() + sessionDurationMs;

  return new SignJWT({ ...payload, expiresAt })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt / 1000))
    .sign(getSessionSecret());
}

export async function decryptSession(token?: string) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSessionSecret(), {
      algorithms: ["HS256"],
    });

    if (
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.expiresAt !== "number" ||
      payload.expiresAt <= Date.now()
    ) {
      return null;
    }

    return payload as SessionPayload;
  } catch {
    return null;
  }
}
