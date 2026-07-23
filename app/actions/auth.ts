"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { createSession, deleteSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { rateLimit } from "@/lib/rate-limit";
import { loginSchema, registerSchema } from "@/lib/validation";

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

async function getClientKey(email: string) {
  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  return `${ip}:${email}`;
}

export async function register(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const fields = {
    name: getString(formData, "name"),
    address: getString(formData, "address"),
    email: getString(formData, "email"),
  };

  const parsed = registerSchema.safeParse({
    ...fields,
    password: getString(formData, "password"),
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

  const existingUser = await db.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return {
      fields: { name, address, email },
      fieldErrors: { email: ["An account with this email already exists."] },
      error: "Please use a different email address.",
    };
  }

  try {
    await db.user.create({
      data: {
        name,
        address,
        email,
        password: await hashPassword(password),
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        fields: { name, address, email },
        fieldErrors: { email: ["An account with this email already exists."] },
        error: "Please use a different email address.",
      };
    }

    return {
      fields: { name, address, email },
      error: "We could not create your account. Please try again.",
    };
  }

  redirect("/login?registered=1");
}

export async function login(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = getString(formData, "email");
  const parsed = loginSchema.safeParse({
    email,
    password: getString(formData, "password"),
  });

  if (!parsed.success) {
    return {
      fields: { email },
      fieldErrors: parsed.error.flatten().fieldErrors,
      error: "Please fix the highlighted fields.",
    };
  }

  const limit = rateLimit(await getClientKey(parsed.data.email));
  if (!limit.success) {
    return {
      fields: { email: parsed.data.email },
      error: "Too many login attempts. Please wait a minute and try again.",
    };
  }

  const user = await getDb().user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true, email: true, password: true },
  });

  if (!user || !(await verifyPassword(parsed.data.password, user.password))) {
    return {
      fields: { email: parsed.data.email },
      error: "Invalid email or password.",
    };
  }

  await createSession(user);
  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
