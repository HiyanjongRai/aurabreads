'use server';

import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireAdminOrSeller } from '@/lib/auth';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']);

const productSchema = z
  .object({
    name: z.string().trim().min(2, 'Product name must be at least 2 characters.').max(160),
    sku: z.string().trim().max(80).optional(),
    category: z.string().trim().min(1, 'Choose a category.').max(80),
    shortDescription: z.string().trim().max(160).optional(),
    description: z.string().trim().max(5000).optional(),
    regularPrice: z.coerce.number().min(0, 'Regular price must be 0 or higher.'),
    salePrice: z.coerce.number().min(0, 'Sale price must be 0 or higher.').optional(),
    stockQuantity: z.coerce.number().int().min(0, 'Stock must be 0 or higher.'),
    status: z.enum(['active', 'draft', 'archived']),
    featured: z.boolean(),
    trackInventory: z.boolean(),
    material: z.string().trim().max(80).optional(),
    colorFinish: z.string().trim().max(120).optional(),
    collection: z.string().trim().max(120).optional(),
  })
  .refine((data) => !data.salePrice || data.salePrice <= data.regularPrice, {
    path: ['salePrice'],
    message: 'Sale price cannot be higher than regular price.',
  });

export type ProductFormState = {
  fieldErrors?: Record<string, string[] | undefined>;
  error?: string;
  success?: boolean;
  message?: string;
};

function optionalString(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

function optionalNumberString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' && value.trim() ? value : undefined;
}

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  return { cloudName, apiKey, apiSecret };
}

function signCloudinaryParams(params: Record<string, string>, apiSecret: string) {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');

  return crypto.createHash('sha1').update(payload + apiSecret).digest('hex');
}

async function uploadImageToCloudinary(file: File, sellerId: string) {
  const config = getCloudinaryConfig();
  if (!config) {
    throw new Error('Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.');
  }

  if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
    throw new Error(`${file.name} is not a supported image type.`);
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(`${file.name} is larger than 5MB.`);
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = `aurabeads/products/${sellerId}`;
  const params = { folder, timestamp };
  const body = new FormData();

  body.append('file', file);
  body.append('api_key', config.apiKey);
  body.append('timestamp', timestamp);
  body.append('folder', folder);
  body.append('signature', signCloudinaryParams(params, config.apiSecret));

  const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`, {
    method: 'POST',
    body,
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result?.error?.message || `Failed to upload ${file.name}.`);
  }

  return {
    url: result.secure_url as string,
    publicId: result.public_id as string,
    width: result.width as number | undefined,
    height: result.height as number | undefined,
    format: result.format as string | undefined,
  };
}

export async function createProductAction(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const user = await requireAdminOrSeller();

  const rawFields = {
    name: optionalString(formData, 'name') || '',
    sku: optionalString(formData, 'sku'),
    category: optionalString(formData, 'category') || '',
    shortDescription: optionalString(formData, 'shortDescription'),
    description: optionalString(formData, 'description'),
    regularPrice: formData.get('regularPrice'),
    salePrice: optionalNumberString(formData, 'salePrice'),
    stockQuantity: formData.get('stockQuantity'),
    status: optionalString(formData, 'status') || 'draft',
    featured: formData.get('featured') === 'on',
    trackInventory: formData.get('trackInventory') === 'on',
    material: optionalString(formData, 'material'),
    colorFinish: optionalString(formData, 'colorFinish'),
    collection: optionalString(formData, 'collection'),
  };

  const parsed = productSchema.safeParse(rawFields);
  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      error: 'Please fix the highlighted fields.',
    };
  }

  const images = formData
    .getAll('images')
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (images.length === 0) {
    return { error: 'Upload at least one product image.' };
  }

  if (images.length > 6) {
    return { error: 'Upload up to 6 product images.' };
  }

  let uploadedImages: Awaited<ReturnType<typeof uploadImageToCloudinary>>[];
  try {
    uploadedImages = await Promise.all(images.map((image) => uploadImageToCloudinary(image, user.id)));
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Image upload failed.',
    };
  }

  const product = parsed.data;
  const supabase = await createSupabaseAdminClient();
  const { error } = await supabase.from('products').insert({
    seller_id: user.id,
    seller_name: user.name,
    name: product.name,
    sku: product.sku || null,
    category: product.category,
    short_description: product.shortDescription || null,
    description: product.description || null,
    regular_price: product.regularPrice,
    sale_price: product.salePrice || null,
    stock_quantity: product.stockQuantity,
    status: product.status,
    featured: product.featured,
    track_inventory: product.trackInventory,
    material: product.material || null,
    color_finish: product.colorFinish || null,
    collection: product.collection || null,
    primary_image_url: uploadedImages[0]?.url,
    images: uploadedImages,
  });

  if (error) {
    return {
      error: error.message.includes('products')
        ? 'Supabase products table is missing or unavailable. Run the SQL in supabase/products.sql, then try again.'
        : error.message,
    };
  }

  revalidatePath('/seller');
  revalidatePath('/seller/products');
  revalidatePath('/admin/products');

  return {
    success: true,
    message: product.status === 'draft' ? 'Product draft saved.' : 'Product published successfully.',
  };
}
