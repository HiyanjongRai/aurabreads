"use server";

import { Prisma } from "@prisma/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { loginSchema, registerSchema } from "@/lib/validation";
import { loginRateLimit, registerRateLimit } from "@/lib/rate-limit";
import { logAuthEvent } from "@/lib/audit-log";
import { createSession, deleteSession, getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";

export type AuthFormState = {
  success?: string;
  error?: string;
  fields?: Record<string, string>;
  fieldErrors?: Record<string, string[] | undefined>;
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

async function getClientIp(): Promise<string> {
  const headerStore = await headers();
  return headerStore.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}

function redirectForRole(role: string) {
  if (role === "ADMIN") redirect("/admin");
  if (role === "SELLER") redirect("/seller");
  redirect("/dashboard");
}

export async function register(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const ip = await getClientIp();
  const fields = {
    name: getString(formData, "name"),
    address: getString(formData, "address"),
    email: getString(formData, "email"),
  };

  const limit = registerRateLimit(ip);
  if (!limit.success) {
    return {
      fields,
      error: "Too many registration attempts. Please try again later.",
    };
  }

  const parsed = registerSchema.safeParse({
    ...fields,
    password: getString(formData, "password"),
    confirmPassword: getString(formData, "confirmPassword"),
  });

  if (!parsed.success) {
    return {
      fields,
      fieldErrors: parsed.error.flatten().fieldErrors,
      error: "Please fix the highlighted fields.",
    };
  }

  const { name, address, email, password } = parsed.data;
  const db = getDb();

  try {
    const passwordHash = await hashPassword(password);
    const user = await db.user.create({
      data: { name, address, email, passwordHash },
      select: { id: true },
    });

    await logAuthEvent({ action: "REGISTER_SUCCESS", email, ip, success: true, userId: user.id });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      await logAuthEvent({ action: "REGISTER_FAILURE", email, ip, success: false, reason: "email_exists" });
      return {
        fields: { name, address, email },
        fieldErrors: { email: ["An account with this email already exists."] },
        error: "Please use a different email address.",
      };
    }

    console.error("[REGISTER ACTION]", error);
    return {
      fields: { name, address, email },
      error: "Registration failed. Please try again.",
    };
  }

  redirect("/login?registered=1");
}

export async function login(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const ip = await getClientIp();
  const rawEmail = getString(formData, "email");

  const parsed = loginSchema.safeParse({
    email: rawEmail,
    password: getString(formData, "password"),
  });

  if (!parsed.success) {
    return {
      fields: { email: rawEmail },
      fieldErrors: parsed.error.flatten().fieldErrors,
      error: "Please fix the highlighted fields.",
    };
  }

  const { email, password } = parsed.data;
  const limit = loginRateLimit(ip, email);
  if (!limit.success) {
    await logAuthEvent({ action: "RATE_LIMITED", email, ip, success: false, reason: "login_rate_limit" });
    return {
      fields: { email },
      error: "Too many login attempts. Please wait a minute and try again.",
    };
  }

  const user = await getDb().user.findUnique({
    where: { email },
    select: { id: true, email: true, role: true, passwordHash: true, name: true, address: true, isVerified: true, createdAt: true },
  });

  const dummyHash = "$2a$12$CwTycUXWue0Thq9StjUM0uJ8aM0R7j4mY8pZ6Z75iY8L8BZd6tL3e";
  const passwordMatch = await verifyPassword(password, user?.passwordHash ?? dummyHash);

  if (!user || !passwordMatch) {
    await logAuthEvent({ action: "LOGIN_FAILURE", email, ip, success: false, reason: "invalid_credentials" });
    return {
      fields: { email },
      error: "Invalid email or password.",
    };
  }

  await createSession(user);
  await logAuthEvent({ action: "LOGIN_SUCCESS", email, ip, success: true, userId: user.id });
  redirectForRole(user.role);
}

export async function logout() {
  const ip = await getClientIp();
  const session = await getSession();

  if (session) {
    await logAuthEvent({
      action: "LOGOUT",
      email: session.email,
      ip,
      success: true,
      userId: session.userId,
    });
  }

  await deleteSession();
  redirect("/");
}
