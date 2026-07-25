'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, ShoppingBag, ArrowRight, Trash2, Tag, Truck, ShieldCheck, Sparkles, Plus, Minus } from 'lucide-react';

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
const PROMO_DISCOUNT = 0.1; // 10%

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');

  // Load dynamic cart items from localStorage on mount & when drawer opens
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('aurabeads_cart');
        if (stored) {
          setItems(JSON.parse(stored));
        } else {
          setItems([]);
        }
      } catch {
        setItems([]);
      }
    }
  }, [isOpen]);

  // Sync cart items to localStorage and notify components
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
  const total = subtotal - discountAmount;
  const progressToFreeShipping = Math.min(100, Math.round((total / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const totalItemCount = items.reduce((sum, item) => sum + item.qty, 0);

  const removeItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    updateCart(updated);
  };

  const updateQty = (id: string, delta: number) => {
    const updated = items
      .map((item) => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];

    updateCart(updated);
  };

  const handleApplyPromo = (codeToApply?: string) => {
    setPromoError('');
    const code = (codeToApply || promoCode).trim().toUpperCase();
    if (!code) {
      setPromoError('Please enter a promo code');
      return;
    }
    if (code === SAMPLE_PROMO_CODE) {
      setAppliedPromo(code);
      setPromoCode('');
    } else {
      setPromoError('Invalid promo code. Try WELCOME10');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex justify-end bg-black/65 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl overflow-hidden animate-slide-left">

        {/* ── Header (Fixed) ────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 flex items-center justify-between border-b border-gray-100 px-5 py-4 bg-gray-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gold-500/20 border border-gold-500/30 text-gold-400">
              <ShoppingBag size={17} />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold tracking-tight text-white leading-tight">Your Shopping Bag</h2>
              <p className="text-[11px] text-gray-400 font-medium">
                {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} selected
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-gray-300 transition hover:bg-white/20 hover:text-white"
            aria-label="Close cart"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Free Shipping Progress Bar (Fixed) ───────────────────────────── */}
        {items.length > 0 && (
          <div className="flex-shrink-0 bg-amber-50/80 border-b border-amber-100 px-5 py-2.5">
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="flex items-center gap-1.5 text-amber-900">
                <Truck size={13} className="text-amber-700" />
                {amountNeededForFreeShipping === 0 ? (
                  <strong className="text-emerald-700">Congratulations! You unlocked FREE shipping 🎉</strong>
                ) : (
                  <span>Add <strong className="text-amber-900">NPR {amountNeededForFreeShipping.toFixed(2)}</strong> for FREE Shipping</span>
                )}
              </span>
              <span className="text-[11px] font-bold text-amber-800">{progressToFreeShipping}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-amber-200/60 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold-500 to-amber-600 transition-all duration-500"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>
        )}

        {/* ── Cart Items Scrollable Container (Flexible) ─────────────────── */}
        <div className="flex-1 overflow-y-auto min-h-0 px-5 py-3 space-y-3">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-4 text-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gold-50 text-gold-600 border border-gold-100 shadow-inner">
                <ShoppingBag size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-gray-900">Your shopping bag is empty</h3>
                <p className="max-w-xs text-xs text-gray-500 leading-relaxed">
                  Explore our handcrafted jewelry collection and add your favorite pieces to your cart.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 rounded-xl bg-gray-900 px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-black"
              >
                Start Shopping →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group flex gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition hover:border-gold-200"
                >
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50 border border-gray-100">
                    <img src={item.img} alt={item.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                  </div>

                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div className="flex justify-between items-start gap-1">
                      <div className="min-w-0">
                        {item.category && (
                          <span className="block text-[9px] font-bold tracking-wider text-gold-700 uppercase leading-none mb-1">{item.category}</span>
                        )}
                        <h3 className="text-xs font-bold text-gray-900 truncate">{item.name}</h3>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition p-1 rounded-md hover:bg-red-50 flex-shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-0.5">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="flex h-5 w-5 items-center justify-center rounded text-gray-600 hover:bg-white hover:text-black transition"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-gray-900">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="flex h-5 w-5 items-center justify-center rounded text-gray-600 hover:bg-white hover:text-black transition"
                        >
                          <Plus size={10} />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-extrabold text-gray-900">
                          NPR {(item.price * item.qty).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Footer & Checkout Section (Fixed at Bottom) ─────────────────── */}
        {items.length > 0 && (
          <div className="flex-shrink-0 border-t border-gray-100 bg-white px-5 py-4 space-y-3 shadow-lg">

            {/* Quick Promo Selector */}
            {!appliedPromo ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                    <Tag size={12} className="text-gold-600" />
                    Promo code
                  </label>
                  <button
                    onClick={() => handleApplyPromo(SAMPLE_PROMO_CODE)}
                    className="text-[10px] font-bold text-gold-700 hover:text-gold-800 flex items-center gap-1 underline"
                  >
                    <Sparkles size={10} /> Use WELCOME10 (-10%)
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value);
                      setPromoError('');
                    }}
                    placeholder="Enter code (e.g. WELCOME10)"
                    className="flex-1 h-8 px-3 rounded-lg border border-gray-200 text-xs outline-none focus:border-gold-500"
                  />
                  <button
                    onClick={() => handleApplyPromo()}
                    className="px-3.5 h-8 bg-gold-600 text-white text-xs font-bold rounded-lg flex-shrink-0 hover:bg-gold-700 transition"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-[10px] text-red-600 font-medium">{promoError}</p>}
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <Sparkles size={12} /> {appliedPromo} Applied
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-200/60 text-emerald-800 px-1.5 py-0.5 rounded-full">
                    -{(PROMO_DISCOUNT * 100)}% OFF
                  </span>
                </div>
                <button
                  onClick={handleRemovePromo}
                  className="text-emerald-700 hover:text-emerald-900 p-0.5"
                  aria-label="Remove promo code"
                >
                  <X size={13} />
                </button>
              </div>
            )}

            {/* Price Summary Breakdown */}
            <div className="space-y-1 text-xs pt-1 border-t border-gray-100">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">NPR {subtotal.toLocaleString()}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount ({appliedPromo})</span>
                  <span>-NPR {discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Estimated Shipping</span>
                <span className={amountNeededForFreeShipping === 0 ? 'text-emerald-700 font-bold' : 'font-semibold text-gray-900'}>
                  {amountNeededForFreeShipping === 0 ? 'FREE' : 'NPR 150'}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-1 border-t border-gray-100">
                <span>Total Amount</span>
                <span className="text-gold-600 font-black">NPR {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all hover:bg-black active:scale-[0.99] cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={15} />
            </Link>

            <div className="flex items-center justify-center gap-1 text-[10px] text-gray-400 font-medium">
              <ShieldCheck size={12} className="text-emerald-600" />
              <span>256-Bit SSL Encrypted &amp; Guaranteed Safe Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
