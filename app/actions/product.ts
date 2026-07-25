'use server';

import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const MAX_IMAGE_COUNT = 6;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const createProductSchema = z.object({
  name: z.string().trim().min(2, 'Product name must be at least 2 characters'),
  sku: z.string().trim().optional(),
  category: z.string().trim().min(1, 'Category is required'),
  shortDescription: z.string().trim().max(160, 'Short description max 160 characters').optional(),
  fullDescription: z.string().trim().optional(),
  price: z.number().positive('Price must be greater than 0'),
  salePrice: z.number().positive().optional().nullable(),
  stock: z.number().int().min(0, 'Stock cannot be negative').default(0),
  status: z.enum(['active', 'draft', 'archived']).default('active'),
  featured: z.boolean().default(false),
  material: z.string().trim().optional(),
  color: z.string().trim().optional(),
  style: z.string().trim().optional(),
}).refine((data) => !data.salePrice || data.salePrice <= data.price, {
  path: ['salePrice'],
  message: 'Sale price cannot be higher than regular price.',
});

export type CreateProductState = {
  error?: string;
  success?: boolean;
  message?: string;
  productId?: string;
  fields?: Record<string, string>;
  fieldErrors?: Record<string, string[] | undefined>;
};

function isAllowedImage(value: FormDataEntryValue): value is File {
  return value instanceof File && value.size > 0;
}

export async function createProductAction(
  _prevState: CreateProductState,
  formData: FormData
): Promise<CreateProductState> {
  // 1. Authenticate seller or admin
  const user = await getCurrentUser();
  if (!user || (user.role !== 'SELLER' && user.role !== 'ADMIN')) {
    return { error: 'Unauthorized: Only sellers and admins can create products.' };
  }

  // 2. Parse text & number fields
  const rawPrice = parseFloat((formData.get('price') as string) || '0');
  const rawSalePrice = formData.get('salePrice') ? parseFloat(formData.get('salePrice') as string) : null;
  const rawStock = parseInt((formData.get('stock') as string) || '0', 10);

  const rawFields = {
    name: (formData.get('name') as string) || '',
    sku: (formData.get('sku') as string) || '',
    category: (formData.get('category') as string) || 'necklaces',
    shortDescription: (formData.get('shortDescription') as string) || '',
    fullDescription: (formData.get('fullDescription') as string) || '',
    price: isNaN(rawPrice) ? 0 : rawPrice,
    salePrice: rawSalePrice !== null && !isNaN(rawSalePrice) ? rawSalePrice : null,
    stock: isNaN(rawStock) ? 0 : rawStock,
    status: ((formData.get('statusSelect') as string) || (formData.get('status') as string) || 'active') as 'active' | 'draft' | 'archived',
    featured: formData.get('featured') === 'on' || formData.get('featured') === 'true',
    material: (formData.get('material') as string) || '',
    color: (formData.get('color') as string) || '',
    style: (formData.get('style') as string) || '',
  };

  const parsed = createProductSchema.safeParse(rawFields);
  if (!parsed.success) {
    return {
      fields: {
        name: rawFields.name,
        sku: rawFields.sku,
        category: rawFields.category,
        shortDescription: rawFields.shortDescription,
        fullDescription: rawFields.fullDescription,
        price: rawFields.price.toString(),
        stock: rawFields.stock.toString(),
      },
      fieldErrors: parsed.error.flatten().fieldErrors,
      error: 'Please fix the highlighted form errors.',
    };
  }

  const data = parsed.data;

  const imageFiles = formData.getAll('images').filter(isAllowedImage);
  if (imageFiles.length === 0) {
    return { error: 'Upload at least one product image.' };
  }

  if (imageFiles.length > MAX_IMAGE_COUNT) {
    return { error: `Upload up to ${MAX_IMAGE_COUNT} product images.` };
  }

  for (const file of imageFiles) {
    if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
      return { error: `${file.name || 'Selected file'} is not a supported image type.` };
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return { error: `${file.name || 'Selected file'} is larger than 5MB.` };
    }
  }

  const uploadedImageUrls: string[] = [];
  try {
    for (const file of imageFiles) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const url = await uploadImageToCloudinary(buffer, `aurabeads/products/${user.id}`);
      uploadedImageUrls.push(url);
    }
  } catch (uploadErr) {
    console.error('[PRODUCT IMAGE UPLOAD ERROR]', uploadErr);
    return { error: 'Image upload failed. Please try again.' };
  }

  // 3. Save Product to the application database. Do not claim success if persistence fails.
  try {
    const db = getDb();
    const newProduct = await db.product.create({
      data: {
        sellerId: user.id,
        name: data.name,
        sku: data.sku || undefined,
        category: data.category,
        shortDescription: data.shortDescription || undefined,
        fullDescription: data.fullDescription || undefined,
        price: data.price,
        salePrice: data.salePrice || undefined,
        stock: data.stock,
        images: uploadedImageUrls,
        status: data.status,
        featured: data.featured,
        material: data.material || undefined,
        color: data.color || undefined,
        style: data.style || undefined,
      },
    });

    revalidatePath('/seller');
    revalidatePath('/seller/products');
    revalidatePath('/admin/products');
    revalidatePath('/');

    return {
      success: true,
      productId: newProduct.id,
      message: 'Product saved successfully.',
    };
  } catch (dbErr) {
    console.error('[PRODUCT CREATE DB ERROR]', dbErr);
    return { error: 'Product could not be saved. Please try again.' };
  }
}
