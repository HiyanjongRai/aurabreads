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
  relatedProducts?: Product[];
};

type ProductCartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  img: string;
  category?: string | null;
};

function getInitialProduct(product: Product) {
  if (typeof window === 'undefined') return product;

  try {
    const raw = sessionStorage.getItem('aurabeads_last_viewed_product');
    if (!raw) return product;

    const cached = JSON.parse(raw) as Product;
    if (cached.id !== product.id) return product;

    return {
      ...product,
      ...cached,
      images: cached.images && cached.images.length > 0 ? cached.images : product.images,
    };
  } catch {
    return product;
  }
}

export default function ProductDetailClient({ product: initialProduct, relatedProducts = [] }: Props) {
  const [displayProduct] = useState<Product>(() => getInitialProduct(initialProduct));
  const product = displayProduct;
  const images = product.images && product.images.length > 0 ? product.images : ['/product-earrings2.png'];
  const [selectedImg, setSelectedImg] = useState<string>(images[0]);
  const [selectedColor, setSelectedColor] = useState<string>(product.color ?? '');
  const [qty, setQty] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [addedToast, setAddedToast] = useState<boolean>(false);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({ details: true });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddToCart = () => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('aurabeads_cart');
        const cartItems: ProductCartItem[] = stored ? JSON.parse(stored) : [];
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
        
        setAddedToast(true);
        setTimeout(() => setAddedToast(false), 3000);
      } catch (e) {
        console.error('Add to cart error:', e);
      }
    }
  };

  return (
    <div className="product-detail-page" style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 20px 60px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* ── Breadcrumb Nav ─────────────────────────────────────────────────── */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#6b7280', marginBottom: 28, flexWrap: 'wrap' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#6b7280' }}>Home</Link>
        <span>&gt;</span>
        <Link href="/#categories" style={{ textDecoration: 'none', color: '#6b7280' }}>{product.category || 'Earrings'}</Link>
        <span>&gt;</span>
        <span style={{ color: '#111827', fontWeight: 600 }}>{product.name}</span>
      </nav>

      {/* ── Main Product Detail Grid ───────────────────────────────────────── */}
      <div className="product-detail-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 44, alignItems: 'start', marginBottom: 64 }}>
        
        {/* Left Column: Image Gallery (Screenshot 2 layout) */}
        <div className="product-detail-gallery-row" style={{ display: 'flex', gap: 16 }}>
          {/* Vertical Thumbnails */}
          <div className="product-detail-thumbs" style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 72, flexShrink: 0 }}>
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
          <div className="product-detail-main-image" style={{
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
        <div className="product-detail-info" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Tag & Title */}
          <div>
            {product.featured ? (
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
            ) : null}

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
            {product.shortDescription && (
              <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.8, marginTop: 16, maxWidth: 560 }}>
                {product.shortDescription}
              </p>
            )}
          </div>

          {/* Ratings */}
          {(product.rating != null || product.reviews != null) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <div style={{ display: 'flex', color: '#f59e0b', fontSize: 14 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} fill={product.rating && s <= Math.round(product.rating) ? '#f59e0b' : 'none'} color="#f59e0b" />
                ))}
              </div>
              {product.rating != null && <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{product.rating.toFixed(1)}</span>}
              {product.reviews != null && (
                <span style={{ fontSize: 12, color: '#6b7280' }}>({product.reviews} Reviews)</span>
              )}
            </div>
          )}

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
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12, color: '#6b7280', fontSize: 12 }}>
              {product.sku && <span>SKU: {product.sku}</span>}
              <span>Category: {product.category}</span>
              <span>{product.stock != null ? `${product.stock} in stock` : 'Stock info unavailable'}</span>
              {product.style && <span>Style: {product.style}</span>}
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
              COLOR: <span style={{ fontWeight: 500, textTransform: 'none' }}>{selectedColor || 'Select'}</span>
            </label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {product.color ? (
                <button
                  onClick={() => setSelectedColor(product.color || '')}
                  style={{
                    minWidth: 88,
                    padding: '10px 14px',
                    borderRadius: 999,
                    border: '1px solid #d1d5db',
                    background: '#f8fafc',
                    cursor: 'pointer',
                    color: '#111827',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {product.color}
                </button>
              ) : (
                <span style={{ color: '#6b7280', fontSize: 12 }}>Color information unavailable</span>
              )}
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
              { key: 'details', title: 'Product Details', content: product.fullDescription ?? 'Product details are currently unavailable.' },
              { key: 'materials', title: 'Materials', content: product.material ?? 'Material information is currently unavailable.' },
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
      <div className="product-trust-strip" style={{
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

      {/* Floating Add to Cart Toast Banner */}
      {addedToast && (
        <div style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          zIndex: 9999,
          background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
          color: '#ffffff',
          border: '1.5px solid #d4af37',
          borderRadius: 16,
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          boxShadow: '0 12px 36px rgba(0,0,0,0.3)',
          animation: 'slide-left 0.3s ease-out',
        }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(212,175,55,0.2)', color: '#d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingBag size={15} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>Added to Shopping Bag!</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', margin: '2px 0 0' }}>{qty}x {product.name}</p>
          </div>
        </div>
      )}

      {/* ── You May Also Like Section (Dynamic DB Items) ──────────────────── */}
      {relatedProducts.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: 0 }}>You May Also Like</h3>
            <Link href="/#categories" style={{ fontSize: 12, fontWeight: 700, color: '#d4af37', textDecoration: 'none' }}>View All</Link>
          </div>

          <div className="product-related-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
            {relatedProducts.map((rel) => {
              const relImg = rel.images && rel.images.length > 0 ? rel.images[0] : '/product-earrings1.png';
              return (
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
                    transition: 'transform 0.2s',
                  }}
                >
                  <div style={{ height: 180, background: '#fcfbf9', position: 'relative' }}>
                    <img src={relImg} alt={rel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rel.name}</p>
                    <p style={{ fontSize: 13, fontWeight: 800, color: '#d4af37', margin: '4px 0 0' }}>
                      NPR {(rel.salePrice ?? rel.price).toFixed(2)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
