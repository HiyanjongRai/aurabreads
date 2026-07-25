'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingBag, ArrowRight, Trash2, Tag, Truck, ShieldCheck, Sparkles, Plus, Minus } from 'lucide-react';

type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  img: string;
  category?: string;
};

const initialItems: CartItem[] = [
  { id: '1', name: 'Twist Knot Earrings', price: 18, qty: 1, img: '/product-earrings1.png', category: 'Earrings' },
  { id: '2', name: 'Chunky Hoop Earrings', price: 20, qty: 1, img: '/product-earrings2.png', category: 'Earrings' },
];

const FREE_SHIPPING_THRESHOLD = 50;
const SAMPLE_PROMO_CODE = 'WELCOME10';
const PROMO_DISCOUNT = 0.1; // 10%

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountAmount = appliedPromo ? subtotal * PROMO_DISCOUNT : 0;
  const total = subtotal - discountAmount;
  const progressToFreeShipping = Math.min(100, Math.round((total / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const totalItemCount = items.reduce((sum, item) => sum + item.qty, 0);

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[],
    );
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
      className="fixed inset-0 z-[999] flex justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-slide-left">

        {/* ── Header ────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 bg-gradient-to-r from-gray-900 via-gray-900 to-gray-800 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-500/20 border border-gold-500/30 text-gold-400">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold tracking-tight text-white">Your Shopping Bag</h2>
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

        {/* ── Free Shipping Progress Bar ───────────────────────────────────── */}
        {items.length > 0 && (
          <div className="bg-amber-50/70 border-b border-amber-100/80 px-6 py-3">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="flex items-center gap-1.5 text-amber-900">
                <Truck size={14} className="text-amber-700" />
                {amountNeededForFreeShipping === 0 ? (
                  <strong className="text-emerald-700">Congratulations! You unlocked FREE shipping 🎉</strong>
                ) : (
                  <span>Add <strong className="text-amber-900">NPR {amountNeededForFreeShipping.toFixed(2)}</strong> for FREE Shipping</span>
                )}
              </span>
              <span className="text-[11px] font-bold text-amber-800">{progressToFreeShipping}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-amber-200/60 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold-500 to-amber-600 transition-all duration-500"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>
        )}

        {/* ── Cart Items Scrollable Container ─────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-4 text-center py-12">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gold-50 text-gold-600 border border-gold-100 shadow-inner">
                <ShoppingBag size={36} />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-gray-900">Your shopping bag is empty</h3>
                <p className="max-w-xs text-xs text-gray-500 leading-relaxed">
                  Explore our luxury handcrafted jewelry collections and add your favorite pieces.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-4 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-3 text-xs font-bold text-white shadow-md transition hover:from-black hover:to-gray-900 hover:shadow-lg"
              >
                Explore Collection →
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group flex gap-3.5 rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm transition hover:border-gold-200 hover:shadow-md"
                >
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
                    <Image src={item.img} alt={item.name} fill className="object-cover transition duration-300 group-hover:scale-105" />
                  </div>

                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        {item.category && (
                          <span className="text-[10px] font-bold tracking-wider text-gold-700 uppercase">{item.category}</span>
                        )}
                        <h3 className="text-xs font-bold text-gray-900 truncate max-w-[180px]">{item.name}</h3>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition p-1 rounded-lg hover:bg-red-50"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 p-0.5">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="flex h-6 w-6 items-center justify-center rounded-lg text-gray-600 hover:bg-white hover:text-black transition"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-gray-900">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-lg text-gray-600 hover:bg-white hover:text-black transition"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-extrabold text-gray-900">
                          NPR {(item.price * item.qty).toLocaleString()}
                        </span>
                        {item.qty > 1 && (
                          <span className="block text-[10px] text-gray-400">NPR {item.price}/ea</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Footer & Checkout Section ───────────────────────────────────── */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 bg-white p-5 space-y-4 shadow-2xl">

            {/* Quick Promo Selector */}
            {!appliedPromo ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                    <Tag size={13} className="text-gold-600" />
                    Have a promo code?
                  </label>
                  <button
                    onClick={() => handleApplyPromo(SAMPLE_PROMO_CODE)}
                    className="text-[10px] font-bold text-gold-700 hover:text-gold-800 flex items-center gap-1 underline"
                  >
                    <Sparkles size={11} /> Use WELCOME10 (-10%)
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
                    className="flex-1 h-9 px-3 rounded-xl border border-gray-200 text-xs outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                  />
                  <button
                    onClick={() => handleApplyPromo()}
                    className="px-4 h-9 bg-gold-600 text-white text-xs font-bold rounded-xl hover:bg-gold-700 transition shadow-sm"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-[11px] text-red-600 font-medium">{promoError}</p>}
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <Sparkles size={13} /> {appliedPromo} Applied
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-200/60 text-emerald-800 px-1.5 py-0.5 rounded-full">
                    -{(PROMO_DISCOUNT * 100)}% OFF
                  </span>
                </div>
                <button
                  onClick={handleRemovePromo}
                  className="text-emerald-700 hover:text-emerald-900 p-1"
                  aria-label="Remove promo code"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Price Summary Breakdown */}
            <div className="space-y-1.5 pt-1 text-xs">
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
              <div className="flex justify-between text-base font-extrabold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total Amount</span>
                <span className="text-gold-600 font-black">NPR {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gray-900 via-black to-gray-900 py-3.5 text-xs font-bold tracking-wider text-white uppercase shadow-lg transition-all duration-300 hover:shadow-xl active:scale-[0.99]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </Link>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 font-medium pt-1">
              <ShieldCheck size={13} className="text-emerald-600" />
              <span>256-Bit SSL Encrypted & Guaranteed Safe Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
