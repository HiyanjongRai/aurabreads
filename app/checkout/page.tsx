'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CheckCircle2, ShieldCheck, Lock, CreditCard, Truck } from 'lucide-react';

export default function CheckoutPage() {
  const [completed, setCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setCompleted(true);
    }, 1200);
  };

  if (completed) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16 text-slate-900 flex items-center justify-center font-inter">
        <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 sm:p-12 text-center shadow-2xl border border-gray-100 animate-fade-in space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={48} />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-600">Order Confirmed</span>
            <h1 className="font-serif text-3xl font-light text-gray-900">Thank You For Your Order!</h1>
            <p className="text-sm text-gray-600">Order #AB-{Math.floor(100000 + Math.random() * 900000)}</p>
          </div>
          <p className="text-sm leading-relaxed text-gray-600">
            We&apos;ve received your order and are preparing your handcrafted AuraBeads items with love and care. A confirmation email has been sent to your inbox.
          </p>
          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-black hover:shadow-xl"
            >
              <ArrowLeft size={16} />
              <span>Return to Homepage</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 font-inter text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-light tracking-tight text-gray-950">AuraBeads</span>
            <span className="hidden text-xs uppercase tracking-widest text-gold-600 sm:inline">• Checkout</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Lock size={14} className="text-emerald-600" />
            <span>256-Bit Encrypted Secure Checkout</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gold-600 transition">
            <ArrowLeft size={14} />
            <span>Back to Shopping</span>
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left: Form */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-50 text-xs font-bold text-gold-700">1</span>
                  <h2 className="font-serif text-lg font-medium text-gray-900">Contact Information</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="h-11 w-full rounded-xl border border-gray-200 px-3.5 text-sm outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+977 9800000000"
                      className="h-11 w-full rounded-xl border border-gray-200 px-3.5 text-sm outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-50 text-xs font-bold text-gold-700">2</span>
                  <h2 className="font-serif text-lg font-medium text-gray-900">Shipping Address</h2>
                </div>
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700">First Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Jane"
                        className="h-11 w-full rounded-xl border border-gray-200 px-3.5 text-sm outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700">Last Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Smith"
                        className="h-11 w-full rounded-xl border border-gray-200 px-3.5 text-sm outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Street Address</label>
                    <input
                      type="text"
                      required
                      placeholder="123 Luxury Avenue, Suite 400"
                      className="h-11 w-full rounded-xl border border-gray-200 px-3.5 text-sm outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700">City</label>
                      <input
                        type="text"
                        required
                        placeholder="Kathmandu"
                        className="h-11 w-full rounded-xl border border-gray-200 px-3.5 text-sm outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700">State / Province</label>
                      <input
                        type="text"
                        required
                        placeholder="Bagmati"
                        className="h-11 w-full rounded-xl border border-gray-200 px-3.5 text-sm outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700">Postal Code</label>
                      <input
                        type="text"
                        required
                        placeholder="44600"
                        className="h-11 w-full rounded-xl border border-gray-200 px-3.5 text-sm outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-50 text-xs font-bold text-gold-700">3</span>
                  <h2 className="font-serif text-lg font-medium text-gray-900">Payment Option</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-3 rounded-xl border-2 border-gold-500 bg-gold-50/50 p-4 cursor-pointer">
                    <input type="radio" name="payment" defaultChecked className="accent-gold-600" />
                    <div>
                      <span className="block text-sm font-semibold text-gray-900">Cash on Delivery</span>
                      <span className="block text-xs text-gray-500">Pay when your order arrives</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 rounded-xl border-2 border-gray-200 p-4 cursor-pointer hover:border-gray-300">
                    <input type="radio" name="payment" className="accent-gold-600" />
                    <div>
                      <span className="block text-sm font-semibold text-gray-900">Card / eSewa</span>
                      <span className="block text-xs text-gray-500">Online payment</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Checkout Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gray-900 px-6 font-semibold text-white shadow-xl transition-all duration-300 hover:bg-black hover:shadow-2xl disabled:opacity-70 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    <span>Complete Checkout • Rs 38.00</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-6">
              <h2 className="font-serif text-lg font-medium text-gray-900 pb-2 border-b border-gray-100">Order Summary</h2>

              {/* Items */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 border border-gray-200">
                    <Image src="/product-earrings1.png" alt="Twist Knot Earrings" fill className="object-cover" />
                    <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold-600 text-[10px] font-bold text-white">1</span>
                  </div>
                  <div className="flex flex-1 items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Twist Knot Earrings</h3>
                      <span className="text-xs text-gray-500">Handcrafted Gold</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">Rs 18.00</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 border border-gray-200">
                    <Image src="/product-earrings2.png" alt="Chunky Hoop Earrings" fill className="object-cover" />
                    <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold-600 text-[10px] font-bold text-white">1</span>
                  </div>
                  <div className="flex flex-1 items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Chunky Hoop Earrings</h3>
                      <span className="text-xs text-gray-500">24k Gold Plated</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">Rs 20.00</span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-4 border-t border-gray-100 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs 38.00</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-gold-600 text-lg">Rs 38.00</span>
                </div>
              </div>

              {/* Guarantee items */}
              <div className="space-y-3 pt-4 border-t border-gray-100 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-gold-600" />
                  <span>Free Express Delivery (2-3 business days)</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-gold-600" />
                  <span>30-Day Money Back Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
