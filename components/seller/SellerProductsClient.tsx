'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { deleteProductAction } from '@/app/actions/product-delete';
import { useToast } from '@/components/ui/ToastProvider';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import {
  PlusCircle, Trash2, Package, Search, Eye, ArrowUpRight,
  CheckCircle2, AlertTriangle, XCircle, Filter,
} from 'lucide-react';

export type SellerProductItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  status: string;
  images?: string[];
  featured?: boolean;
  sku?: string | null;
};

type Props = {
  initialProducts: SellerProductItem[];
};

type Tab = 'all' | 'active' | 'low' | 'out';

export default function SellerProductsClient({ initialProducts }: Props) {
  const toast = useToast();
  const [products, setProducts] = useState<SellerProductItem[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    product: SellerProductItem | null;
    loading: boolean;
  }>({ open: false, product: null, loading: false });

  const handleDelete = async () => {
    if (!confirmDelete.product) return;
    setConfirmDelete((prev) => ({ ...prev, loading: true }));
    const result = await deleteProductAction(confirmDelete.product.id);
    if (result.success) {
      const name = confirmDelete.product.name;
      setProducts((prev) => prev.filter((p) => p.id !== confirmDelete.product!.id));
      setConfirmDelete({ open: false, product: null, loading: false });
      toast.success('Product Removed', `"${name}" was removed from your catalog.`);
    } else {
      setConfirmDelete((prev) => ({ ...prev, loading: false }));
      toast.error('Delete Failed', result.error || 'Unable to delete this product.');
    }
  };

  const stats = {
    all: products.length,
    active: products.filter((p) => (p.status === 'active' || p.status === 'Active') && p.stock > 10).length,
    low: products.filter((p) => p.stock > 0 && p.stock <= 10).length,
    out: products.filter((p) => p.stock === 0).length,
  };

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q));

      if (!matchSearch) return false;
      if (activeTab === 'active' && (p.status !== 'active' && p.status !== 'Active')) return false;
      if (activeTab === 'low' && !(p.stock > 0 && p.stock <= 10)) return false;
      if (activeTab === 'out' && p.stock !== 0) return false;
      return true;
    });
  }, [products, search, activeTab]);

  const getStatusBadge = (product: SellerProductItem) => {
    if (product.stock === 0)
      return { label: 'Out of Stock', bg: 'rgba(239,68,68,0.14)', color: '#f87171', Icon: XCircle };
    if (product.stock <= 10)
      return { label: 'Low Stock', bg: 'rgba(245,158,11,0.14)', color: '#fbbf24', Icon: AlertTriangle };
    if (product.status === 'active' || product.status === 'Active')
      return { label: 'Active', bg: 'rgba(34,197,94,0.14)', color: '#4ade80', Icon: CheckCircle2 };
    return { label: product.status, bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', Icon: Package };
  };

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: stats.all },
    { key: 'active', label: 'Active', count: stats.active },
    { key: 'low', label: 'Low Stock', count: stats.low },
    { key: 'out', label: 'Out of Stock', count: stats.out },
  ];

  return (
    <div style={{ padding: '32px', maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 22, fontFamily: 'Inter, sans-serif' }}>

      {/* ── Header ────────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', color: '#d4af37', textTransform: 'uppercase', marginBottom: 6 }}>
            SELLER CATALOG
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#ffffff', margin: '0 0 4px', letterSpacing: '-0.02em' }}>My Products</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
            {products.length} total listing{products.length !== 1 ? 's' : ''} · Manage and track your inventory
          </p>
        </div>

        <Link
          href="/seller/products/add"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '11px 22px', borderRadius: 12,
            background: 'linear-gradient(135deg, #d4af37, #a07c2e)',
            color: '#000000', fontSize: 13, fontWeight: 700,
            textDecoration: 'none', boxShadow: '0 4px 14px rgba(212,175,55,0.3)',
          }}
        >
          <PlusCircle size={16} />
          Add New Product
        </Link>
      </div>

      {/* ── Search + Filter Bar ──────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={14} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search by name, category, SKU…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: 36,
              paddingRight: 12,
              paddingTop: 10,
              paddingBottom: 10,
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.1)',
              background: '#161622',
              color: '#ffffff',
              fontSize: 13,
              outline: 'none',
            }}
          />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, background: '#161622', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 4 }}>
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                border: 'none',
                background: activeTab === t.key ? 'linear-gradient(135deg, #d4af37, #a07c2e)' : 'transparent',
                color: activeTab === t.key ? '#000' : 'rgba(255,255,255,0.5)',
                fontSize: 12,
                fontWeight: activeTab === t.key ? 700 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                whiteSpace: 'nowrap',
              }}
            >
              {t.label}
              <span style={{
                padding: '1px 6px',
                borderRadius: 99,
                fontSize: 10,
                fontWeight: 800,
                background: activeTab === t.key ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.08)',
                color: activeTab === t.key ? '#000' : 'rgba(255,255,255,0.4)',
              }}>
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Products Table ──────────────────────────────────────────────────── */}
      <div style={{ background: '#161622', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden' }}>

        {/* Table Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(212,175,55,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={17} color="#d4af37" />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', margin: 0 }}>Product Listings</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: '2px 0 0' }}>
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Filter size={15} color="rgba(255,255,255,0.3)" />
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '52px 24px', textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(212,175,55,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <Package size={22} color="#d4af37" />
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', margin: '0 0 6px' }}>
              {search ? `No results for "${search}"` : 'No products in this category'}
            </p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '0 0 20px' }}>
              {search ? 'Try a different search term.' : 'Add a product to see it here.'}
            </p>
            {!search && (
              <Link
                href="/seller/products/add"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '10px 20px', borderRadius: 12,
                  background: 'linear-gradient(135deg, #d4af37, #a07c2e)',
                  color: '#000', fontSize: 13, fontWeight: 700, textDecoration: 'none',
                }}
              >
                <PlusCircle size={15} /> Add Product
              </Link>
            )}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)' }}>
                  {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h, i) => (
                    <th
                      key={h}
                      style={{
                        padding: '12px 20px',
                        textAlign: i === 5 ? 'right' : 'left',
                        color: 'rgba(255,255,255,0.3)',
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => {
                  const badge = getStatusBadge(product);
                  const img = product.images?.[0];
                  const BadgeIcon = badge.Icon;
                  return (
                    <tr
                      key={product.id}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.12s' }}
                    >
                      {/* Product */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 44, height: 44, borderRadius: 12,
                            overflow: 'hidden', flexShrink: 0,
                            background: 'rgba(212,175,55,0.08)',
                            border: '1px solid rgba(255,255,255,0.07)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {img ? (
                              <img
                                src={img}
                                alt={product.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                            ) : (
                              <Package size={18} color="#d4af37" />
                            )}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', margin: 0, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {product.name}
                            </p>
                            {product.sku && (
                              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', margin: '2px 0 0', fontFamily: 'monospace' }}>
                                {product.sku}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td style={{ padding: '14px 20px', color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>
                        {product.category}
                      </td>

                      {/* Price */}
                      <td style={{ padding: '14px 20px' }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', margin: 0 }}>
                          NPR {product.price.toLocaleString('en-IN')}
                        </p>
                        {product.salePrice && product.salePrice < product.price && (
                          <p style={{ fontSize: 11, color: '#f87171', margin: '2px 0 0', textDecoration: 'line-through', opacity: 0.7 }}>
                            NPR {product.salePrice.toLocaleString('en-IN')}
                          </p>
                        )}
                      </td>

                      {/* Stock */}
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ color: product.stock === 0 ? '#f87171' : product.stock <= 10 ? '#fbbf24' : 'rgba(255,255,255,0.65)', fontWeight: product.stock <= 10 ? 700 : 500 }}>
                          {product.stock} units
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          padding: '4px 11px', borderRadius: 99,
                          background: badge.bg, color: badge.color,
                          fontSize: 11, fontWeight: 700,
                        }}>
                          <BadgeIcon size={11} />
                          {badge.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                          <Link
                            href={`/seller/products/${product.id}`}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: 5,
                              padding: '7px 12px', borderRadius: 9,
                              border: '1px solid rgba(255,255,255,0.1)',
                              background: 'rgba(255,255,255,0.04)',
                              color: 'rgba(255,255,255,0.7)',
                              fontSize: 12, fontWeight: 600, textDecoration: 'none',
                            }}
                          >
                            <Eye size={13} /> View
                          </Link>

                          <button
                            onClick={() => setConfirmDelete({ open: true, product, loading: false })}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: 5,
                              padding: '7px 12px', borderRadius: 9,
                              border: '1px solid rgba(239,68,68,0.25)',
                              background: 'rgba(239,68,68,0.1)',
                              color: '#f87171', fontSize: 12, fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Quick Add CTA ─────────────────────────────────────────────────────── */}
      {products.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px', borderRadius: 18,
          background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(160,124,46,0.04) 100%)',
          border: '1px solid rgba(212,175,55,0.15)',
          flexWrap: 'wrap', gap: 12,
        }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', margin: 0 }}>Ready to expand your catalog?</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: '3px 0 0' }}>
              Add more products to reach more customers and grow your sales.
            </p>
          </div>
          <Link
            href="/seller/products/add"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', borderRadius: 12,
              background: 'linear-gradient(135deg, #d4af37, #a07c2e)',
              color: '#000', fontSize: 13, fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            <PlusCircle size={15} />
            Add Another Product
            <ArrowUpRight size={14} />
          </Link>
        </div>
      )}

      {/* ── Confirm Delete Modal ──────────────────────────────────────────────── */}
      <ConfirmModal
        isOpen={confirmDelete.open}
        title="Delete Product?"
        description={`This will permanently remove "${confirmDelete.product?.name}" from your catalog. Customers won't be able to find it anymore.`}
        confirmText="Yes, Delete"
        cancelText="Keep It"
        variant="danger"
        isLoading={confirmDelete.loading}
        onClose={() => setConfirmDelete({ open: false, product: null, loading: false })}
        onConfirm={handleDelete}
      />
    </div>
  );
}
