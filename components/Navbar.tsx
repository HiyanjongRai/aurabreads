"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AuthModal } from "@/components/auth/AuthModal";
import { CartDrawer } from "@/components/CartDrawer";
import { logout } from "@/app/actions/auth";
import { User, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";

type AuthTab = "login" | "register";

type UserSession = {
  id: string;
  name: string;
  email: string;
  role: string;
};

function getDashboardUrl(role?: string) {
  if (role === "ADMIN") return "/admin";
  if (role === "SELLER") return "/seller";
  return "/dashboard";
}

function NavbarContent() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<AuthTab>("login");
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<UserSession | null>(null);

  const syncCartCount = () => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('aurabeads_cart');
        if (stored) {
          const items = JSON.parse(stored);
          const totalQty = items.reduce((sum: number, item: { qty?: number }) => sum + (item.qty || 1), 0);
          setCartCount(totalQty);
        } else {
          setCartCount(0);
        }
      } catch {
        setCartCount(0);
      }
    }
  };

  useEffect(() => {
    syncCartCount();
    window.addEventListener('aurabeads_cart_updated', syncCartCount);
    return () => {
      window.removeEventListener('aurabeads_cart_updated', syncCartCount);
    };
  }, []);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  // Check auth session from API
  const checkSession = async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    checkSession();
  }, [authOpen]);

  // Check if URL has ?auth=login or ?auth=register
  useEffect(() => {
    const authParam = searchParams.get("auth");
    if (authParam === "login" || authParam === "register") {
      if (user) {
        // Logged in user: redirect straight to dashboard
        router.replace(getDashboardUrl(user.role));
      } else {
        setAuthTab(authParam);
        setAuthOpen(true);
      }
    }
  }, [searchParams, user, router]);

  function openAuth(tab: AuthTab = "login") {
    if (user) {
      router.push(getDashboardUrl(user.role));
    } else {
      setAuthTab(tab);
      setAuthOpen(true);
    }
  }

  function handleCloseAuth() {
    setAuthOpen(false);
    checkSession();
    if (searchParams.get("auth")) {
      router.replace("/", { scroll: false });
    }
  }

  function handleAccountClick() {
    if (user) {
      router.push(getDashboardUrl(user.role));
    } else {
      openAuth("login");
    }
  }

  const initial = user?.name ? user.name[0].toUpperCase() : "U";

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

              {/* Account button: Logged-in vs Logged-out */}
              {user ? (
                <div className="ab-user-menu-container">
                  <button
                    aria-label="Account"
                    className="ab-user-menu-btn"
                    onClick={handleAccountClick}
                    id="nav-account-btn"
                  >
                    <div className="ab-user-avatar">
                      {initial}
                    </div>
                    <span className="ab-user-name hidden sm:inline-block">
                      {user.name.split(" ")[0]}
                    </span>
                    <ChevronDown size={12} style={{ color: "#6b7280" }} className="hidden sm:inline-block" />
                  </button>

                  {/* Dropdown Menu */}
                  <div className="ab-user-dropdown">
                    <div className="ab-user-dropdown-header">
                      <p className="ab-user-dropdown-title">{user.name}</p>
                      <p className="ab-user-dropdown-subtitle">{user.role} ACCOUNT</p>
                    </div>
                    <Link
                      href={getDashboardUrl(user.role)}
                      className="ab-user-dropdown-item"
                    >
                      <LayoutDashboard size={14} />
                      <span>Dashboard</span>
                    </Link>
                    <form action={logout} style={{ width: "100%" }}>
                      <button
                        type="submit"
                        className="ab-user-dropdown-item danger"
                      >
                        <LogOut size={14} />
                        <span>Sign Out</span>
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <button
                  aria-label="Account"
                  className="ab-icon-btn"
                  onClick={() => openAuth("login")}
                  id="nav-account-btn"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                </button>
              )}

              <button aria-label="Wishlist" className="ab-icon-btn">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </button>
              <button
                aria-label="Cart"
                className="ab-icon-btn ab-cart-btn"
                onClick={() => setCartOpen(true)}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                {cartCount > 0 && <span className="ab-cart-count">{cartCount}</span>}
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
            
            {user ? (
              <>
                <Link
                  href={getDashboardUrl(user.role)}
                  onClick={() => setMobileOpen(false)}
                  className="ab-mobile-auth-btn flex items-center justify-center gap-2"
                >
                  <LayoutDashboard size={15} />
                  <span>Go to Dashboard</span>
                </Link>
                <form action={logout} className="w-full mt-2">
                  <button
                    type="submit"
                    className="w-full text-center py-2.5 text-xs font-bold text-red-600 bg-red-50 rounded-xl"
                  >
                    Sign Out ({user.name.split(" ")[0]})
                  </button>
                </form>
              </>
            ) : (
              <>
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
              </>
            )}
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
