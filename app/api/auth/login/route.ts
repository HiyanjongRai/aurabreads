import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { createSession } from "@/lib/auth";
import { loginRateLimit } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validation";
import { logAuthEvent } from "@/lib/audit-log";

function getIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Validation failed.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const { email, password } = parsed.data;

  // Rate limit
  const limit = loginRateLimit(ip, email);
  if (!limit.success) {
    await logAuthEvent({ action: "RATE_LIMITED", email, ip, success: false, reason: "login_rate_limit" });
    return NextResponse.json(
      { success: false, message: "Too many login attempts. Please wait a minute and try again." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  // Timing-safe: always run verifyPassword to prevent email enumeration
  const user = await getDb().user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true, role: true, passwordHash: true },
  });

  const DUMMY_HASH = "$2b$12$invalidhashfortimingsafetyaaa00000000000000000000000";
  const passwordMatch = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);

  if (!user || !passwordMatch) {
    await logAuthEvent({ action: "LOGIN_FAILURE", email, ip, success: false, reason: "invalid_credentials" });
    return NextResponse.json(
      { success: false, message: "Invalid email or password." },
      { status: 401 },
    );
  }

  await createSession({ id: user.id, email: user.email, role: user.role });
  await logAuthEvent({ action: "LOGIN_SUCCESS", email, ip, success: true, userId: user.id });

  // Return safe user object — never expose passwordHash
  return NextResponse.json({
    success: true,
    message: "Login successful.",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}
