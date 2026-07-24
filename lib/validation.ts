import { z } from "zod";

// ─── Sanitizer ────────────────────────────────────────────────────────────────
const stripControlCharacters = (value: string) =>
  value.replace(/[\u0000-\u001F\u007F]/g, "").replace(/\s+/g, " ").trim();

// ─── Password strength ────────────────────────────────────────────────────────
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(100, "Password must be at most 100 characters.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
  .regex(/[0-9]/, "Password must contain at least one number.")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character.");

// ─── Register schema ──────────────────────────────────────────────────────────
export const registerSchema = z
  .object({
    name: z
      .string()
      .transform(stripControlCharacters)
      .pipe(
        z
          .string()
          .min(2, "Name must be at least 2 characters.")
          .max(100, "Name must be at most 100 characters."),
      ),
    address: z
      .string()
      .transform(stripControlCharacters)
      .pipe(
        z
          .string()
          .min(5, "Address must be at least 5 characters.")
          .max(255, "Address must be at most 255 characters."),
      ),
    email: z
      .string()
      .transform((value) => stripControlCharacters(value).toLowerCase())
      .pipe(z.email("Enter a valid email address.").max(255)),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

// ─── Login schema ─────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z
    .string()
    .transform((value) => stripControlCharacters(value).toLowerCase())
    .pipe(z.email("Enter a valid email address.")),
  password: z.string().min(1, "Password is required."),
});

// ─── Refresh token schema ─────────────────────────────────────────────────────
export const refreshTokenSchema = z.object({
  token: z.string().min(1, "Refresh token is required."),
});

// ─── Types ────────────────────────────────────────────────────────────────────
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
