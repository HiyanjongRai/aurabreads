import { z } from "zod";

const stripControlCharacters = (value: string) =>
  value.replace(/[\u0000-\u001F\u007F]/g, "").replace(/\s+/g, " ").trim();

export const registerSchema = z.object({
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
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(100, "Password must be at most 100 characters.")
    .regex(/[A-Z]/, "Password must contain one uppercase letter.")
    .regex(/[a-z]/, "Password must contain one lowercase letter.")
    .regex(/[0-9]/, "Password must contain one number.")
    .regex(/[^A-Za-z0-9]/, "Password must contain one special character."),
});

export const loginSchema = z.object({
  email: z
    .string()
    .transform((value) => stripControlCharacters(value).toLowerCase())
    .pipe(z.email("Enter a valid email address.")),
  password: z.string().min(1, "Password is required."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
