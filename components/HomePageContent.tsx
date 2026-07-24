"use client";

import Image from "next/image";
import Link from "next/link";
import { PublicProduct } from "@/lib/products";
import { useState } from "react";

const categories = [
  { name: "Earrings", img: "/cat-earrings.png", x: 0 },
  { name: "Necklaces", img: "/cat-necklaces.png", x: 1 },
  { name: "Bracelets", img: "/cat-bracelets.png", x: 2 },
  { name: "Rings", img: "/cat-rings.png", x: 3 },
  { name: "Hair Accessories", img: "/cat-hair.png", x: 4 },
  { name: "Sunglasses", img: "/cat-sunglasses.png", x: 5 },
];

const catEmoji = ["💍", "📿", "⛓️", "💍", "🪮", "🕶️"];

const demoProducts = [
  { id: "demo-1", name: "Twist Knot Earrings", price: 18.00, salePrice: null, rating: 4.5, reviews: 128, img: "/product-earrings1.png" },
  { id: "demo-2", name: "Chunky Hoop Earrings", price: 20.00, salePrice: null, rating: 4.8, reviews: 96, img: "/product-earrings2.png" },
  { id: "demo-3", name: "Pearl Drop Earrings", price: 16.00, salePrice: null, rating: 4.6, reviews: 74, img: "/product-earrings3.png" },
  { id: "demo-4", name: "Chain Link Bracelet", price: 22.00, salePrice: null, rating: 4.7, reviews: 64, img: "/product-bracelet.png" },
  { id: "demo-5", name: "Layered Pendant Necklace", price: 24.00, salePrice: null, rating: 4.9, reviews: 112, img: "/product-earrings1.png" },
];

function StarRating({ rating = 5 }: { rating?: number }) {
  return (
    <div className="ab-stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= Math.floor(rating) ? "ab-star filled" : s - 0.5 <= rating ? "ab-star half" : "ab-star"}>★</span>
      ))}
    </div>
  );
}

type Props = {
  initialProducts?: PublicProduct[];
};

export default function HomePageContent({ initialProducts = [] }: Props) {
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Use real DB products if available, fallback to demo items
  const displayProducts = initialProducts.length > 0
    ? initialProducts.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.salePrice ?? p.price,
        originalPrice: p.salePrice ? p.price : null,
        rating: 4.8,
        reviews: 42 + Math.floor(p.price % 80),
        img: p.images[0] || "/product-earrings1.png",
      }))
    : demoProducts.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        originalPrice: p.salePrice,
        rating: p.rating,
        reviews: p.reviews,
        img: p.img,
      }));

  return (
    <>
      {/* Trust badges */}
      <section className="ab-trust-bar">
        <div className="ab-trust-item">
          <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <div><strong>Premium Quality</strong><span>Crafted with care</span></div>
        </div>
        <div className="ab-trust-item">
          <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <div><strong>Water Resistant</strong><span>Built for everyday wear</span></div>
        </div>
        <div className="ab-trust-item">
          <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <div><strong>Skin Friendly</strong><span>Hypoallergenic materials</span></div>
        </div>
        <div className="ab-trust-item">
          <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <div><strong>Secure Payments</strong><span>Safe &amp; trusted checkout</span></div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="ab-section" id="categories">
        <div className="ab-container">
          <h2 className="ab-section-title">Shop By Category</h2>
          <div className="ab-categories">
            {categories.map((cat, i) => (
              <Link href="#" key={cat.name} className="ab-category-item">
                <div className="ab-category-circle">
                  <span className="ab-cat-emoji">{catEmoji[i]}</span>
                </div>
                <span className="ab-category-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers / Latest Products */}
      <section className="ab-section ab-section--gray" id="bestsellers" style={{ background: '#f9f8f6', padding: '60px 0' }}>
        <div className="ab-container">
          <div className="ab-section-header" style={{ marginBottom: '32px' }}>
            <div>
              <h2 className="ab-section-title" style={{ textAlign: 'left', margin: 0 }}>Best Sellers</h2>
            </div>
            <Link href="#" className="ab-btn-outline-sm">View All</Link>
          </div>

          <div className="ab-products-grid">
            {displayProducts.map((product) => {
              const isWishlisted = !!wishlist[product.id];
              return (
                <div key={product.id} className="ab-product-card">
                  <div className="ab-product-img-wrap">
                    {product.img.startsWith('http') || product.img.startsWith('/cat') || product.img.startsWith('/product') ? (
                      <img
                        src={product.img}
                        alt={product.name}
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      />
                    ) : (
                      <Image
                        src={product.img}
                        alt={product.name}
                        width={260}
                        height={260}
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      />
                    )}
                    <button
                      className="ab-wishlist-btn"
                      onClick={() => toggleWishlist(product.id)}
                      aria-label={`Add ${product.name} to wishlist`}
                      style={{ color: isWishlisted ? '#e11d48' : '#666666' }}
                    >
                      <svg width="18" height="18" fill={isWishlisted ? '#e11d48' : 'none'} stroke={isWishlisted ? '#e11d48' : 'currentColor'} strokeWidth="1.8" viewBox="0 0 24 24">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </button>
                  </div>
                  <div className="ab-product-info">
                    <p className="ab-product-name">{product.name}</p>
                    <div className="ab-product-price">
                      <span>Rs {product.price.toFixed(2)}</span>
                      {product.originalPrice && (
                        <span className="ab-product-price-original">Rs {product.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="ab-product-rating">
                      <StarRating rating={product.rating} />
                      <span className="ab-review-count">({product.reviews})</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="ab-promo-banner">
        <div className="ab-promo-img-side">
          <Image
            src="/product-earrings2.png"
            alt="Promotional jewelry"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
          />
          <div className="ab-promo-img-overlay" />
        </div>
        <div className="ab-promo-content">
          <p className="ab-promo-tag">Limited Time Offer</p>
          <h2 className="ab-promo-title">Get 15% Off Your First Order</h2>
          <p className="ab-promo-sub">Join our community and enjoy exclusive discounts, new arrivals, and style inspiration.</p>
          <Link href="/register" className="ab-btn-gold">Shop Now</Link>
        </div>
      </section>

      {/* Features strip */}
      <section className="ab-features-strip">
        <div className="ab-feature">
          <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          <div><strong>Free Shipping</strong><span>On orders over Rs 50</span></div>
        </div>
        <div className="ab-feature">
          <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg>
          <div><strong>Easy Returns</strong><span>30-day return policy</span></div>
        </div>
        <div className="ab-feature">
          <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <div><strong>Packed With Care</strong><span>Premium packaging</span></div>
        </div>
        <div className="ab-feature">
          <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.58 3.38 2 2 0 0 1 3.55 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 6.59 6.59l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <div><strong>24/7 Support</strong><span>We&apos;re here to help</span></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="ab-footer">
        <div className="ab-container">
          <div className="ab-footer-grid">
            <div className="ab-footer-brand">
              <div className="ab-footer-logo">
                <span className="ab-logo-name">AuraBeads</span>
                <span className="ab-logo-tagline">Fashion Jewelry</span>
              </div>
              <p>Trendy, stylish &amp; affordable fashion jewelry for every woman. Shine in your own unique way.</p>
              <div className="ab-social-links">
                <a href="#" aria-label="Instagram">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" aria-label="Facebook">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" aria-label="Pinterest">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
                </a>
                <a href="#" aria-label="TikTok">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                </a>
              </div>
            </div>

            <div className="ab-footer-col">
              <h4>Shop</h4>
              <Link href="#">New In</Link>
              <Link href="#">Earrings</Link>
              <Link href="#">Necklaces</Link>
              <Link href="#">Bracelets</Link>
              <Link href="#">Rings</Link>
              <Link href="#">Accessories</Link>
              <Link href="#">Collections</Link>
            </div>

            <div className="ab-footer-col">
              <h4>Customer Care</h4>
              <Link href="#">About Us</Link>
              <Link href="#">Track Order</Link>
              <Link href="#">Returns &amp; Exchanges</Link>
              <Link href="#">Shipping Policy</Link>
              <Link href="#">FAQs</Link>
              <Link href="#">Contact Us</Link>
            </div>

            <div className="ab-footer-col">
              <h4>Information</h4>
              <Link href="#">Jewelry Care</Link>
              <Link href="#">Size Guide</Link>
              <Link href="#">Privacy Policy</Link>
              <Link href="#">Terms &amp; Conditions</Link>
            </div>

            <div className="ab-footer-col ab-footer-newsletter">
              <h4>Newsletter</h4>
              <p>Subscribe for exclusive offers, early access and style updates.</p>
              <form className="ab-newsletter-form" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Enter your email" aria-label="Email address" />
                <button type="submit" aria-label="Subscribe">→</button>
              </form>
            </div>
          </div>

          <div className="ab-footer-bottom">
            <p>© 2025 AuraBeads Fashion Jewelry. All Rights Reserved.</p>
            <div className="ab-payment-icons">
              <span>Khalti</span>
              <span>eSewa</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
