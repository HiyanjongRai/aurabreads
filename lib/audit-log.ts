import "server-only";

import { getDb } from "@/lib/db";

export type AuditAction =
  | "LOGIN_SUCCESS"
  | "LOGIN_FAILURE"
  | "REGISTER_SUCCESS"
  | "REGISTER_FAILURE"
  | "LOGOUT"
  | "REFRESH_SUCCESS"
  | "REFRESH_FAILURE"
  | "RATE_LIMITED";

type LogParams = {
  action: AuditAction;
  email: string;
  ip: string;
  success: boolean;
  userId?: string;
  reason?: string;
};

/**
 * Logs authentication events to the AuditLog table.
 * Never logs passwords or sensitive tokens.
 * Fails silently — a logging failure must never break auth.
 */
export async function logAuthEvent(params: LogParams): Promise<void> {
  const { action, email, ip, success, userId, reason } = params;

  // Always log to console (structured, parseable)
  const entry = {
    ts: new Date().toISOString(),
    action,
    email,
    ip,
    success,
    userId: userId ?? null,
    reason: reason ?? null,
  };

  if (success) {
    console.info("[AUTH]", JSON.stringify(entry));
  } else {
    console.warn("[AUTH]", JSON.stringify(entry));
  }

  // Persist to DB (non-blocking — errors are swallowed)
  try {
    await getDb().auditLog.create({
      data: {
        action,
        email,
        ip,
        success,
        userId: userId ?? null,
        reason: reason ?? null,
      },
    });
  } catch (err) {
    // Never let audit log failure break authentication
    console.error("[AUDIT LOG ERROR]", err);
  }
}
