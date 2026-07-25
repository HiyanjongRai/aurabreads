import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getDb } from '@/lib/db';
import SellerProductsClient, { SellerProductItem } from '@/components/seller/SellerProductsClient';

export const dynamic = 'force-dynamic';

async function getSellerProducts(sellerId: string): Promise<SellerProductItem[]> {
  try {
    const db = getDb();
    const products = await db.product.findMany({
      where: { sellerId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        category: true,
        price: true,
        salePrice: true,
        stock: true,
        status: true,
        images: true,
        featured: true,
        sku: true,
      },
    });

    return products.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      salePrice: p.salePrice,
      stock: p.stock,
      status: p.status,
      images: p.images,
      featured: p.featured,
      sku: p.sku,
    }));
  } catch {
    return [];
  }
}

export default async function SellerProductsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'SELLER' && user.role !== 'ADMIN') redirect('/dashboard');

  const products = await getSellerProducts(user.id);

  return <SellerProductsClient initialProducts={products} />;
}
