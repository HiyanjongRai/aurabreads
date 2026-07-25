import { getDb } from '@/lib/db';
import { createClient } from '@supabase/supabase-js';

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
 * Tries Prisma DB connection first, falls back to Supabase REST API.
 */
export async function getHomepageProducts(limit = 10): Promise<PublicProduct[]> {
  // 1. Try Prisma DB query
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
    console.warn('[getHomepageProducts] Prisma connection fallback to Supabase REST:', err instanceof Error ? err.message : err);
  }

  // 2. Fallback: Fetch via Supabase REST API
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://twyrkcgwpiyeftrdlumi.supabase.co';
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
    
    if (!url || !anonKey) return [];

    const supabase = createClient(url, anonKey);
    const { data, error } = await supabase
      .from('Product')
      .select('id, name, price, salePrice, images, category, shortDescription, stock, featured')
      .eq('status', 'active')
      .order('featured', { ascending: false })
      .order('createdAt', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[getHomepageProducts] Supabase REST error:', error.message);
      return [];
    }

    return (data as PublicProduct[]) || [];
  } catch (fallbackErr) {
    console.error('[getHomepageProducts] Fallback exception:', fallbackErr);
    return [];
  }
}
