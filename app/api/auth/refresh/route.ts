import { NextRequest, NextResponse } from "next/server";
import { refreshSession, getCurrentUser } from "@/lib/auth";
import { refreshRateLimit } from "@/lib/rate-limit";
import { logAuthEvent } from "@/lib/audit-log";

function getIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);

  // Rate limit refresh attempts per IP
  const limit = refreshRateLimit(ip);
  if (!limit.success) {
    return NextResponse.json(
      { success: false, message: "Too many refresh attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  const refreshed = await refreshSession();

  if (!refreshed) {
    await logAuthEvent({
      action: "REFRESH_FAILURE",
      email: "unknown",
      ip,
      success: false,
      reason: "invalid_or_revoked_refresh_token",
    });
    return NextResponse.json(
      { success: false, message: "Session expired. Please log in again." },
      { status: 401 },
    );
  }

  // Read new session after refresh
  const user = await getCurrentUser();

  await logAuthEvent({
    action: "REFRESH_SUCCESS",
    email: user?.email ?? "unknown",
    ip,
    success: true,
    userId: user?.id,
  });

  return NextResponse.json({
    success: true,
    message: "Session refreshed.",
    user: user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      : null,
  });
}
