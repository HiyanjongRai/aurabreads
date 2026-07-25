'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/db';

export type DeleteProductState = {
  success?: boolean;
  error?: string;
  message?: string;
};

export async function deleteProductAction(productId: string): Promise<DeleteProductState> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: 'You must be signed in to delete products.' };
  }

  if (user.role !== 'ADMIN' && user.role !== 'SELLER') {
    return { error: 'Only sellers and admins can delete products.' };
  }

  const db = getDb();

  const product = await db.product.findUnique({
    where: { id: productId },
    select: { id: true, sellerId: true },
  });

  if (!product) {
    return { error: 'Product not found.' };
  }

  if (user.role !== 'ADMIN' && product.sellerId !== user.id) {
    return { error: 'You can only delete your own products.' };
  }

  await db.product.delete({ where: { id: productId } });

  revalidatePath('/seller');
  revalidatePath('/seller/products');
  revalidatePath('/admin/products');
  revalidatePath('/');

  return { success: true, message: 'Product deleted successfully.' };
}
