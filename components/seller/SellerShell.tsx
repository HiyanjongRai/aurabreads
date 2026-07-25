"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  Users,
  Star,
  Settings,
  CreditCard,
  Truck,
  Bell,
  Menu,
  X,
  LogOut,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ExternalLink,
  BarChart3,
  Tag,
  Image as ImageIcon,
  HelpCircle,
  Activity,
  Eye,
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

type ChildItem = {
  href: string;
  label: string;
  icon?: React.ComponentType<{ size?: number; color?: string }>;
};

type NavItemDef =
  | {
      type: "link";
      href: string;
      icon: React.ComponentType<{ size?: number; color?: string }>;
      label: string;
    }
  | {
      type: "group";
      icon: React.ComponentType<{ size?: number; color?: string }>;
      label: string;
      prefix: string;
      children: ChildItem[];
    };

type NavGroup = { section: string; items: NavItemDef[] };

const NAV_GROUPS: NavGroup[] = [
  {
    section: "OVERVIEW",
    items: [
      { type: "link", href: "/seller", icon: LayoutDashboard, label: "Dashboard" },
      { type: "link", href: "/seller/analytics", icon: BarChart3, label: "Analytics" },
      { type: "link", href: "/seller/activity", icon: Activity, label: "Activity Log" },
    ],
  },
  {
    section: "CATALOG",
    items: [
      {
        type: "group",
        icon: Package,
        label: "Products",
        prefix: "/seller/products",
        children: [
          { href: "/seller/products", label: "All Products", icon: Eye },
          { href: "/seller/products/add", label: "Add Product", icon: PlusCircle },
        ],
      },
      { type: "link", href: "/seller/categories", icon: Tag, label: "Categories" },
      { type: "link", href: "/seller/media", icon: ImageIcon, label: "Media Library" },
    ],
  },
  {
    section: "SALES",
    items: [
      { type: "link", href: "/seller/orders", icon: ShoppingBag, label: "Orders" },
      { type: "link", href: "/seller/customers", icon: Users, label: "Customers" },
      { type: "link", href: "/seller/reviews", icon: Star, label: "Reviews" },
    ],
  },
  {
    section: "SETTINGS",
    items: [
      { type: "link", href: "/seller/settings", icon: Settings, label: "Store Settings" },
      { type: "link", href: "/seller/payments", icon: CreditCard, label: "Payments" },
      { type: "link", href: "/seller/shipping", icon: Truck, label: "Shipping" },
      { type: "link", href: "/seller/support", icon: HelpCircle, label: "Support" },
    ],
  },
];

export function SellerShell({ children, user }: SellerShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Products: true,
  });

  const displayRole = user.role === "ADMIN" ? "Administrator" : "Seller";
  const initial = user.name ? user.name[0].toUpperCase() : "S";

  // Auto-close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const isExact = (href: string) => pathname === href;
  const isPrefix = (prefix: string) => pathname.startsWith(prefix);

  const toggleGroup = (label: string) =>
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));

  return (
    <div className="seller-shell">
      {/* Mobile backdrop */}
      <div
        className={`seller-backdrop ${sidebarOpen ? "visible" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      <aside className={`seller-sidebar ${sidebarOpen ? "open" : ""}`}>

        {/* Brand Header */}
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            flexShrink: 0,
          }}
        >
          <Link
            href="/seller"
            style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "linear-gradient(135deg, #d4af37, #a07c2e)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 4px 12px rgba(212,175,55,0.3)",
              }}
            >
              <Sparkles size={16} color="#000" />
            </div>
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  color: "#d4af37",
                  textTransform: "uppercase",
                }}
              >
                AuraBeads
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em" }}>
                Seller Portal
              </div>
            </div>
          </Link>

          <button
            className="seller-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.4)",
              cursor: "pointer",
              display: "flex",
              padding: 4,
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Nav */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 10px" }}>
          {NAV_GROUPS.map((group) => (
            <div key={group.section} style={{ marginBottom: 20 }}>
              <span
                style={{
                  display: "block",
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: "0.2em",
                  color: "rgba(255,255,255,0.2)",
                  textTransform: "uppercase",
                  padding: "0 10px 6px",
                }}
              >
                {group.section}
              </span>

              {group.items.map((item) => {
                if (item.type === "link") {
                  const active = isExact(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`seller-nav-link ${active ? "active" : ""}`}
                    >
                      <item.icon size={15} color={active ? "#000" : "rgba(255,255,255,0.4)"} />
                      <span style={{ flex: 1 }}>{item.label}</span>
                      {active && (
                        <ChevronRight size={13} color="rgba(0,0,0,0.5)" />
                      )}
                    </Link>
                  );
                }

                // Accordion group
                const groupActive = isPrefix(item.prefix);
                const isOpen = openGroups[item.label] ?? false;

                return (
                  <div key={item.label}>
                    <button
                      onClick={() => toggleGroup(item.label)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        padding: "9px 12px",
                        borderRadius: 11,
                        border: "none",
                        background:
                          groupActive && !isOpen
                            ? "rgba(212,175,55,0.08)"
                            : isOpen
                            ? "rgba(255,255,255,0.04)"
                            : "transparent",
                        color: groupActive ? "#ffffff" : "rgba(255,255,255,0.5)",
                        fontSize: 13,
                        fontWeight: groupActive ? 700 : 500,
                        cursor: "pointer",
                        marginBottom: 2,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <item.icon
                          size={15}
                          color={groupActive ? "#d4af37" : "rgba(255,255,255,0.4)"}
                        />
                        <span>{item.label}</span>
                      </div>
                      <ChevronDown
                        size={13}
                        style={{
                          transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                          transition: "transform 0.2s",
                          color: isOpen ? "#d4af37" : "rgba(255,255,255,0.25)",
                        }}
                      />
                    </button>

                    {isOpen && (
                      <div
                        style={{
                          marginLeft: 26,
                          paddingLeft: 12,
                          borderLeft: "1px solid rgba(255,255,255,0.08)",
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                          marginBottom: 4,
                        }}
                      >
                        {item.children.map((child) => {
                          const childActive = isExact(child.href);
                          const ChildIcon = child.icon;
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`seller-nav-child ${childActive ? "active" : ""}`}
                            >
                              {ChildIcon && (
                                <ChildIcon
                                  size={13}
                                  color={childActive ? "#d4af37" : "rgba(255,255,255,0.3)"}
                                />
                              )}
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Profile + Sign Out */}
        <div
          style={{
            padding: "10px 10px 14px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.04)",
              marginBottom: 4,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 99,
                background: "linear-gradient(135deg, #d4af37, #a07c2e)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 800,
                color: "#000",
                flexShrink: 0,
              }}
            >
              {initial}
            </div>
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#ffffff",
                  margin: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user.name}
              </p>
              <p
                style={{
                  fontSize: 10,
                  color: "#d4af37",
                  margin: 0,
                  fontWeight: 600,
                }}
              >
                {displayRole}
              </p>
            </div>
          </div>

          <form action={logout}>
            <button
              type="submit"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "9px 12px",
                borderRadius: 11,
                border: "none",
                background: "transparent",
                color: "rgba(255,255,255,0.35)",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main Viewport ─────────────────────────────────────────────────── */}
      <div className="seller-main">
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
            background: "rgba(10,10,15,0.97)",
            backdropFilter: "blur(12px)",
            flexShrink: 0,
          }}
        >
          {/* Left: hamburger + title */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button
              className="seller-hamburger"
              onClick={() => setSidebarOpen(true)}
              style={{
                color: "rgba(255,255,255,0.5)",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                padding: 4,
              }}
            >
              <Menu size={20} />
            </button>

            <div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", margin: 0 }}>AuraBeads</p>
              <h1
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#ffffff",
                  margin: 0,
                  letterSpacing: "-0.01em",
                }}
              >
                Seller Workspace
              </h1>
            </div>
          </div>

          {/* Right: actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
                color: "rgba(255,255,255,0.55)",
                textDecoration: "none",
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              View Store <ExternalLink size={12} />
            </Link>

            <Link
              href="/seller/products/add"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                borderRadius: 10,
                background: "linear-gradient(135deg, #d4af37, #a07c2e)",
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 700,
                color: "#000",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              <PlusCircle size={13} />
              Add Product
            </Link>

            <button
              style={{
                position: "relative",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(255,255,255,0.45)",
                display: "flex",
                padding: 4,
              }}
            >
              <Bell size={18} />
              <span
                style={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  width: 7,
                  height: 7,
                  borderRadius: 99,
                  background: "#f59e0b",
                  border: "1.5px solid #0a0a0f",
                }}
              />
            </button>

            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 99,
                background: "linear-gradient(135deg, #d4af37, #a07c2e)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 800,
                color: "#000",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              {initial}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, overflowY: "auto" }}>{children}</main>
      </div>
    </div>
  );
}
