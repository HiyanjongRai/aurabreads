"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AuthModal } from "@/components/auth/AuthModal";
import { CartDrawer } from "@/components/CartDrawer";

type AuthTab = "login" | "register";

function NavbarContent() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<AuthTab>("login");
  const [cartOpen, setCartOpen] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  // Check if URL has ?auth=login or ?auth=register
  useEffect(() => {
    const authParam = searchParams.get("auth");
    if (authParam === "login" || authParam === "register") {
      setAuthTab(authParam);
      setAuthOpen(true);
    }
  }, [searchParams]);

  function openAuth(tab: AuthTab = "login") {
    setAuthTab(tab);
    setAuthOpen(true);
  }

  function handleCloseAuth() {
    setAuthOpen(false);
    // Clean up query param if present
    if (searchParams.get("auth")) {
      router.replace("/", { scroll: false });
    }
  }

  return (
    <>
      <header className="ab-header">
        {/* Top announcement bar */}
        <div className="ab-topbar">
          <span>FREE SHIPPING ON ORDERS OVER Rs 50</span>
          <nav className="ab-topbar-links">
            <Link href="#">About Us</Link>
            <Link href="#">Track Order</Link>
            <Link href="#">Help &amp; FAQs</Link>
          </nav>
        </div>

        {/* Main nav */}
        <div className="ab-nav-wrapper">
          <nav className="ab-nav">
            {/* Left links */}
            <ul className="ab-nav-links">
              <li><Link href="#">New In</Link></li>
              <li className="ab-dropdown">
                <Link href="#">Earrings ▾</Link>
                <div className="ab-dropdown-menu">
                  <Link href="#">Hoops</Link>
                  <Link href="#">Studs</Link>
                  <Link href="#">Drop &amp; Dangles</Link>
                </div>
              </li>
              <li className="ab-dropdown">
                <Link href="#">Accessories ▾</Link>
                <div className="ab-dropdown-menu">
                  <Link href="#">Hair Clips</Link>
                  <Link href="#">Sunglasses</Link>
                  <Link href="#">Bags</Link>
                </div>
              </li>
              <li className="ab-dropdown">
                <Link href="#">Collections ▾</Link>
                <div className="ab-dropdown-menu">
                  <Link href="#">Summer Edit</Link>
                  <Link href="#">Bridal</Link>
                  <Link href="#">Gift Sets</Link>
                </div>
              </li>
              <li><Link href="/seller">Sell</Link></li>
            </ul>

            {/* Logo */}
            <Link href="/" className="ab-logo">
              <span className="ab-logo-name">AuraBeads</span>
              <span className="ab-logo-tagline">Fashion Jewelry</span>
            </Link>

            {/* Right icons */}
            <div className="ab-nav-icons">
              <button aria-label="Search" className="ab-icon-btn">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </button>
              {/* Account icon → opens auth modal */}
              <button
                aria-label="Account"
                className="ab-icon-btn"
                onClick={() => openAuth("login")}
                id="nav-account-btn"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              </button>
              <button aria-label="Wishlist" className="ab-icon-btn">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </button>
              <button
                aria-label="Cart"
                className="ab-icon-btn ab-cart-btn"
                onClick={() => setCartOpen(true)}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                <span className="ab-cart-count">2</span>
              </button>
              {/* Mobile hamburger */}
              <button className="ab-hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
                <span></span><span></span><span></span>
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="ab-mobile-menu">
            <Link href="#" onClick={() => setMobileOpen(false)}>New In</Link>
            <Link href="#" onClick={() => setMobileOpen(false)}>Earrings</Link>
            <Link href="#" onClick={() => setMobileOpen(false)}>Accessories</Link>
            <Link href="#" onClick={() => setMobileOpen(false)}>Collections</Link>
            <Link href="#" onClick={() => setMobileOpen(false)}>Necklaces</Link>
            <Link href="#" onClick={() => setMobileOpen(false)}>Bracelets</Link>
            <Link href="#" onClick={() => setMobileOpen(false)}>Rings</Link>
            <Link href="/seller" onClick={() => setMobileOpen(false)}>Sell</Link>
            <hr style={{ margin: '8px 0', borderColor: 'var(--border)' }} />
            <button
              onClick={() => { setMobileOpen(false); openAuth("login"); }}
              className="ab-mobile-auth-btn"
            >
              Sign In
            </button>
            <button
              onClick={() => { setMobileOpen(false); openAuth("register"); }}
              className="ab-mobile-auth-btn ab-mobile-auth-btn--register"
            >
              Create Account
            </button>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authOpen}
        onClose={handleCloseAuth}
        defaultTab={authTab}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={null}>
      <NavbarContent />
    </Suspense>
  );
}
