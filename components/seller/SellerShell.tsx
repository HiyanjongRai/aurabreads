"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bell,
  BookOpen,
  ChevronDown,
  CreditCard,
  ExternalLink,
  FileText,
  Headphones,
  Image as ImageIcon,
  LayoutDashboard,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  Sparkles,
  Star,
  Ticket,
  Truck,
  UserCheck,
  Users,
  X,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { logout } from "@/app/actions/auth";

type SellerShellProps = {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    role: string;
  };
};

export function SellerShell({ children, user }: SellerShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(true);

  const isNavActive = (href: string) => pathname === href;
  const displayRole = user.role === "ADMIN" ? "Administrator" : "Seller";
  const initial = user.name ? user.name[0].toUpperCase() : "S";

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", fontFamily: "Inter, sans-serif", color: "#ffffff" }}>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
        />
      )}

      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          width: 260,
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(180deg,#0f0f1a 0%,#0a0a12 100%)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
        }}
        className="lg:!translate-x-0 lg:!static lg:!inset-auto"
      >
        {/* Brand Header */}
        <div style={{ height: 68, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <Link href="/seller" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#d4af37,#a07c2e)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Sparkles size={18} color="#000" />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", color: "#d4af37", textTransform: "uppercase" }}>
                AURABEADS
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginTop: 1 }}>
                Seller Workspace
              </div>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{ color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer", display: "flex" }}
            className="lg:!hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 12px" }}>
          {/* Main Dashboard Link */}
          <Link
            href="/seller"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 14px",
              borderRadius: 12,
              marginBottom: 16,
              textDecoration: "none",
              fontSize: 13,
              fontWeight: pathname === "/seller" ? 700 : 500,
              color: pathname === "/seller" ? "#000" : "rgba(255,255,255,0.6)",
              background: pathname === "/seller" ? "linear-gradient(90deg,#d4af37,#c9a84c)" : "transparent",
              transition: "all 0.15s",
            }}
          >
            <LayoutDashboard size={16} color={pathname === "/seller" ? "#000" : "rgba(255,255,255,0.4)"} />
            <span>Dashboard</span>
            {pathname === "/seller" && <ChevronRight size={13} style={{ marginLeft: "auto" }} color="rgba(0,0,0,0.5)" />}
          </Link>

          {/* Section: MANAGE */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", padding: "0 10px", marginBottom: 6 }}>
              MANAGE
            </p>

            {/* Products Accordion */}
            <div>
              <button
                onClick={() => setProductsOpen(!productsOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: 12,
                  border: "none",
                  background: pathname.startsWith("/seller/products") ? "rgba(255,255,255,0.05)" : "transparent",
                  color: pathname.startsWith("/seller/products") ? "#ffffff" : "rgba(255,255,255,0.5)",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Package size={16} color={pathname.startsWith("/seller/products") ? "#d4af37" : "rgba(255,255,255,0.4)"} />
                  <span>Products</span>
                </div>
                <ChevronDown
                  size={14}
                  style={{
                    transform: productsOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                    color: productsOpen ? "#d4af37" : "rgba(255,255,255,0.3)",
                  }}
                />
              </button>

              {productsOpen && (
                <div style={{ marginLeft: 24, marginTop: 4, paddingLeft: 12, borderLeft: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", gap: 2 }}>
                  <Link
                    href="/seller/products"
                    style={{
                      display: "block",
                      padding: "6px 10px",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: isNavActive("/seller/products") ? 700 : 500,
                      color: isNavActive("/seller/products") ? "#d4af37" : "rgba(255,255,255,0.45)",
                      textDecoration: "none",
                    }}
                  >
                    All Products
                  </Link>
                  <Link
                    href="/seller/products/add"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 10px",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: isNavActive("/seller/products/add") ? 700 : 500,
                      color: isNavActive("/seller/products/add") ? "#d4af37" : "rgba(255,255,255,0.45)",
                      textDecoration: "none",
                    }}
                  >
                    <span style={{ color: "#d4af37", fontWeight: 800 }}>+</span> Add New Product
                  </Link>
                </div>
              )}
            </div>

            <NavItem href="/seller/orders" icon={ShoppingBag} label="Orders" active={isNavActive("/seller/orders")} />
            <NavItem href="/seller/customers" icon={Users} label="Customers" active={isNavActive("/seller/customers")} />
            <NavItem href="/seller/reviews" icon={Star} label="Reviews" active={isNavActive("/seller/reviews")} />
          </div>

          {/* Section: STORE */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", padding: "0 10px", marginBottom: 6 }}>
              STORE
            </p>
            <NavItem href="/seller/coupons" icon={Ticket} label="Coupons" active={isNavActive("/seller/coupons")} />
            <NavItem href="/seller/banners" icon={ImageIcon} label="Banners" active={isNavActive("/seller/banners")} />
            <NavItem href="/seller/pages" icon={FileText} label="Pages" active={isNavActive("/seller/pages")} />
            <NavItem href="/seller/blog" icon={BookOpen} label="Blog Posts" active={isNavActive("/seller/blog")} />
          </div>

          {/* Section: SETTINGS */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", padding: "0 10px", marginBottom: 6 }}>
              SETTINGS
            </p>
            <NavItem href="/seller/settings" icon={Settings} label="Store Settings" active={isNavActive("/seller/settings")} />
            <NavItem href="/seller/payments" icon={CreditCard} label="Payment Methods" active={isNavActive("/seller/payments")} />
            <NavItem href="/seller/shipping" icon={Truck} label="Shipping" active={isNavActive("/seller/shipping")} />
            <NavItem href="/seller/roles" icon={UserCheck} label="Admins & Roles" active={isNavActive("/seller/roles")} />
            <NavItem href="/seller/activity" icon={Activity} label="Activity Logs" active={isNavActive("/seller/activity")} />
          </div>
        </div>

        {/* User Profile & Sign Out */}
        <div style={{ padding: 12, borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, background: "rgba(255,255,255,0.04)", marginBottom: 4 }}>
            <div style={{ width: 32, height: 32, borderRadius: 99, background: "linear-gradient(135deg,#d4af37,#a07c2e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#000", flexShrink: 0 }}>
              {initial}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#ffffff", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</p>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayRole}</p>
            </div>
          </div>
          <form action={logout}>
            <button
              type="submit"
              style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 12px", borderRadius: 12, border: "none", background: "transparent", color: "rgba(255,255,255,0.35)", fontSize: 13, fontWeight: 500, cursor: "pointer" }}
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main Viewport ──────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top Header */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 30,
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(10,10,15,0.96)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{ color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer", display: "flex" }}
              className="lg:!hidden"
            >
              <Menu size={20} />
            </button>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: "#ffffff", letterSpacing: "-0.01em", margin: 0 }}>
              Seller Workspace
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link
              href="/"
              target="_blank"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "6px 12px",
                fontSize: 12,
                color: "rgba(255,255,255,0.5)",
                textDecoration: "none",
              }}
            >
              <span>View Store</span>
              <ExternalLink size={12} />
            </Link>

            <button style={{ position: "relative", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", display: "flex" }}>
              <Bell size={18} />
              <span style={{ position: "absolute", top: 1, right: 1, width: 6, height: 6, borderRadius: 99, background: "#f59e0b" }} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: 12, borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ width: 34, height: 34, borderRadius: 99, background: "linear-gradient(135deg,#d4af37,#a07c2e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#000" }}>
                {initial}
              </div>
              <div style={{ display: "none" }} className="sm-show">
                <span style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#ffffff" }}>
                  {user.name}
                </span>
                <span style={{ display: "block", fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
                  {displayRole}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({
  href,
  icon: Icon,
  label,
  active = false,
}: {
  href: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 12px",
        borderRadius: 12,
        marginBottom: 2,
        textDecoration: "none",
        fontSize: 13,
        fontWeight: active ? 700 : 500,
        color: active ? "#ffffff" : "rgba(255,255,255,0.5)",
        background: active ? "rgba(255,255,255,0.05)" : "transparent",
        transition: "all 0.15s",
      }}
    >
      <Icon size={16} color={active ? "#d4af37" : "rgba(255,255,255,0.4)"} />
      <span>{label}</span>
    </Link>
  );
}
