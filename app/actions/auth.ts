"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { loginSchema, registerSchema } from "@/lib/validation";
import { loginRateLimit, registerRateLimit } from "@/lib/rate-limit";
import { logAuthEvent } from "@/lib/audit-log";
import { createSession, deleteSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";

// ─── Shared types ─────────────────────────────────────────────────────────────
export type AuthFormState = {
  success?: string;
  error?: string;
  fields?: Record<string, string>;
  fieldErrors?: Record<string, string[] | undefined>;
};

type LocalSessionUser = {
  id: string;
  email: string;
  role: "CUSTOMER" | "SELLER" | "ADMIN";
  name: string;
  address: string;
  isVerified: boolean;
  createdAt: Date;
};

function normalizeRole(role: unknown): "CUSTOMER" | "SELLER" | "ADMIN" {
  if (role === "ADMIN" || role === "SELLER") return role;
  return "CUSTOMER";
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

async function getClientIp(): Promise<string> {
  const headerStore = await headers();
  return headerStore.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}

function isRedirectError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest: string }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://twyrkcgwpiyeftrdlumi.supabase.co";
  const secretKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    "";
  return createClient(url, secretKey, {
    global: {
      headers: {
        apikey: secretKey,
        Authorization: `Bearer ${secretKey}`,
      },
    },
    auth: { persistSession: false },
  });
}

async function syncLocalUserFromSupabase(params: {
  supabaseId: string;
  email: string;
  password: string;
  name?: string | null;
  address?: string | null;
  role?: unknown;
}): Promise<LocalSessionUser> {
  const db = getDb();
  const name = params.name?.trim() || params.email.split("@")[0] || "Customer";
  const address = params.address?.trim() || "Not provided";
  const role = normalizeRole(params.role);

  try {
    const existing = await db.user.findUnique({
      where: { email: params.email },
      select: { id: true, email: true, role: true, name: true, address: true, isVerified: true, createdAt: true },
    });

    if (existing) {
      if (existing.role !== role) {
        return await db.user.update({
          where: { id: existing.id },
          data: { role },
          select: { id: true, email: true, role: true, name: true, address: true, isVerified: true, createdAt: true },
        });
      }
      return existing;
    }

    const passwordHash = await hashPassword(params.password);
    return await db.user.create({
      data: {
        id: params.supabaseId,
        name,
        address,
        email: params.email,
        passwordHash,
        role,
        isVerified: true,
      },
      select: { id: true, email: true, role: true, name: true, address: true, isVerified: true, createdAt: true },
    });
  } catch (err) {
    console.warn("[PRISMA USER SYNC FALLBACK]", err);
    return {
      id: params.supabaseId,
      email: params.email,
      role,
      name,
      address,
      isVerified: true,
      createdAt: new Date(),
    };
  }
}

// ─── Register ─────────────────────────────────────────────────────────────────
export async function register(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const ip = await getClientIp();

  // Rate limit
  const limit = registerRateLimit(ip);
  if (!limit.success) {
    return {
      error: "Too many registration attempts. Please try again later.",
    };
  }

  const fields = {
    name: getString(formData, "name"),
    address: getString(formData, "address"),
    email: getString(formData, "email"),
  };

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
  let registrationSuccess = false;

  // 1. Register with Supabase Admin API (Auto-Confirms Email)
  try {
    const admin = getSupabaseAdmin();

    const { data: userData, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // AUTO-CONFIRM user so login works immediately!
      user_metadata: { name, address },
      app_metadata: { role: "CUSTOMER" },
    });

    if (createError) {
      if (createError.message.includes("already registered") || createError.message.includes("already exists")) {
        await logAuthEvent({ action: "REGISTER_FAILURE", email, ip, success: false, reason: "email_exists" });
        return {
          fields: { name, address, email },
          fieldErrors: { email: ["An account with this email already exists."] },
          error: "Please use a different email address.",
        };
      }
      console.warn("[SUPABASE ADMIN SIGNUP WARN]", createError.message);
    } else if (userData.user) {
      registrationSuccess = true;
      await logAuthEvent({ action: "REGISTER_SUCCESS", email, ip, success: true, userId: userData.user.id });

      // Sync user to Prisma DB if available
      try {
        await syncLocalUserFromSupabase({
          supabaseId: userData.user.id,
          email,
          password,
          name,
          address,
          role: userData.user.app_metadata?.role,
        });
      } catch (dbErr) {
        console.warn("[PRISMA SYNC SKIP]", dbErr instanceof Error ? dbErr.message : dbErr);
      }
    }
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.warn("[SUPABASE ADMIN SIGNUP EXCEPTION]", err);
  }

  // 2. Fallback: Standard Supabase Auth Client
  if (!registrationSuccess) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, address } },
      });

      if (!authError && authData.user) {
        await syncLocalUserFromSupabase({
          supabaseId: authData.user.id,
          email,
          password,
          name,
          address,
          role: authData.user.app_metadata?.role,
        });
        registrationSuccess = true;
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      console.warn("[SUPABASE CLIENT SIGNUP EXCEPTION]", err);
    }
  }

  // 3. Fallback: Direct Prisma DB
  if (!registrationSuccess) {
    try {
      const db = getDb();
      const existingUser = await db.user.findUnique({ where: { email }, select: { id: true } });

      if (existingUser) {
        await logAuthEvent({ action: "REGISTER_FAILURE", email, ip, success: false, reason: "email_exists" });
        return {
          fields: { name, address, email },
          fieldErrors: { email: ["An account with this email already exists."] },
          error: "Please use a different email address.",
        };
      }

      const passwordHash = await hashPassword(password);
      await db.user.create({ data: { name, address, email, passwordHash } });
      await logAuthEvent({ action: "REGISTER_SUCCESS", email, ip, success: true });
      registrationSuccess = true;
    } catch (dbErr) {
      console.error("[REGISTER PRISMA ERROR]", dbErr);
    }
  }

  if (registrationSuccess) {
    redirect("/login?registered=1");
  }

  return {
    fields: { name, address, email },
    error: "Registration failed. Please try again.",
  };
}

// ─── Login ────────────────────────────────────────────────────────────────────
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

  // Rate limit
  const limit = loginRateLimit(ip, email);
  if (!limit.success) {
    await logAuthEvent({ action: "RATE_LIMITED", email, ip, success: false, reason: "login_rate_limit" });
    return {
      fields: { email },
      error: "Too many login attempts. Please wait a minute and try again.",
    };
  }

  let loginSuccess = false;
  let loginRole: "CUSTOMER" | "SELLER" | "ADMIN" = "CUSTOMER";

  // 1. Try Supabase Auth API (via Client)
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (!error && data.user) {
      const localUser = await syncLocalUserFromSupabase({
        supabaseId: data.user.id,
        email: data.user.email ?? email,
        password,
        name: typeof data.user.user_metadata?.name === "string" ? data.user.user_metadata.name : null,
        address: typeof data.user.user_metadata?.address === "string" ? data.user.user_metadata.address : null,
        role: data.user.app_metadata?.role,
      });
      await logAuthEvent({ action: "LOGIN_SUCCESS", email, ip, success: true, userId: localUser.id });
      await createSession(localUser);
      loginRole = localUser.role;
      loginSuccess = true;
    } else if (error) {
      console.warn("[SUPABASE LOGIN WARN]", error.message);
      // Auto-confirm user if unconfirmed
      if (error.message.includes("Email not confirmed")) {
        try {
          const admin = getSupabaseAdmin();
          const { data: usersData } = await admin.auth.admin.listUsers();
          const target = usersData?.users.find((u) => u.email === email);
          if (target) {
            await admin.auth.admin.updateUserById(target.id, { email_confirm: true });
            // Retry sign-in
            const retry = await supabase.auth.signInWithPassword({ email, password });
            if (!retry.error && retry.data.user) {
              const localUser = await syncLocalUserFromSupabase({
                supabaseId: retry.data.user.id,
                email: retry.data.user.email ?? email,
                password,
                name: typeof retry.data.user.user_metadata?.name === "string" ? retry.data.user.user_metadata.name : null,
                address: typeof retry.data.user.user_metadata?.address === "string" ? retry.data.user.user_metadata.address : null,
                role: retry.data.user.app_metadata?.role,
              });
              await logAuthEvent({ action: "LOGIN_SUCCESS", email, ip, success: true, userId: localUser.id });
              await createSession(localUser);
              loginRole = localUser.role;
              loginSuccess = true;
            }
          }
        } catch (autoConfirmErr) {
          console.warn("[AUTO CONFIRM ON LOGIN ERR]", autoConfirmErr);
        }
      }
    }
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.warn("[SUPABASE LOGIN EXCEPTION]", err);
  }

  // 2. Try Supabase Admin API (fallback if client session or password check needs direct validation)
  if (!loginSuccess) {
    try {
      const admin = getSupabaseAdmin();
      const { data: signInData, error: adminSignInError } = await admin.auth.signInWithPassword({ email, password });

      if (!adminSignInError && signInData.user) {
        const localUser = await syncLocalUserFromSupabase({
          supabaseId: signInData.user.id,
          email: signInData.user.email ?? email,
          password,
          name: typeof signInData.user.user_metadata?.name === "string" ? signInData.user.user_metadata.name : null,
          address: typeof signInData.user.user_metadata?.address === "string" ? signInData.user.user_metadata.address : null,
          role: signInData.user.app_metadata?.role,
        });
        await logAuthEvent({ action: "LOGIN_SUCCESS", email, ip, success: true, userId: localUser.id });
        await createSession(localUser);
        loginRole = localUser.role;
        loginSuccess = true;
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      console.warn("[SUPABASE ADMIN LOGIN EXCEPTION]", err);
    }
  }

  // 3. Fallback to Prisma DB
  if (!loginSuccess) {
    try {
      const db = getDb();
      const user = await db.user.findUnique({
        where: { email },
        select: { id: true, email: true, role: true, passwordHash: true },
      });

      const DUMMY_HASH = "$2b$12$invalidhashfortimingnormalization000000000000000000";
      const passwordMatch = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);

      if (user && passwordMatch) {
        await logAuthEvent({ action: "LOGIN_SUCCESS", email, ip, success: true, userId: user.id });
        await createSession({ id: user.id, email: user.email, role: user.role });
        loginRole = normalizeRole(user.role);
        loginSuccess = true;
      }
    } catch (dbErr) {
      console.error("[LOGIN PRISMA ERROR]", dbErr);
    }
  }

  if (loginSuccess) {
    // Role-based redirect using the role we already have — avoids React cache() stale read
    if (loginRole === "ADMIN") redirect("/admin");
    else if (loginRole === "SELLER") redirect("/seller");
    else redirect("/dashboard");
  }

  await logAuthEvent({ action: "LOGIN_FAILURE", email, ip, success: false, reason: "invalid_credentials" });
  return {
    fields: { email },
    error: "Invalid email or password.",
  };
}

// ─── Logout ───────────────────────────────────────────────────────────────────
export async function logout() {
  const ip = await getClientIp();
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch {
    // Ignore signout errors
  }
  await logAuthEvent({ action: "LOGOUT", email: "session", ip, success: true });
  await deleteSession();
  redirect("/");
}
