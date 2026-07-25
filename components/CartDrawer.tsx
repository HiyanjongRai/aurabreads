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
  Shield,
  Sparkles,
  Plus,
  Minus,
  Gem,
  CheckCircle2,
  ChevronRight,
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
const PROMO_CODE = 'WELCOME10';
const PROMO_DISCOUNT = 0.1;

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

function ProductImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="cd-img-placeholder">
        <Gem size={20} strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="cd-item-img"
      onError={() => setFailed(true)}
    />
  );
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('aurabeads_cart');
      setItems(raw ? JSON.parse(raw) : []);
    } catch {
      setItems([]);
    }
  }, [isOpen]);

  const persist = (next: CartItem[]) => {
    setItems(next);
    try {
      localStorage.setItem('aurabeads_cart', JSON.stringify(next));
      window.dispatchEvent(new Event('aurabeads_cart_updated'));
    } catch { /* noop */ }
  };

  const remove = (id: string) => persist(items.filter(i => i.id !== id));
  const changeQty = (id: string, d: number) =>
    persist(items.map(i => i.id === id ? { ...i, qty: i.qty + d } : i).filter(i => i.qty > 0));

  const applyPromo = (code?: string) => {
    const c = (code ?? promoInput).trim().toUpperCase();
    if (!c) { setPromoError('Enter a promo code'); return; }
    if (c === PROMO_CODE) { setAppliedPromo(c); setPromoInput(''); setPromoError(''); }
    else setPromoError('Code not found. Try WELCOME10');
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discount  = appliedPromo ? +(subtotal * PROMO_DISCOUNT).toFixed(2) : 0;
  const shipping  = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 150;
  const total     = subtotal - discount + shipping;
  const qty       = items.reduce((s, i) => s + i.qty, 0);
  const progress  = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const remaining = +(Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)).toFixed(0);

  if (!isOpen) return null;

  return (
    <div
      className="cd-backdrop"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="cd-drawer">

        {/* Header */}
        <div className="cd-head">
          <div className="cd-head-left">
            <span className="cd-head-bag"><ShoppingBag size={16} strokeWidth={2} /></span>
            <div>
              <p className="cd-head-title">Your Bag</p>
              <p className="cd-head-count">{qty} {qty === 1 ? 'item' : 'items'}</p>
            </div>
          </div>
          <button className="cd-close" onClick={onClose} aria-label="Close">
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Shipping progress */}
        {items.length > 0 && (
          <div className="cd-ship-bar">
            <div className="cd-ship-row">
              <span className="cd-ship-left">
                <Truck size={13} strokeWidth={2} />
                {remaining === 0 ? (
                  <span className="cd-ship-done">
                    <CheckCircle2 size={12} strokeWidth={2.5} />
                    Free shipping unlocked
                  </span>
                ) : (
                  <span>NPR <strong>{remaining}</strong> away from free shipping</span>
                )}
              </span>
              <span className="cd-ship-pct">{progress}%</span>
            </div>
            <div className="cd-ship-track">
              <div className="cd-ship-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="cd-body">
          {items.length === 0 ? (
            <div className="cd-empty">
              <div className="cd-empty-icon">
                <ShoppingBag size={28} strokeWidth={1.5} />
              </div>
              <p className="cd-empty-title">Your bag is empty</p>
              <p className="cd-empty-text">Add pieces from our collection to get started.</p>
              <button className="cd-empty-cta" onClick={onClose}>
                Browse collection <ChevronRight size={14} />
              </button>
            </div>
          ) : (
            <>
              {items.map(item => (
                <div key={item.id} className="cd-item">
                  <div className="cd-item-img-box">
                    <ProductImage src={item.img} alt={item.name} />
                  </div>

                  <div className="cd-item-info">
                    {item.category && (
                      <span className="cd-item-cat">{item.category}</span>
                    )}
                    <p className="cd-item-name">{item.name}</p>
                    <p className="cd-item-each">NPR {item.price.toLocaleString()} / ea</p>

                    <div className="cd-item-foot">
                      <div className="cd-qty">
                        <button
                          className="cd-qty-btn"
                          onClick={() => changeQty(item.id, -1)}
                          aria-label="Remove one"
                        >
                          <Minus size={10} strokeWidth={2.5} />
                        </button>
                        <span className="cd-qty-num">{item.qty}</span>
                        <button
                          className="cd-qty-btn"
                          onClick={() => changeQty(item.id, 1)}
                          aria-label="Add one"
                        >
                          <Plus size={10} strokeWidth={2.5} />
                        </button>
                      </div>

                      <div className="cd-item-right">
                        <span className="cd-item-price">
                          NPR {(item.price * item.qty).toLocaleString()}
                        </span>
                        <button
                          className="cd-remove"
                          onClick={() => remove(item.id)}
                          aria-label="Remove"
                        >
                          <Trash2 size={13} strokeWidth={2} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cd-foot">

            {/* Promo */}
            {!appliedPromo ? (
              <div className="cd-promo">
                <div className="cd-promo-top">
                  <span className="cd-promo-label"><Tag size={12} strokeWidth={2} /> Promo code</span>
                  <button
                    className="cd-promo-auto"
                    onClick={() => applyPromo(PROMO_CODE)}
                  >
                    <Sparkles size={11} strokeWidth={2} /> Use WELCOME10
                  </button>
                </div>
                <div className="cd-promo-row">
                  <input
                    className="cd-promo-input"
                    type="text"
                    placeholder="Enter code"
                    value={promoInput}
                    onChange={e => { setPromoInput(e.target.value); setPromoError(''); }}
                    onKeyDown={e => e.key === 'Enter' && applyPromo()}
                  />
                  <button className="cd-promo-btn" onClick={() => applyPromo()}>Apply</button>
                </div>
                {promoError && (
                  <p className="cd-promo-err">{promoError}</p>
                )}
              </div>
            ) : (
              <div className="cd-promo-active">
                <span className="cd-promo-active-label">
                  <CheckCircle2 size={14} strokeWidth={2.5} />
                  {appliedPromo} — 10% off applied
                </span>
                <button
                  className="cd-promo-remove"
                  onClick={() => setAppliedPromo(null)}
                  aria-label="Remove promo"
                >
                  <X size={13} strokeWidth={2} />
                </button>
              </div>
            )}

            {/* Totals */}
            <div className="cd-totals">
              <div className="cd-total-row">
                <span>Subtotal</span>
                <span>NPR {subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="cd-total-row cd-total-discount">
                  <span>Discount ({appliedPromo})</span>
                  <span>− NPR {discount.toLocaleString()}</span>
                </div>
              )}
              <div className="cd-total-row">
                <span>Shipping</span>
                {shipping === 0 ? (
                  <span className="cd-total-free">
                    <CheckCircle2 size={11} strokeWidth={2.5} /> Free
                  </span>
                ) : (
                  <span>NPR {shipping}</span>
                )}
              </div>
              <div className="cd-total-grand">
                <span>Total</span>
                <span>NPR {total.toLocaleString()}</span>
              </div>
            </div>

            {/* CTA */}
            <Link href="/checkout" onClick={onClose} className="cd-cta">
              Checkout
              <ArrowRight size={15} strokeWidth={2} />
            </Link>

            <div className="cd-secure">
              <Shield size={11} strokeWidth={2} />
              <span>Secure checkout — 256-bit SSL</span>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
