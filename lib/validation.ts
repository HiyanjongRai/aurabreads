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

// ─── Product Image Constants & Rules ──────────────────────────────────────────
export const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024; // 5 MB per image
export const MAX_TOTAL_IMAGE_SIZE = 15 * 1024 * 1024; // 15 MB total
export const MAX_PRODUCT_IMAGES_COUNT = 6;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// ─── Product Validation Schema ────────────────────────────────────────────────
export const productValidationSchema = z
  .object({
    name: z
      .string()
      .transform(stripControlCharacters)
      .pipe(
        z
          .string()
          .min(3, "Product name must be at least 3 characters.")
          .max(150, "Product name cannot exceed 150 characters.")
      ),
    sku: z
      .string()
      .transform(stripControlCharacters)
      .pipe(z.string().max(50, "SKU cannot exceed 50 characters."))
      .optional()
      .or(z.literal("")),
    category: z
      .string()
      .transform(stripControlCharacters)
      .pipe(z.string().min(1, "Please select a category.")),
    shortDescription: z
      .string()
      .transform(stripControlCharacters)
      .pipe(z.string().max(160, "Short description cannot exceed 160 characters."))
      .optional()
      .or(z.literal("")),
    fullDescription: z
      .string()
      .transform(stripControlCharacters)
      .pipe(z.string().max(5000, "Full description cannot exceed 5000 characters."))
      .optional()
      .or(z.literal("")),
    price: z
      .number({ message: "Price must be a valid number." })
      .positive("Price must be greater than 0.")
      .max(1000000, "Price cannot exceed NPR 1,000,000."),
    salePrice: z
      .number({ message: "Sale price must be a valid number." })
      .positive("Sale price must be greater than 0.")
      .optional()
      .nullable(),
    stock: z
      .number({ message: "Stock must be a valid integer." })
      .int("Stock quantity must be a whole number.")
      .min(0, "Stock quantity cannot be negative.")
      .max(100000, "Stock quantity cannot exceed 100,000."),
    status: z.enum(["active", "draft", "archived"]).default("active"),
    featured: z.boolean().default(false),
    material: z.string().optional().or(z.literal("")),
    color: z.string().optional().or(z.literal("")),
    style: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.salePrice !== null && data.salePrice !== undefined && data.salePrice > 0) {
        return data.salePrice < data.price;
      }
      return true;
    },
    {
      message: "Sale price must be strictly less than regular price.",
      path: ["salePrice"],
    }
  );

// ─── Types ────────────────────────────────────────────────────────────────────
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProductInput = z.infer<typeof productValidationSchema>;

