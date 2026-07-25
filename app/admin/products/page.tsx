import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getDb } from '@/lib/db';
import { createClient } from '@supabase/supabase-js';
import AdminProductsClient, { AdminProductItem } from '@/components/admin/AdminProductsClient';

export const dynamic = 'force-dynamic';

async function getAdminProducts(): Promise<{
  products: AdminProductItem[];
  stats: { total: number; active: number; lowStock: number; outOfStock: number };
}> {
  // 1. Try Prisma DB query
  try {
    const db = getDb();
    const rawProducts = await db.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        seller: { select: { name: true, email: true } },
      },
    });

    const products: AdminProductItem[] = rawProducts.map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      category: p.category,
      price: p.price,
      stock: p.stock,
      status: p.status,
      images: p.images || [],
      sellerName: p.seller?.name || p.seller?.email || 'Seller',
    }));

    const total = products.length;
    const active = products.filter((p) => p.status === 'active' || p.status === 'Active').length;
    const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
    const outOfStock = products.filter((p) => p.stock === 0).length;

    return { products, stats: { total, active, lowStock, outOfStock } };
  } catch (err) {
    console.warn('[getAdminProducts] Prisma query fallback to Supabase REST:', err instanceof Error ? err.message : err);
  }

  // 2. Fallback to Supabase REST API
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://twyrkcgwpiyeftrdlumi.supabase.co';
    const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    if (url && secretKey) {
      const supabase = createClient(url, secretKey, { auth: { persistSession: false } });
      const { data } = await supabase
        .from('Product')
        .select('id, name, sku, category, price, stock, status, images, sellerId')
        .order('createdAt', { ascending: false })
        .limit(100);

      if (data && data.length > 0) {
        const products: AdminProductItem[] = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          sku: p.sku || 'N/A',
          category: p.category,
          price: p.price,
          stock: p.stock,
          status: p.status,
          images: p.images || [],
          sellerName: 'Store Seller',
        }));

        const total = products.length;
        const active = products.filter((p) => p.status === 'active' || p.status === 'Active').length;
        const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
        const outOfStock = products.filter((p) => p.stock === 0).length;

        return { products, stats: { total, active, lowStock, outOfStock } };
      }
    }
  } catch (fallbackErr) {
    console.error('[getAdminProducts] Fallback error:', fallbackErr);
  }

  // 3. Fallback demo data if DB has no products yet
  const demoItems: AdminProductItem[] = [
    { id: '1', name: 'Gold Bead Bracelet',       sku: 'GBB-001', category: 'Bracelets',  price: 1850, stock: 42, status: 'active',   images: ['/product-bracelet.png'], sellerName: 'Luxora Jewels' },
    { id: '2', name: 'Crystal Pendant Necklace', sku: 'CPN-001', category: 'Necklaces',  price: 3200, stock: 18, status: 'active',   images: ['/product-earrings1.png'], sellerName: 'Golden Craft'  },
    { id: '3', name: 'Pearl Drop Earrings',      sku: 'PDE-001', category: 'Earrings',   price: 2200, stock: 5,  status: 'active',   images: ['/product-earrings2.png'], sellerName: 'Bead World'   },
    { id: '4', name: 'Silver Chain Anklet',      sku: 'SCA-001', category: 'Anklets',    price: 1400, stock: 0,  status: 'archived', images: ['/product-earrings3.png'], sellerName: 'Silver Lane'  },
    { id: '5', name: 'Rose Gold Ring Set',       sku: 'RGR-001', category: 'Rings',      price: 2800, stock: 31, status: 'active',   images: ['/product-bracelet.png'], sellerName: 'Luxora Jewels' },
    { id: '6', name: 'Kundan Choker Set',        sku: 'KCS-001', category: 'Necklaces',  price: 5500, stock: 8,  status: 'active',   images: ['/product-earrings1.png'], sellerName: 'Golden Craft'  },
  ];

  return {
    products: demoItems,
    stats: { total: 6, active: 5, lowStock: 2, outOfStock: 1 },
  };
}

export default async function AdminProductsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'ADMIN') redirect('/dashboard');

  const { products, stats } = await getAdminProducts();

  return <AdminProductsClient initialProducts={products} stats={stats} />;
}
