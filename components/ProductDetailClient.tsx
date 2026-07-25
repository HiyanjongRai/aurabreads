'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  RotateCcw,
  Award,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Sparkles,
  Droplets,
  Feather,
  Gift,
  Star,
  ShoppingBag,
} from 'lucide-react';

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  salePrice?: number | null;
  rating?: number;
  reviews?: number;
  stock?: number;
  status?: string;
  featured?: boolean;
  sku?: string | null;
  shortDescription?: string | null;
  fullDescription?: string | null;
  material?: string | null;
  color?: string | null;
  style?: string | null;
  images?: string[];
};

type Props = {
  product: Product;
};

const demoRelatedProducts = [
  { id: 'demo-1', name: 'Twist Knot Earrings', price: 18.00, rating: 4.8, reviews: 128, img: '/product-earrings1.png' },
  { id: 'demo-3', name: 'Pearl Drop Earrings', price: 16.00, rating: 4.6, reviews: 74, img: '/product-earrings3.png' },
  { id: 'demo-4', name: 'Chain Link Bracelet', price: 22.00, rating: 4.7, reviews: 64, img: '/product-bracelet.png' },
  { id: 'demo-5', name: 'Dainty Heart Necklace', price: 19.00, rating: 4.9, reviews: 90, img: '/product-earrings1.png' },
  { id: 'demo-6', name: 'Teardrop Earrings', price: 17.00, rating: 4.8, reviews: 68, img: '/product-earrings2.png' },
];

export default function ProductDetailClient({ product }: Props) {
  const images = product.images && product.images.length > 0 ? product.images : ['/product-earrings2.png', '/product-earrings1.png', '/product-earrings3.png'];
  const [selectedImg, setSelectedImg] = useState<string>(images[0]);
  const [selectedColor, setSelectedColor] = useState<string>('Gold');
  const [qty, setQty] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({ details: true });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddToCart = () => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('aurabeads_cart');
        const cartItems: any[] = stored ? JSON.parse(stored) : [];
        const existing = cartItems.find((item) => item.id === product.id);
        if (existing) {
          existing.qty += qty;
        } else {
          cartItems.push({
            id: product.id,
            name: product.name,
            price: product.salePrice ?? product.price,
            qty: qty,
            img: selectedImg || images[0],
            category: product.category,
          });
        }
        localStorage.setItem('aurabeads_cart', JSON.stringify(cartItems));
        window.dispatchEvent(new Event('aurabeads_cart_updated'));
      } catch (e) {
        console.error('Add to cart error:', e);
      }
    }
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 20px 60px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* ── Breadcrumb Nav ─────────────────────────────────────────────────── */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#6b7280', marginBottom: 28, flexWrap: 'wrap' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#6b7280' }}>Home</Link>
        <span>&gt;</span>
        <Link href="/#categories" style={{ textDecoration: 'none', color: '#6b7280' }}>{product.category || 'Earrings'}</Link>
        <span>&gt;</span>
        <span style={{ color: '#111827', fontWeight: 600 }}>{product.name}</span>
      </nav>

      {/* ── Main Product Detail Grid ───────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 44, alignItems: 'start', marginBottom: 64 }}>
        
        {/* Left Column: Image Gallery (Screenshot 2 layout) */}
        <div style={{ display: 'flex', gap: 16 }}>
          {/* Vertical Thumbnails */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 72, flexShrink: 0 }}>
            {images.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImg(imgUrl)}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: selectedImg === imgUrl ? '2px solid #d4af37' : '1px solid #e5e7eb',
                  background: '#fcfbf9',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.15s',
                }}
              >
                <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>

          {/* Large Main Display Image */}
          <div style={{
            position: 'relative',
            flex: 1,
            aspectRatio: '1',
            borderRadius: 20,
            overflow: 'hidden',
            background: '#fbf9f6',
            border: '1px solid #f3f4f6',
          }}>
            <img src={selectedImg || images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            
            {/* Zoom Button */}
            <button
              onClick={() => window.open(selectedImg || images[0], '_blank')}
              style={{
                position: 'absolute', top: 16, right: 16, width: 36, height: 36,
                borderRadius: '50%', background: 'rgba(255,255,255,0.9)',
                border: '1px solid #e5e7eb', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)', color: '#374151',
              }}
              aria-label="Expand image"
            >
              <Maximize2 size={16} />
            </button>
          </div>
        </div>

        {/* Right Column: Product Meta & Purchase Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Tag & Title */}
          <div>
            <span style={{
              display: 'inline-block',
              background: '#fef3c7',
              color: '#b45309',
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '4px 10px',
              borderRadius: 4,
              marginBottom: 10,
            }}>
              BESTSELLER
            </span>

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <h1 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 34,
                fontWeight: 700,
                color: '#111827',
                margin: 0,
                lineHeight: 1.15,
              }}>
                {product.name}
              </h1>

              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 6,
                  color: isWishlisted ? '#e11d48' : '#9ca3af',
                  transition: 'transform 0.2s',
                }}
              >
                <Heart size={22} fill={isWishlisted ? '#e11d48' : 'none'} />
              </button>
            </div>

            {/* Ratings */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <div style={{ display: 'flex', color: '#f59e0b', fontSize: 14 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{product.rating || 4.8}</span>
              <span style={{ fontSize: 12, color: '#6b7280' }}>({product.reviews || 96} Reviews)</span>
            </div>
          </div>

          {/* Pricing & Installments */}
          <div style={{ paddingBottom: 16, borderBottom: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: '#111827' }}>
                NPR {(product.salePrice ?? product.price).toLocaleString()}
              </span>
              {product.salePrice && product.salePrice < product.price && (
                <span style={{ fontSize: 16, color: '#9ca3af', textDecoration: 'line-through' }}>
                  NPR {product.price.toLocaleString()}
                </span>
              )}
            </div>

            <p style={{ fontSize: 12, color: '#4b5563', margin: '6px 0 0', display: 'flex', alignItems: 'center', gap: 6 }}>
              Pay in 4 interest-free payments of NPR {((product.salePrice ?? product.price) / 4).toFixed(2)} with{' '}
              <span style={{ background: '#a7f3d0', color: '#065f46', fontWeight: 800, padding: '1px 6px', borderRadius: 4, fontSize: 10 }}>
                Afterpay
              </span>
            </p>
          </div>

          {/* Color Selector */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
              COLOR: <span style={{ fontWeight: 500, textTransform: 'none' }}>{selectedColor}</span>
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { name: 'Gold', hex: '#d4af37' },
                { name: 'Silver', hex: '#d1d5db' },
                { name: 'Rose Gold', hex: '#fda4af' },
              ].map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: c.hex,
                    border: selectedColor === c.name ? '2.5px solid #111827' : '1px solid #e5e7eb',
                    cursor: 'pointer',
                    boxShadow: 'inset 0 0 0 2px #ffffff',
                    transition: 'transform 0.15s',
                  }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Quantity Selector + Stock */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
              QUANTITY
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: 12, background: '#ffffff', overflow: 'hidden' }}>
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  style={{ padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', color: '#374151', display: 'flex' }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ width: 36, textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#111827' }}>{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  style={{ padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', color: '#374151', display: 'flex' }}
                >
                  <Plus size={14} />
                </button>
              </div>

              <span style={{ fontSize: 12, fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', gap: 4 }}>
                ✓ In Stock ({product.stock ?? 15} available)
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 6 }}>
            <button
              onClick={handleAddToCart}
              style={{
                width: '100%',
                padding: '15px 24px',
                borderRadius: 12,
                background: '#000000',
                color: '#ffffff',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              }}
            >
              <ShoppingBag size={16} />
              <span>Add to Cart</span>
            </button>

            <button
              style={{
                width: '100%',
                padding: '14px 24px',
                borderRadius: 12,
                background: '#ffffff',
                border: '1.5px solid #d4af37',
                color: '#a07c2e',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Buy Now
            </button>
          </div>

          {/* Security Features Line */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontSize: 11, color: '#6b7280', paddingTop: 8 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><ShieldCheck size={14} className="text-emerald-600" /> Secure Checkout</span>
            <span>|</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><RotateCcw size={14} /> 30-Day Returns</span>
            <span>|</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Award size={14} /> 1 Year Warranty</span>
          </div>

          {/* Accordion Panels (Right Sidebar Screenshot 2) */}
          <div style={{ borderTop: '1px solid #e5e7eb', marginTop: 12 }}>
            {[
              { key: 'details', title: 'Product Details', content: product.fullDescription || 'Crafted with high-grade stainless steel and double-dipped in 18k gold plating for long-lasting luster and tarnish resistance.' },
              { key: 'materials', title: 'Materials', content: product.material || 'Gold Plated Stainless Steel · Hypoallergenic · Nickel-Free' },
              { key: 'shipping', title: 'Shipping', content: 'Free standard shipping on orders over NPR 50. Delivered within 3-5 business days.' },
              { key: 'returns', title: 'Returns', content: '30-day hassle-free returns. Returned items must be unworn and in original condition.' },
            ].map((acc) => (
              <div key={acc.key} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <button
                  onClick={() => toggleAccordion(acc.key)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 0',
                    background: 'none',
                    border: 'none',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#111827',
                    cursor: 'pointer',
                  }}
                >
                  <span>{acc.title}</span>
                  {openAccordions[acc.key] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordions[acc.key] && (
                  <p style={{ fontSize: 12, color: '#4b5563', lineHeight: 1.6, margin: '0 0 14px' }}>
                    {acc.content}
                  </p>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── Middle Trust Features Strip (Screenshot 2) ────────────────────── */}
      <div style={{
        background: '#0a0a0f',
        color: '#ffffff',
        borderRadius: 20,
        padding: '36px 32px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 24,
        marginBottom: 64,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Sparkles size={28} color="#d4af37" />
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Premium Quality</h4>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: '2px 0 0' }}>Tarnish-resistant & long-lasting shine</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Droplets size={28} color="#d4af37" />
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Water Resistant</h4>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: '2px 0 0' }}>Wear it in the shower, pool & ocean</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Feather size={28} color="#d4af37" />
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Hypoallergenic</h4>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: '2px 0 0' }}>Safe for sensitive skin</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Gift size={28} color="#d4af37" />
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Perfect Gift</h4>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: '2px 0 0' }}>Beautifully packed for your loved ones</p>
          </div>
        </div>
      </div>

      {/* ── You May Also Like Section ───────────────────────────────────────── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: 0 }}>You May Also Like</h3>
          <Link href="/#categories" style={{ fontSize: 12, fontWeight: 700, color: '#d4af37', textDecoration: 'none' }}>View All</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
          {demoRelatedProducts.map((rel) => (
            <Link
              key={rel.id}
              href={`/product/${rel.id}`}
              style={{
                background: '#ffffff',
                borderRadius: 16,
                overflow: 'hidden',
                border: '1px solid #f3f4f6',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ height: 180, background: '#fcfbf9', position: 'relative' }}>
                <img src={rel.img} alt={rel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rel.name}</p>
                <p style={{ fontSize: 13, fontWeight: 800, color: '#d4af37', margin: '4px 0 0' }}>NPR {rel.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
