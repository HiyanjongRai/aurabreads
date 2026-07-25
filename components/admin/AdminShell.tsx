"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, ShoppingBag, Package, CreditCard,
  BarChart3, Settings, Shield, Bell, Search,
  Store, Tag, Ticket, Activity, PlusCircle,
  Globe, FileText, UserCheck, ChevronDown, Menu, X,
  ExternalLink, LogOut, ChevronRight,
} from "lucide-react";
import { logout } from "@/app/actions/auth";

type AdminShellProps = {
  children: React.ReactNode;
  user: { name: string; email: string; role: string };
};

const navSections = [
  {
    label: "OVERVIEW",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/admin/activity", label: "Activity Log", icon: Activity },
    ],
  },
  {
    label: "USERS",
    items: [
      { href: "/admin/users", label: "All Users", icon: Users },
      { href: "/admin/users/sellers", label: "Sellers", icon: Store },
      { href: "/admin/users/sellers/create", label: "Create Seller", icon: PlusCircle },
      { href: "/admin/users/customers", label: "Customers", icon: UserCheck },
    ],
  },
  {
    label: "STORE",
    items: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
      { href: "/admin/categories", label: "Categories", icon: Tag },
      { href: "/admin/coupons", label: "Coupons", icon: Ticket },
    ],
  },
  {
    label: "FINANCE",
    items: [
      { href: "/admin/payments", label: "Payments", icon: CreditCard },
      { href: "/admin/reports", label: "Reports", icon: FileText },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { href: "/admin/settings", label: "Settings", icon: Settings },
      { href: "/admin/security", label: "Security", icon: Shield },
      { href: "/admin/pages", label: "Pages & SEO", icon: Globe },
    ],
  },
];

const sectionLabelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.18em",
  color: "rgba(255,255,255,0.22)",
  textTransform: "uppercase",
  padding: "0 10px",
  marginBottom: 6,
  display: "block",
};

export function AdminShell({ children, user }: AdminShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="admin-shell">

      {/* Mobile Backdrop */}
      <div className={`admin-backdrop ${sidebarOpen ? "visible" : ""}`}
        onClick={() => setSidebarOpen(false)} />

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>

        {/* Brand */}
        <div style={{ height: 68, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#d4af37,#a07c2e)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Shield size={17} color="#000" />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", color: "#d4af37" }}>AURABEADS</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginTop: 1 }}>Admin Panel</div>
            </div>
          </Link>
          <button
            className="admin-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            style={{ color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer", display: "flex", padding: 4 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Nav */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 12px" }}>
          {navSections.map((section) => (
            <div key={section.label} style={{ marginBottom: 20 }}>
              <span style={sectionLabelStyle}>{section.label}</span>
              {section.items.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`admin-nav-item ${active ? "active" : ""}`}
                  >
                    <Icon size={15} color={active ? "#000" : "rgba(255,255,255,0.4)"} style={{ flexShrink: 0 }} />
                    {label}
                    {active && <ChevronRight size={13} style={{ marginLeft: "auto" }} color="rgba(0,0,0,0.5)" />}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* User + Logout */}
        <div style={{ padding: 12, borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, background: "rgba(255,255,255,0.04)", marginBottom: 4 }}>
            <div style={{ width: 32, height: 32, borderRadius: 99, background: "linear-gradient(135deg,#d4af37,#a07c2e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#000", flexShrink: 0 }}>
              {initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#fff", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</p>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
            </div>
          </div>
          <form action={logout}>
            <button
              type="submit"
              style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 12px", borderRadius: 12, border: "none", background: "transparent", color: "rgba(255,255,255,0.35)", fontSize: 13, fontWeight: 500, cursor: "pointer" }}
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="admin-main">

        {/* Topbar */}
        <header style={{
          position: "sticky", top: 0, zIndex: 30,
          height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 24px", borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(10,10,15,0.97)", backdropFilter: "blur(12px)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              className="admin-hamburger"
              onClick={() => setSidebarOpen(true)}
              style={{ color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer", display: "flex", padding: 4 }}
            >
              <Menu size={20} />
            </button>
            <Link
              href="/admin"
              style={{ display: "flex", flexDirection: "column", textDecoration: "none", color: "inherit", gap: 2 }}
            >
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", margin: 0 }}>AuraBeads</p>
              <strong style={{ fontSize: 13, color: "#fff", lineHeight: 1 }}>Admin Workspace</strong>
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "8px 14px", width: 240 }}>
              <Search size={14} color="rgba(255,255,255,0.3)" />
              <input
                placeholder="Search anything…"
                style={{ background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 13, width: "100%" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/" target="_blank" style={{ display: "flex", alignItems: "center", gap: 6, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "6px 12px", fontSize: 12, color: "rgba(255,255,255,0.5)", textDecoration: "none", whiteSpace: "nowrap" }}>
              View Store <ExternalLink size={12} />
            </Link>

            <button style={{ position: "relative", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", display: "flex", padding: 4 }}>
              <Bell size={18} />
              <span style={{ position: "absolute", top: 4, right: 4, width: 7, height: 7, borderRadius: 99, background: "#ef4444", border: "2px solid #0a0a0f" }} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: 12, borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ width: 34, height: 34, borderRadius: 99, background: "linear-gradient(135deg,#d4af37,#a07c2e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#000", flexShrink: 0 }}>
                {initials}
              </div>
              <div style={{ display: "none" }} className="sm-show">
                <p style={{ fontSize: 12, fontWeight: 700, color: "#fff", margin: 0 }}>{user.name}</p>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "capitalize", margin: 0 }}>{user.role.toLowerCase()}</p>
              </div>
              <ChevronDown size={13} color="rgba(255,255,255,0.3)" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, overflowY: "auto" }}>{children}</main>
      </div>
    </div>
  );
}
