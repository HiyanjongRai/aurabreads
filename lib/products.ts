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
    console.log(`[getHomepageProducts] Prisma returned ${products.length} active products`);
    return products;
  } catch (err) {
    console.warn('[getHomepageProducts] Prisma failed, trying Supabase REST:', err instanceof Error ? err.message : err);
  }

  // 2. Fallback: Fetch via Supabase REST API
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://twyrkcgwpiyeftrdlumi.supabase.co';
    // Try service role key first (bypasses RLS), then anon key
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
    const key = serviceKey || anonKey;

    if (!url || !key) {
      console.error('[getHomepageProducts] Missing Supabase URL or key');
      return [];
    }

    const supabase = createClient(url, key, { auth: { persistSession: false } });
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

    console.log(`[getHomepageProducts] Supabase REST returned ${data?.length ?? 0} active products`);
    return (data as PublicProduct[]) || [];
  } catch (fallbackErr) {
    console.error('[getHomepageProducts] Fallback exception:', fallbackErr);
    return [];
  }
}

export async function getActiveProducts(): Promise<PublicProduct[]> {
  try {
    const db = getDb();
    const products = await db.product.findMany({
      where: { status: 'active' },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
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
    console.log(`[getActiveProducts] Prisma returned ${products.length} active products`);
    return products;
  } catch (err) {
    console.warn('[getActiveProducts] Prisma failed, trying Supabase REST:', err instanceof Error ? err.message : err);
  }

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://twyrkcgwpiyeftrdlumi.supabase.co';
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
    const key = serviceKey || anonKey;

    if (!url || !key) {
      console.error('[getActiveProducts] Missing Supabase URL or key');
      return [];
    }

    const supabase = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await supabase
      .from('Product')
      .select('id, name, price, salePrice, images, category, shortDescription, stock, featured')
      .eq('status', 'active')
      .order('featured', { ascending: false })
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('[getActiveProducts] Supabase REST error:', error.message);
      return [];
    }

    console.log(`[getActiveProducts] Supabase REST returned ${data?.length ?? 0} active products`);
    return (data as PublicProduct[]) || [];
  } catch (fallbackErr) {
    console.error('[getActiveProducts] Fallback exception:', fallbackErr);
    return [];
  }
}
