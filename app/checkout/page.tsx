'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  AlertCircle,
  ShoppingBag,
  Truck,
  RotateCcw,
  Shield,
  Tag,
  Sparkles,
  X,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';

type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  img: string;
  category?: string;
};

type FormErrors = {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  street?: string;
  city?: string;
  state?: string;
  postal?: string;
  termsAccepted?: string;
};

type FormData = {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  postal: string;
  orderNotes: string;
  termsAccepted: boolean;
};

const FREE_SHIPPING_THRESHOLD = 50;
const PROMO_CODE = 'WELCOME10';
const PROMO_DISCOUNT = 0.1;

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [completed, setCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');
  const [orderNumber] = useState(() => `AB-${Math.floor(100000 + Math.random() * 900000)}`);

  const [formData, setFormData] = useState<FormData>({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    postal: '',
    orderNotes: '',
    termsAccepted: false,
  });

  // Load real cart from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('aurabeads_cart');
      if (stored) setCartItems(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const discountAmount = appliedPromo ? subtotal * PROMO_DISCOUNT : 0;
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 150;
  const total = subtotal - discountAmount + shippingFee;
  const totalItems = cartItems.reduce((s, i) => s + i.qty, 0);

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) { setPromoError('Enter a promo code first'); return; }
    if (code === PROMO_CODE) { setAppliedPromo(code); setPromoInput(''); setPromoError(''); }
    else { setPromoError('Invalid code. Try WELCOME10'); }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : false;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const e: FormErrors = {};
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Valid email required';
    if (!formData.phone || formData.phone.length < 10) e.phone = 'Valid phone required';
    if (!formData.firstName.trim()) e.firstName = 'First name required';
    if (!formData.lastName.trim()) e.lastName = 'Last name required';
    if (!formData.street.trim()) e.street = 'Street address required';
    if (!formData.city.trim()) e.city = 'City required';
    if (!formData.state.trim()) e.state = 'State/Province required';
    if (!formData.postal.trim()) e.postal = 'Postal code required';
    if (!formData.termsAccepted) e.termsAccepted = 'You must accept the terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validateForm()) return;
    if (cartItems.length === 0) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setCompleted(true);
      // Clear cart after order
      localStorage.removeItem('aurabeads_cart');
      window.dispatchEvent(new Event('aurabeads_cart_updated'));
    }, 1400);
  };

  /* ─── Order Confirmed Screen ─── */
  if (completed) {
    return (
      <main className="checkout-success-screen">
        <div className="checkout-success-card">
          <div className="checkout-success-icon">
            <CheckCircle2 size={52} />
          </div>
          <div className="checkout-success-label">Order Confirmed</div>
          <h1 className="checkout-success-title">Thank You For Your Order!</h1>
          <p className="checkout-success-order">Order {orderNumber}</p>
          <p className="checkout-success-body">
            We've received your order and are preparing your handcrafted AuraBeads pieces with love and care.
            A confirmation email will be sent to <strong>{formData.email || 'your inbox'}</strong>.
          </p>
          <div className="checkout-success-features">
            <div><Truck size={16} /><span>Ships in 1–2 business days</span></div>
            <div><RotateCcw size={16} /><span>30-day easy returns</span></div>
            <div><Shield size={16} /><span>1-year warranty</span></div>
          </div>
          <Link href="/" className="checkout-success-btn">
            <ArrowLeft size={16} />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </main>
    );
  }

  /* ─── Empty Cart State ─── */
  if (cartItems.length === 0) {
    return (
      <main className="checkout-empty-screen">
        <div className="checkout-empty-card">
          <div className="checkout-empty-icon"><ShoppingBag size={48} /></div>
          <h2>Your bag is empty</h2>
          <p>Add some beautiful jewelry before proceeding to checkout.</p>
          <Link href="/" className="checkout-success-btn">
            <ArrowLeft size={16} />
            <span>Browse Collection</span>
          </Link>
        </div>
      </main>
    );
  }

  /* ─── Main Checkout ─── */
  return (
    <main className="checkout-root">

      {/* ── Sticky Top Header ── */}
      <header className="checkout-header">
        <div className="checkout-header-inner">
          <Link href="/" className="checkout-logo">
            <span className="checkout-logo-name">AuraBeads</span>
            <span className="checkout-logo-sep">·</span>
            <span className="checkout-logo-tag">Secure Checkout</span>
          </Link>
          <div className="checkout-header-secure">
            <Lock size={14} />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="checkout-steps">
          <div className="checkout-step active">
            <span className="checkout-step-num">1</span>
            <span>Contact</span>
          </div>
          <div className="checkout-step-line active" />
          <div className="checkout-step active">
            <span className="checkout-step-num">2</span>
            <span>Shipping</span>
          </div>
          <div className="checkout-step-line" />
          <div className="checkout-step">
            <span className="checkout-step-num">3</span>
            <span>Payment</span>
          </div>
        </div>
      </header>

      <div className="checkout-body">

        {/* ── Left: Form ── */}
        <div className="checkout-form-col">
          <Link href="/" className="checkout-back-link">
            <ArrowLeft size={14} />
            <span>Back to Shopping</span>
          </Link>

          <form onSubmit={handleSubmit} className="checkout-form">

            {/* Contact Info */}
            <section className="checkout-card">
              <div className="checkout-card-header">
                <span className="checkout-card-num">1</span>
                <h2>Contact Information</h2>
              </div>
              <div className="checkout-grid-2">
                <div className="checkout-field">
                  <label><Mail size={13} /> Email Address</label>
                  <input
                    type="email" name="email" value={formData.email}
                    onChange={handleInputChange} placeholder="you@example.com"
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="checkout-error"><AlertCircle size={12} />{errors.email}</span>}
                </div>
                <div className="checkout-field">
                  <label><Phone size={13} /> Phone Number</label>
                  <input
                    type="tel" name="phone" value={formData.phone}
                    onChange={handleInputChange} placeholder="+977 98XXXXXXXX"
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="checkout-error"><AlertCircle size={12} />{errors.phone}</span>}
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section className="checkout-card">
              <div className="checkout-card-header">
                <span className="checkout-card-num">2</span>
                <h2>Shipping Address</h2>
              </div>
              <div className="checkout-grid-2">
                <div className="checkout-field">
                  <label>First Name</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Jane" className={errors.firstName ? 'error' : ''} />
                  {errors.firstName && <span className="checkout-error"><AlertCircle size={12} />{errors.firstName}</span>}
                </div>
                <div className="checkout-field">
                  <label>Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Smith" className={errors.lastName ? 'error' : ''} />
                  {errors.lastName && <span className="checkout-error"><AlertCircle size={12} />{errors.lastName}</span>}
                </div>
              </div>
              <div className="checkout-field">
                <label><MapPin size={13} /> Street Address</label>
                <input type="text" name="street" value={formData.street} onChange={handleInputChange} placeholder="123 Jewelry Lane" className={errors.street ? 'error' : ''} />
                {errors.street && <span className="checkout-error"><AlertCircle size={12} />{errors.street}</span>}
              </div>
              <div className="checkout-grid-3">
                <div className="checkout-field">
                  <label>City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Kathmandu" className={errors.city ? 'error' : ''} />
                  {errors.city && <span className="checkout-error"><AlertCircle size={12} />{errors.city}</span>}
                </div>
                <div className="checkout-field">
                  <label>State / Province</label>
                  <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="Bagmati" className={errors.state ? 'error' : ''} />
                  {errors.state && <span className="checkout-error"><AlertCircle size={12} />{errors.state}</span>}
                </div>
                <div className="checkout-field">
                  <label>Postal Code</label>
                  <input type="text" name="postal" value={formData.postal} onChange={handleInputChange} placeholder="44600" className={errors.postal ? 'error' : ''} />
                  {errors.postal && <span className="checkout-error"><AlertCircle size={12} />{errors.postal}</span>}
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="checkout-card">
              <div className="checkout-card-header">
                <span className="checkout-card-num">3</span>
                <h2>Payment Method</h2>
              </div>
              <div className="checkout-payment-options">
                <label className="checkout-payment-option selected">
                  <input type="radio" name="payment" defaultChecked />
                  <div className="checkout-payment-icon">Rs</div>
                  <div>
                    <strong>Cash on Delivery</strong>
                    <span>Pay when your order arrives</span>
                  </div>
                </label>
                <label className="checkout-payment-option">
                  <input type="radio" name="payment" />
                  <div className="checkout-payment-icon">Pay</div>
                  <div>
                    <strong>Card / eSewa</strong>
                    <span>Secure online payment</span>
                  </div>
                </label>
              </div>
            </section>

            {/* Notes & Terms */}
            <section className="checkout-card">
              <div className="checkout-field">
                <label>Order Notes <span style={{fontWeight:400,color:'#94a3b8'}}>(optional)</span></label>
                <textarea
                  name="orderNotes" value={formData.orderNotes}
                  onChange={handleInputChange} rows={2}
                  placeholder="Any special requests or delivery instructions..."
                />
              </div>
              <label className="checkout-terms">
                <input
                  type="checkbox" name="termsAccepted"
                  checked={formData.termsAccepted} onChange={handleInputChange}
                  className={errors.termsAccepted ? 'error' : ''}
                />
                <div>
                  <strong>I agree to the Terms of Service and Privacy Policy</strong>
                  <span>By placing this order you agree to our 30-day return policy and jewellery care guidelines.</span>
                </div>
              </label>
              {errors.termsAccepted && <span className="checkout-error"><AlertCircle size={12} />{errors.termsAccepted}</span>}
            </section>

            {/* Submit Button */}
            <button type="submit" disabled={isSubmitting} className="checkout-submit-btn">
              {isSubmitting ? (
                <>
                  <svg className="checkout-spinner" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" />
                  </svg>
                  <span>Processing Order…</span>
                </>
              ) : (
                <>
                  <Lock size={16} />
                  <span>Place Order · NPR {total.toLocaleString()}</span>
                  <ChevronRight size={16} />
                </>
              )}
            </button>

          </form>
        </div>

        {/* ── Right: Order Summary ── */}
        <aside className="checkout-summary-col">
          <div className="checkout-summary">
            <h2 className="checkout-summary-title">
              Order Summary
              <span className="checkout-summary-count">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
            </h2>

            {/* Cart Items */}
            <div className="checkout-items">
              {cartItems.map(item => (
                <div key={item.id} className="checkout-item">
                  <div className="checkout-item-img-wrap">
                    <img src={item.img} alt={item.name} />
                    <span className="checkout-item-qty">{item.qty}</span>
                  </div>
                  <div className="checkout-item-info">
                    {item.category && <span className="checkout-item-cat">{item.category}</span>}
                    <p className="checkout-item-name">{item.name}</p>
                    <p className="checkout-item-unit">NPR {item.price.toLocaleString()} each</p>
                  </div>
                  <div className="checkout-item-total">
                    NPR {(item.price * item.qty).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code */}
            {!appliedPromo ? (
              <div className="checkout-promo">
                <div className="checkout-promo-header">
                  <Tag size={13} />
                  <span>Promo Code</span>
                </div>
                <div className="checkout-promo-input-row">
                  <input
                    type="text" value={promoInput}
                    onChange={e => { setPromoInput(e.target.value); setPromoError(''); }}
                    placeholder="e.g. WELCOME10"
                    onKeyDown={e => e.key === 'Enter' && handleApplyPromo()}
                  />
                  <button type="button" onClick={handleApplyPromo}>Apply</button>
                </div>
                {promoError && <p className="checkout-promo-error">{promoError}</p>}
                <button type="button" className="checkout-promo-hint" onClick={() => { setPromoInput(PROMO_CODE); setPromoError(''); }}>
                  <Sparkles size={11} /> Try WELCOME10 for 10% off
                </button>
              </div>
            ) : (
              <div className="checkout-promo-applied">
                <div>
                  <Sparkles size={14} />
                  <strong>{appliedPromo} Applied — 10% OFF</strong>
                </div>
                <button onClick={() => setAppliedPromo(null)}><X size={14} /></button>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="checkout-totals">
              <div className="checkout-total-row">
                <span>Subtotal</span>
                <span>NPR {subtotal.toLocaleString()}</span>
              </div>
              {appliedPromo && (
                <div className="checkout-total-row discount">
                  <span>Discount ({appliedPromo})</span>
                  <span>−NPR {discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="checkout-total-row">
                <span>Shipping</span>
                <span className={shippingFee === 0 ? 'free' : ''}>
                  {shippingFee === 0 ? 'FREE' : `NPR ${shippingFee}`}
                </span>
              </div>
              <div className="checkout-total-final">
                <span>Total</span>
                <span>NPR {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="checkout-trust">
              <div><Shield size={13} /> <span>Secure Checkout</span></div>
              <div><RotateCcw size={13} /> <span>30-Day Returns</span></div>
              <div><Truck size={13} /> <span>Fast Shipping</span></div>
            </div>

          </div>
        </aside>
      </div>
    </main>
  );
}
