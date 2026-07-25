'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  ShoppingBag,
  ArrowRight,
  Trash2,
  Tag,
  Truck,
  ShieldCheck,
  Sparkles,
  Plus,
  Minus,
  Package,
  Gift,
} from 'lucide-react';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  img: string;
  category?: string;
};

const FREE_SHIPPING_THRESHOLD = 50;
const SAMPLE_PROMO_CODE = 'WELCOME10';
const PROMO_DISCOUNT = 0.1;

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

/* Fallback image component — shows elegant placeholder when img is broken */
function ItemImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="cd-img-fallback">
        <Gift size={22} className="cd-img-fallback-icon" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="cd-item-img"
      onError={() => setError(true)}
    />
  );
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('aurabeads_cart');
        setItems(stored ? JSON.parse(stored) : []);
      } catch {
        setItems([]);
      }
    }
  }, [isOpen]);

  const updateCart = (newItems: CartItem[]) => {
    setItems(newItems);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('aurabeads_cart', JSON.stringify(newItems));
        window.dispatchEvent(new Event('aurabeads_cart_updated'));
      } catch (e) {
        console.error('Cart sync error:', e);
      }
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountAmount = appliedPromo ? subtotal * PROMO_DISCOUNT : 0;
  const estimatedShipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 150;
  const total = subtotal - discountAmount + estimatedShipping;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const totalItemCount = items.reduce((sum, item) => sum + item.qty, 0);

  const removeItem = (id: string) => updateCart(items.filter(i => i.id !== id));

  const updateQty = (id: string, delta: number) => {
    const updated = items
      .map(item => item.id === id ? { ...item, qty: item.qty + delta } : item)
      .filter(item => item.qty > 0);
    updateCart(updated);
  };

  const handleApplyPromo = (codeToApply?: string) => {
    setPromoError('');
    const code = (codeToApply || promoCode).trim().toUpperCase();
    if (!code) { setPromoError('Enter a promo code first'); return; }
    if (code === SAMPLE_PROMO_CODE) {
      setAppliedPromo(code);
      setPromoCode('');
    } else {
      setPromoError('Invalid code. Try WELCOME10');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
  };

  if (!isOpen) return null;

  return (
    <div className="cd-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="cd-panel">

        {/* ── Header ───────────────────────────── */}
        <div className="cd-header">
          <div className="cd-header-left">
            <div className="cd-header-icon">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h2 className="cd-header-title">Shopping Bag</h2>
              <p className="cd-header-sub">
                {totalItemCount === 0 ? 'Empty' : `${totalItemCount} ${totalItemCount === 1 ? 'item' : 'items'}`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="cd-close-btn" aria-label="Close cart">
            <X size={18} />
          </button>
        </div>

        {/* ── Free Shipping Bar ─────────────────── */}
        {items.length > 0 && (
          <div className="cd-shipping-bar">
            <div className="cd-shipping-bar-text">
              <span className="cd-shipping-bar-icon"><Truck size={12} /></span>
              {amountNeeded === 0 ? (
                <span className="cd-shipping-unlocked">🎉 You unlocked <strong>FREE shipping</strong>!</span>
              ) : (
                <span>Add <strong>NPR {amountNeeded.toFixed(0)}</strong> more for free shipping</span>
              )}
              <span className="cd-shipping-pct">{progressToFreeShipping}%</span>
            </div>
            <div className="cd-shipping-track">
              <div className="cd-shipping-fill" style={{ width: `${progressToFreeShipping}%` }} />
            </div>
          </div>
        )}

        {/* ── Cart Items ────────────────────────── */}
        <div className="cd-items-area">
          {items.length === 0 ? (
            <div className="cd-empty">
              <div className="cd-empty-icon"><ShoppingBag size={36} /></div>
              <h3 className="cd-empty-title">Your bag is empty</h3>
              <p className="cd-empty-sub">Explore our handcrafted collection and find pieces you&apos;ll love.</p>
              <button onClick={onClose} className="cd-empty-btn">
                Browse Collection →
              </button>
            </div>
          ) : (
            <div className="cd-items-list">
              {items.map((item) => (
                <div key={item.id} className="cd-item">
                  {/* Product Image */}
                  <div className="cd-item-img-wrap">
                    <ItemImage src={item.img} alt={item.name} />
                  </div>

                  {/* Product Info */}
                  <div className="cd-item-body">
                    <div className="cd-item-top">
                      <div className="cd-item-meta">
                        {item.category && (
                          <span className="cd-item-cat">{item.category}</span>
                        )}
                        <h3 className="cd-item-name">{item.name}</h3>
                        <p className="cd-item-unit-price">NPR {item.price.toLocaleString()} each</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="cd-remove-btn"
                        aria-label="Remove item"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Qty + Price Row */}
                    <div className="cd-item-bottom">
                      <div className="cd-qty-control">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="cd-qty-btn"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="cd-qty-val">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="cd-qty-btn"
                          aria-label="Increase quantity"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                      <span className="cd-item-total">
                        NPR {(item.price * item.qty).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Upsell nudge */}
              <div className="cd-upsell">
                <Package size={13} />
                <span>All orders are gift-wrapped & packaged with care</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ─────────────────────────── */}
        {items.length > 0 && (
          <div className="cd-footer">

            {/* Promo Code */}
            {!appliedPromo ? (
              <div className="cd-promo-row">
                <div className="cd-promo-label">
                  <Tag size={12} />
                  <span>Promo Code</span>
                </div>
                <button
                  className="cd-promo-hint"
                  onClick={() => handleApplyPromo(SAMPLE_PROMO_CODE)}
                >
                  <Sparkles size={10} /> WELCOME10 (10% off)
                </button>
                <div className="cd-promo-input-row">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={e => { setPromoCode(e.target.value); setPromoError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleApplyPromo()}
                    placeholder="Enter promo code"
                    className="cd-promo-input"
                  />
                  <button onClick={() => handleApplyPromo()} className="cd-promo-apply-btn">
                    Apply
                  </button>
                </div>
                {promoError && <p className="cd-promo-error">{promoError}</p>}
              </div>
            ) : (
              <div className="cd-promo-applied">
                <div className="cd-promo-applied-left">
                  <Sparkles size={13} />
                  <span>{appliedPromo} — 10% OFF applied</span>
                </div>
                <button onClick={handleRemovePromo} className="cd-promo-remove">
                  <X size={13} />
                </button>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="cd-totals">
              <div className="cd-total-row">
                <span>Subtotal</span>
                <span>NPR {subtotal.toLocaleString()}</span>
              </div>
              {appliedPromo && (
                <div className="cd-total-row cd-discount-row">
                  <span>Discount ({appliedPromo})</span>
                  <span>−NPR {discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="cd-total-row">
                <span>Shipping</span>
                <span className={estimatedShipping === 0 ? 'cd-free' : ''}>
                  {estimatedShipping === 0 ? 'FREE 🎉' : `NPR ${estimatedShipping}`}
                </span>
              </div>
              <div className="cd-total-final">
                <span>Total</span>
                <span>NPR {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <Link
              href="/checkout"
              onClick={onClose}
              className="cd-checkout-btn"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </Link>

            {/* Security line */}
            <div className="cd-secure-line">
              <ShieldCheck size={11} />
              <span>256-Bit SSL Encrypted &amp; Safe Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
