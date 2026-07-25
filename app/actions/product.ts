'use server';

import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';
import {
  productValidationSchema,
  MAX_IMAGE_FILE_SIZE,
  MAX_TOTAL_IMAGE_SIZE,
  MAX_PRODUCT_IMAGES_COUNT,
  ALLOWED_IMAGE_TYPES,
} from '@/lib/validation';

export type CreateProductState = {
  error?: string;
  success?: boolean;
  message?: string;
  productId?: string;
  fields?: Record<string, string>;
  fieldErrors?: Record<string, string[] | undefined>;
};

function isAllowedFile(value: FormDataEntryValue): value is File {
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
  const rawSalePriceStr = formData.get('salePrice') as string;
  const rawSalePrice = rawSalePriceStr && rawSalePriceStr.trim() !== '' ? parseFloat(rawSalePriceStr) : null;
  const rawStock = parseInt((formData.get('stock') as string) || '0', 10);

  const rawFields = {
    name: (formData.get('name') as string) || '',
    sku: (formData.get('sku') as string) || '',
    category: (formData.get('category') as string) || '',
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

  // 3. Schema validation with Zod
  const parsed = productValidationSchema.safeParse(rawFields);
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

  // 4. Image Extraction & Validation
  const rawFiles = formData.getAll('images').filter(isAllowedFile);
  const rawBase64s = formData.getAll('imageUrls').filter((val): val is string => typeof val === 'string' && val.startsWith('data:image/'));

  const totalImageCount = rawFiles.length + rawBase64s.length;

  if (totalImageCount === 0) {
    return { error: 'Validation Error: Please upload at least 1 product image.' };
  }

  if (totalImageCount > MAX_PRODUCT_IMAGES_COUNT) {
    return { error: `Validation Error: You can upload a maximum of ${MAX_PRODUCT_IMAGES_COUNT} images per product.` };
  }

  let cumulativeSize = 0;
  const imageBuffers: { buffer: Buffer; fileName: string }[] = [];

  // 4a. Validate File instances
  for (let i = 0; i < rawFiles.length; i++) {
    const file = rawFiles[i];
    const fileName = file.name || `image_${i + 1}`;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return { error: `Invalid File Type: "${fileName}" is not supported. Only JPG, PNG, and WEBP images are allowed.` };
    }

    if (file.size > MAX_IMAGE_FILE_SIZE) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      return { error: `File Too Large: "${fileName}" is ${sizeMb}MB. Maximum allowed image size is 5MB.` };
    }

    cumulativeSize += file.size;
    const arrayBuffer = await file.arrayBuffer();
    imageBuffers.push({ buffer: Buffer.from(arrayBuffer), fileName });
  }

  // 4b. Validate Base64 image strings (from canvas compressor)
  for (let i = 0; i < rawBase64s.length; i++) {
    const base64Str = rawBase64s[i];
    const mimeMatch = base64Str.match(/^data:(image\/[a-zA-Z]+);base64,/);

    if (!mimeMatch || !ALLOWED_IMAGE_TYPES.includes(mimeMatch[1])) {
      return { error: `Invalid Image Format: Image #${i + 1} is not a valid JPEG, PNG, or WEBP image.` };
    }

    const base64Data = base64Str.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    if (buffer.length > MAX_IMAGE_FILE_SIZE) {
      const sizeMb = (buffer.length / (1024 * 1024)).toFixed(1);
      return { error: `File Too Large: Image #${i + 1} is ${sizeMb}MB. Maximum allowed size per image is 5MB.` };
    }

    cumulativeSize += buffer.length;
    imageBuffers.push({ buffer, fileName: `compressed_image_${i + 1}.jpg` });
  }

  // 4c. Validate Cumulative Size
  if (cumulativeSize > MAX_TOTAL_IMAGE_SIZE) {
    const totalMb = (cumulativeSize / (1024 * 1024)).toFixed(1);
    return { error: `Total Upload Size Exceeded: Combined image size is ${totalMb}MB. Maximum total upload allowed is 15MB.` };
  }

  // 5. Upload to Cloudinary CDN
  const uploadedImageUrls: string[] = [];
  try {
    for (const item of imageBuffers) {
      const url = await uploadImageToCloudinary(item.buffer, `aurabeads/products/${user.id}`);
      uploadedImageUrls.push(url);
    }
  } catch (uploadErr) {
    console.error('[PRODUCT IMAGE UPLOAD ERROR]', uploadErr);
    return { error: 'Image CDN Upload Failed: Unable to process images. Please try again.' };
  }

  // 6. Save Product to DB
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
      message: 'Product published successfully with verified images & details.',
    };
  } catch (dbErr) {
    console.error('[PRODUCT CREATE DB ERROR]', dbErr);
    return { error: 'Database Error: Could not save product. Please verify all details and try again.' };
  }
}
