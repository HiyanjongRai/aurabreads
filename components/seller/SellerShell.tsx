"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  ChevronDown,
  ChevronRight,
  CreditCard,
  ExternalLink,
  Eye,
  HelpCircle,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  Settings,
  ShoppingBag,
  Sparkles,
  Star,
  Tag,
  Truck,
  Users,
  X,
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

const navGroups = [
  {
    section: "Overview",
    items: [
      { href: "/seller", label: "Dashboard", icon: LayoutDashboard },
      { href: "/seller/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/seller/activity", label: "Activity Log", icon: Activity },
    ],
  },
  {
    section: "Catalog",
    items: [
      { href: "/seller/products", label: "All Products", icon: Eye },
      { href: "/seller/products/add", label: "Add Product", icon: PlusCircle },
      { href: "/seller/categories", label: "Categories", icon: Tag },
      { href: "/seller/media", label: "Media Library", icon: ImageIcon },
    ],
  },
  {
    section: "Sales",
    items: [
      { href: "/seller/orders", label: "Orders", icon: ShoppingBag },
      { href: "/seller/customers", label: "Customers", icon: Users },
      { href: "/seller/reviews", label: "Reviews", icon: Star },
    ],
  },
  {
    section: "Settings",
    items: [
      { href: "/seller/settings", label: "Store Settings", icon: Settings },
      { href: "/seller/payments", label: "Payments", icon: CreditCard },
      { href: "/seller/shipping", label: "Shipping", icon: Truck },
      { href: "/seller/support", label: "Support", icon: HelpCircle },
    ],
  },
];

export function SellerShell({ children, user }: SellerShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const initial = user.name ? user.name[0].toUpperCase() : "S";
  const roleLabel = user.role === "ADMIN" ? "Administrator" : "Seller";

  return (
    <div className="seller-shell">
      <div
        className={`seller-backdrop ${sidebarOpen ? "visible" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`seller-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="seller-sidebar-head">
          <Link href="/seller" className="seller-brand">
            <span className="seller-brand-mark">
              <Sparkles size={16} />
            </span>
            <span>
              <span className="seller-brand-name">AuraBeads</span>
              <span className="seller-brand-sub">Seller Portal</span>
            </span>
          </Link>
          <button
            className="seller-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close seller navigation"
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="seller-nav">
          {navGroups.map((group) => (
            <div key={group.section} className="seller-nav-section">
              <span className="seller-nav-section-label">{group.section}</span>
              {group.items.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`seller-nav-link ${active ? "active" : ""}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={15} />
                    <span>{label}</span>
                    {active ? <ChevronRight size={13} /> : null}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="seller-profile">
          <div className="seller-profile-card">
            <span className="seller-avatar">{initial}</span>
            <span className="seller-profile-text">
              <strong>{user.name}</strong>
              <span>{roleLabel}</span>
            </span>
          </div>
          <form action={logout}>
            <button type="submit" className="seller-logout">
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      <div className="seller-main">
        <header className="seller-topbar">
          <div className="seller-topbar-left">
            <button
              className="seller-hamburger"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open seller navigation"
              type="button"
            >
              <Menu size={20} />
            </button>
            <Link href="/seller" className="seller-topbar-title">
              <span>AuraBeads</span>
              <strong>Seller Workspace</strong>
            </Link>
          </div>

          <div className="seller-topbar-actions">
            <Link href="/" target="_blank" className="seller-topbar-link">
              <span>Store</span>
              <ExternalLink size={12} />
            </Link>
            <Link href="/seller/products/add" className="seller-topbar-cta">
              <PlusCircle size={14} />
              <span>Add</span>
            </Link>
            <button className="seller-icon-button" aria-label="Notifications" type="button">
              <Bell size={18} />
              <span />
            </button>
            <span className="seller-topbar-avatar">{initial}</span>
            <ChevronDown className="seller-topbar-chevron" size={13} />
          </div>
        </header>

        <main className="seller-content">{children}</main>
      </div>
    </div>
  );
}
