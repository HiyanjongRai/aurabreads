import { getDb } from '@/lib/db';

export type PublicProduct = {
  id: string;
  name: string;
  price: number;
  salePrice: number | null;
  images: string[];
  category: string;
  shortDescription: string | null;
  stock: number;
  featured: boolean;
};

/**
 * Fetches active products from the database for the homepage.
 * Returns featured products first, then by newest.
 */
export async function getHomepageProducts(limit = 8): Promise<PublicProduct[]> {
  try {
    const db = getDb();
    const products = await db.product.findMany({
      where: { status: 'active' },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
      select: {
        id: true,
        name: true,
        price: true,
        salePrice: true,
        images: true,
        category: true,
        shortDescription: true,
        stock: true,
        featured: true,
      },
    });
    return products;
  } catch (err) {
    console.error('[getHomepageProducts] DB error:', err);
    return [];
  }
}
