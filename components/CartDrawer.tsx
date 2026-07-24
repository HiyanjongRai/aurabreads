'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';

type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  img: string;
};

const initialItems: CartItem[] = [
  { id: '1', name: 'Twist Knot Earrings', price: 18, qty: 1, img: '/product-earrings1.png' },
  { id: '2', name: 'Chunky Hoop Earrings', price: 20, qty: 1, img: '/product-earrings2.png' },
];

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [items, setItems] = useState<CartItem[]>(initialItems);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-slide-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-gold-600" />
            <h2 className="font-serif text-xl font-light text-gray-900">Your Shopping Bag</h2>
            <span className="ml-1 rounded-full bg-gold-100 px-2 py-0.5 text-xs font-semibold text-gold-800">
              {items.reduce((sum, item) => sum + item.qty, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-900"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                <ShoppingBag size={32} />
              </div>
              <p className="font-serif text-lg font-light text-gray-800">Your bag is empty</p>
              <p className="max-w-xs text-xs text-gray-500">Discover our handcrafted jewelry collections and add your favorite items.</p>
              <button
                onClick={onClose}
                className="mt-2 rounded-xl bg-gray-900 px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-black"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 border border-gray-200">
                    <Image src={item.img} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="px-2.5 py-1 text-xs text-gray-600 hover:text-black font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-medium text-gray-900">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="px-2.5 py-1 text-xs text-gray-600 hover:text-black font-bold"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        Rs {(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer & Checkout button */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50 p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>Rs {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className="text-emerald-600 font-medium">FREE</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span className="text-gold-600">Rs {subtotal.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-black hover:shadow-xl active:scale-[0.99] cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </Link>

            <p className="text-center text-xs text-gray-400">
              🔒 256-bit Secure Encrypted Checkout
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
