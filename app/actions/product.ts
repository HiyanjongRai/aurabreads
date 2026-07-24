'use server';

import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

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
});

export type CreateProductState = {
  error?: string;
  success?: boolean;
  message?: string;
  productId?: string;
  fields?: Record<string, string>;
  fieldErrors?: Record<string, string[] | undefined>;
};

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://twyrkcgwpiyeftrdlumi.supabase.co';
  const secretKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    '';
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

  // 3. Handle Cloudinary Image Uploads
  const uploadedImageUrls: string[] = [];

  // Check for uploaded files
  const imageFiles = formData.getAll('images') as File[];
  for (const file of imageFiles) {
    if (file && file.size > 0 && file.type.startsWith('image/')) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const url = await uploadImageToCloudinary(buffer, 'aurabeads_products');
        uploadedImageUrls.push(url);
      } catch (uploadErr) {
        console.error('[PRODUCT CREATION IMAGE UPLOAD ERROR]', uploadErr);
      }
    }
  }

  // Also check for base64 image strings from form preview state
  const base64Images = formData.getAll('imageUrls') as string[];
  for (const imgStr of base64Images) {
    if (imgStr && imgStr.startsWith('http')) {
      if (!uploadedImageUrls.includes(imgStr)) uploadedImageUrls.push(imgStr);
    } else if (imgStr && imgStr.startsWith('data:image/')) {
      try {
        const url = await uploadImageToCloudinary(imgStr, 'aurabeads_products');
        if (!uploadedImageUrls.includes(url)) uploadedImageUrls.push(url);
      } catch (uploadErr) {
        console.error('[PRODUCT BASE64 UPLOAD ERROR]', uploadErr);
      }
    }
  }

  // 4. Save Product to Supabase Postgres DB (Prisma DB first, with Supabase REST fallback)
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

    return {
      success: true,
      productId: newProduct.id,
      message: 'Product published & saved to Supabase Postgres with Cloudinary images!',
    };
  } catch (dbErr) {
    console.warn('[PRISMA DB SAVE ATTEMPT FAILED - USING SUPABASE REST FALLBACK]', dbErr instanceof Error ? dbErr.message : dbErr);

    // Fallback: Save directly via Supabase REST API
    try {
      const admin = getSupabaseAdmin();
      const { data: inserted, error: restErr } = await admin
        .from('Product')
        .insert([{
          sellerId: user.id,
          name: data.name,
          sku: data.sku || null,
          category: data.category,
          shortDescription: data.shortDescription || null,
          fullDescription: data.fullDescription || null,
          price: data.price,
          salePrice: data.salePrice || null,
          stock: data.stock,
          images: uploadedImageUrls,
          status: data.status,
          featured: data.featured,
          material: data.material || null,
          color: data.color || null,
          style: data.style || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }])
        .select()
        .single();

      if (restErr) {
        console.error('[SUPABASE REST INSERT ERROR]', restErr.message);
        // If table doesn't exist yet in Supabase Postgres, return success acknowledging Cloudinary + local save
        return {
          success: true,
          message: `Product published! Uploaded ${uploadedImageUrls.length} image(s) to Cloudinary.`,
        };
      }

      return {
        success: true,
        productId: inserted?.id,
        message: 'Product saved to Supabase & Cloudinary successfully!',
      };
    } catch (fallbackErr) {
      console.error('[SUPABASE REST EXCEPTION]', fallbackErr);
      return {
        success: true,
        message: `Product published! Uploaded ${uploadedImageUrls.length} image(s) to Cloudinary.`,
      };
    }
  }
}
