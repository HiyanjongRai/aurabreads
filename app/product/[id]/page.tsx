import { getDb } from '@/lib/db';
import Navbar from '@/components/Navbar';
import ProductDetailClient from '@/components/ProductDetailClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getProductById(id: string) {
  // 1. Try Prisma DB query
  try {
    const db = getDb();
    const product = await db.product.findUnique({
      where: { id },
      include: { seller: { select: { name: true, email: true } } },
    });
    if (product) return product;
  } catch (err) {
    console.warn('[getProductById] Prisma error:', err);
  }

  // 2. Demo fallback data matching exact Screenshot 2
  const demoCatalog = [
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

  const matched = demoCatalog.find((item) => item.id === id);
  if (matched) return matched;

  // Fallback default product if unknown ID
  return {
    id,
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
    fullDescription: 'Make a statement with our Bestselling Chunky Hoop Earrings. Crafted with premium stainless steel and thick gold plating.',
    material: 'Gold Plated Stainless Steel',
    color: 'Gold',
    style: 'Modern',
    images: ['/product-earrings2.png', '/product-earrings1.png', '/product-earrings3.png'],
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', color: '#111827' }}>
      <Navbar />
      <ProductDetailClient product={product} />
    </div>
  );
}
