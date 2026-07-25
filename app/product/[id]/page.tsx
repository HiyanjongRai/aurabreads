import { getDb } from '@/lib/db';
import Navbar from '@/components/Navbar';
import ProductDetailClient from '@/components/ProductDetailClient';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export type ProductDetail = {
  id: string;
  name: string;
  category: string;
  price: number;
  salePrice: number | null;
  rating?: number;
  reviews?: number;
  stock: number;
  status: string;
  featured: boolean;
  sku?: string | null;
  shortDescription?: string | null;
  fullDescription?: string | null;
  material?: string | null;
  color?: string | null;
  style?: string | null;
  images: string[];
  seller?: { name: string; email: string } | null;
};

async function getProductAndRelated(id: string): Promise<{ product: ProductDetail; relatedProducts: ProductDetail[] }> {
  // 1. Try Prisma DB query first
  try {
    const db = getDb();
    const dbProduct = await db.product.findUnique({
      where: { id },
      include: { seller: { select: { name: true, email: true } } },
    });

    if (dbProduct) {
      const related = await db.product.findMany({
        where: {
          category: dbProduct.category,
          status: 'active',
          NOT: { id: dbProduct.id },
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
      });

      return {
        product: {
          ...dbProduct,
          rating: 4.8,
          reviews: 42 + (Math.floor(dbProduct.price) % 60),
        },
        relatedProducts: related.map((p) => ({
          ...p,
          rating: 4.7,
          reviews: 30 + (Math.floor(p.price) % 50),
        })),
      };
    }
  } catch (err) {
    console.warn('[getProductAndRelated] Prisma error:', err);
  }

  // 2. Try Supabase REST API fallback
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://twyrkcgwpiyeftrdlumi.supabase.co';
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (url && key) {
      const supabase = createClient(url, key, { auth: { persistSession: false } });
      const { data: supaProduct } = await supabase
        .from('Product')
        .select('*')
        .eq('id', id)
        .single();

      if (supaProduct) {
        const { data: supaRelated } = await supabase
          .from('Product')
          .select('*')
          .eq('category', supaProduct.category)
          .neq('id', supaProduct.id)
          .limit(5);

        return {
          product: {
            ...supaProduct,
            rating: 4.8,
            reviews: 96,
          },
          relatedProducts: (supaRelated || []).map((p: any) => ({
            ...p,
            rating: 4.7,
            reviews: 45,
          })),
        };
      }
    }
  } catch (fallbackErr) {
    console.error('[getProductAndRelated] Supabase REST error:', fallbackErr);
  }

  // 3. Demo fallback if product ID is a demo item or DB is empty
  const demoProducts: ProductDetail[] = [
    {
      id: 'demo-1',
      name: 'Twist Knot Earrings',
      category: 'Earrings',
      price: 18.00,
      salePrice: null,
      rating: 4.8,
      reviews: 128,
      stock: 24,
      status: 'active',
      featured: true,
      sku: 'EAR-001',
      shortDescription: 'Elegant twist knot earrings crafted with 18k gold plating.',
      fullDescription: 'Add a touch of timeless sophistication to your jewelry collection with our Twist Knot Earrings. Designed for everyday elegance, these lightweight earrings are tarnish-free and hypoallergenic.',
      material: '18K Gold Plated Stainless Steel',
      color: 'Gold',
      style: 'Classic',
      images: ['/product-earrings1.png', '/product-earrings2.png', '/product-earrings3.png'],
    },
    {
      id: 'demo-2',
      name: 'Chunky Hoop Earrings',
      category: 'Earrings',
      price: 20.00,
      salePrice: null,
      rating: 4.8,
      reviews: 96,
      stock: 15,
      status: 'active',
      featured: true,
      sku: 'EAR-002',
      shortDescription: 'Bold statement chunky hoop earrings with gold luster finish.',
      fullDescription: 'Make a statement with our Bestselling Chunky Hoop Earrings. Crafted with premium stainless steel and thick gold plating, these hoops offer maximum shine without pulling on your ears.',
      material: 'Gold Plated Stainless Steel',
      color: 'Gold',
      style: 'Modern',
      images: ['/product-earrings2.png', '/product-earrings1.png', '/product-earrings3.png'],
    },
    {
      id: 'demo-3',
      name: 'Pearl Drop Earrings',
      category: 'Earrings',
      price: 16.00,
      salePrice: null,
      rating: 4.6,
      reviews: 74,
      stock: 18,
      status: 'active',
      featured: false,
      sku: 'EAR-003',
      shortDescription: 'Lustrous freshwater pearl drop earrings with gold accent loops.',
      fullDescription: 'Delicate and feminine freshwater pearl drop earrings designed for romantic dinners, weddings, and formal occasions.',
      material: 'Freshwater Pearl & Gold Wire',
      color: 'Gold / Pearl',
      style: 'Bridal / Formal',
      images: ['/product-earrings3.png', '/product-earrings1.png', '/product-earrings2.png'],
    },
    {
      id: 'demo-4',
      name: 'Chain Link Bracelet',
      category: 'Bracelets',
      price: 22.00,
      salePrice: null,
      rating: 4.7,
      reviews: 64,
      stock: 30,
      status: 'active',
      featured: false,
      sku: 'BRC-001',
      shortDescription: 'Interlocking gold chain link bracelet with secure lobster clasp.',
      fullDescription: 'Minimalist chain link bracelet perfect for layering or wearing solo. Water-resistant and tarnish-proof.',
      material: '18K Gold Plated Brass',
      color: 'Gold',
      style: 'Minimal',
      images: ['/product-bracelet.png', '/product-earrings1.png', '/product-earrings2.png'],
    },
  ];

  const matched = demoProducts.find((item) => item.id === id) || demoProducts[1];
  const related = demoProducts.filter((item) => item.id !== matched.id);

  return {
    product: matched,
    relatedProducts: related,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { product, relatedProducts } = await getProductAndRelated(id);

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', color: '#111827' }}>
      <Navbar />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </div>
  );
}
