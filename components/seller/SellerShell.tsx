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
} from "lucide-react";

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

  return (
    <div className="min-h-screen bg-[#f8fafc] font-inter text-slate-900 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#111111] text-slate-300 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <Link href="/seller" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#d4af37] to-[#a07c2e] text-white shadow-md">
              <Sparkles size={18} />
            </div>
            <div>
              <span className="block font-serif text-xl font-medium uppercase leading-none tracking-wider text-white">
                AuraBeads
              </span>
              <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
                Seller Portal
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-slate-400 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-4 py-6">
          <Link
            href="/seller"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
              pathname === "/seller"
                ? "bg-[#c9a84c] text-black shadow-lg shadow-[#c9a84c]/20"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>

          <div className="space-y-1">
            <p className="px-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Manage
            </p>
            <button
              onClick={() => setProductsOpen(!productsOpen)}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                pathname.startsWith("/seller/products")
                  ? "text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <Package size={18} />
                Products
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  productsOpen ? "rotate-180 text-[#d4af37]" : ""
                }`}
              />
            </button>

            {productsOpen && (
              <div className="ml-9 mt-1 space-y-1 border-l-2 border-white/10 pl-3">
                <Link
                  href="/seller/products"
                  className={`block rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    isNavActive("/seller/products")
                      ? "font-semibold text-[#d4af37]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  All Products
                </Link>
                <Link
                  href="/seller/products/add"
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    isNavActive("/seller/products/add")
                      ? "font-semibold text-[#d4af37]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span className="text-[#d4af37]">+</span> Add New Product
                </Link>
              </div>
            )}

            <NavItem href="/seller/orders" icon={ShoppingBag} label="Orders" />
            <NavItem href="/seller/customers" icon={Users} label="Customers" />
            <NavItem href="/seller/reviews" icon={Star} label="Reviews" />
          </div>

          <div className="space-y-1">
            <p className="px-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Store
            </p>
            <NavItem href="/seller/coupons" icon={Ticket} label="Coupons" />
            <NavItem href="/seller/banners" icon={ImageIcon} label="Banners" />
            <NavItem href="/seller/pages" icon={FileText} label="Pages" />
            <NavItem href="/seller/blog" icon={BookOpen} label="Blog Posts" />
          </div>

          <div className="space-y-1">
            <p className="px-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Settings
            </p>
            <NavItem href="/seller/settings" icon={Settings} label="Store Settings" />
            <NavItem href="/seller/payments" icon={CreditCard} label="Payment Methods" />
            <NavItem href="/seller/shipping" icon={Truck} label="Shipping" />
            <NavItem href="/seller/roles" icon={UserCheck} label="Admins & Roles" />
            <NavItem href="/seller/activity" icon={Activity} label="Activity Logs" />
          </div>
        </div>

        <div className="border-t border-white/10 p-4">
          <div className="rounded-2xl border border-[#c9a84c]/30 bg-gradient-to-b from-[#c9a84c]/10 to-transparent p-4 text-center">
            <div className="mb-2 flex justify-center text-[#d4af37]">
              <Headphones size={22} />
            </div>
            <h4 className="text-sm font-semibold text-white">Need Help?</h4>
            <p className="mb-3 mt-1 text-xs text-slate-400">
              Manage your store workspace here.
            </p>
            <button className="w-full rounded-xl border border-[#c9a84c] py-2 text-xs font-semibold text-[#d4af37] transition hover:bg-[#c9a84c] hover:text-black">
              Contact Support
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-slate-600 hover:text-slate-900 lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <h1 className="font-sans text-xl font-bold tracking-tight text-slate-900">
              Seller Workspace
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              <span>View Store</span>
              <ExternalLink size={14} />
            </Link>

            <button className="relative p-2 text-slate-600 transition hover:text-slate-900" aria-label="Notifications">
              <Bell size={20} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" />
            </button>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden text-left sm:block">
                <span className="block text-xs font-bold leading-tight text-slate-900">
                  {user.name}
                </span>
                <span className="block text-[11px] leading-tight text-slate-500">
                  {displayRole}
                </span>
              </div>
              <ChevronDown size={14} className="text-slate-400" />
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 p-6 md:p-8">
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
}: {
  href: string;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
}
