import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getDb } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { registerRateLimit } from "@/lib/rate-limit";
import { registerSchema } from "@/lib/validation";
import { logAuthEvent } from "@/lib/audit-log";

function getIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);

  // Rate limit
  const limit = registerRateLimit(ip);
  if (!limit.success) {
    return NextResponse.json(
      { success: false, message: "Too many registration attempts. Please try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
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

  const { name, address, email, password } = parsed.data;
  const db = getDb();

  const existing = await db.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) {
    await logAuthEvent({ action: "REGISTER_FAILURE", email, ip, success: false, reason: "email_exists" });
    return NextResponse.json(
      { success: false, message: "An account with this email already exists." },
      { status: 409 },
    );
  }

  try {
    const passwordHash = await hashPassword(password);
    const user = await db.user.create({
      data: { name, address, email, passwordHash },
      select: { id: true, name: true, email: true, role: true },
    });

    await logAuthEvent({ action: "REGISTER_SUCCESS", email, ip, success: true, userId: user.id });

    return NextResponse.json({ success: true, message: "Account created successfully.", user }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { success: false, message: "An account with this email already exists." },
        { status: 409 },
      );
    }
    console.error("[REGISTER API]", error);
    return NextResponse.json({ success: false, message: "Registration failed. Please try again." }, { status: 500 });
  }
}
