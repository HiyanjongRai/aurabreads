'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { deleteProductAction } from '@/app/actions/product-delete';
import {
  Search,
  PlusCircle,
  Filter,
  Edit2,
  Trash2,
  Package,
  Eye,
  ArrowUpDown,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export type AdminProductItem = {
  id: string;
  name: string;
  sku: string | null;
  category: string;
  price: number;
  stock: number;
  status: string;
  images: string[];
  sellerName: string;
};

type Props = {
  initialProducts: AdminProductItem[];
  stats: {
    total: number;
    active: number;
    lowStock: number;
    outOfStock: number;
  };
};

export default function AdminProductsClient({ initialProducts, stats }: Props) {
  const [products, setProducts] = useState<AdminProductItem[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'lowStock' | 'outOfStock' | 'draft'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-desc' | 'price-asc' | 'stock-asc'>('newest');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Selected product for Quick View Modal
  const [previewProduct, setPreviewProduct] = useState<AdminProductItem | null>(null);

  // Quick Stock Edit state
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [editingStockVal, setEditingStockVal] = useState<number>(0);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Search Query
      const query = search.toLowerCase().trim();
      const matchesSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        (p.sku && p.sku.toLowerCase().includes(query)) ||
        p.category.toLowerCase().includes(query) ||
        p.sellerName.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      // 2. Tab Filter
      if (activeTab === 'active' && p.status !== 'active' && p.status !== 'Active') return false;
      if (activeTab === 'lowStock' && (p.stock <= 0 || p.stock > 10)) return false;
      if (activeTab === 'outOfStock' && p.stock !== 0) return false;
      if (activeTab === 'draft' && p.status !== 'draft' && p.status !== 'archived') return false;

      // 3. Category Filter
      if (selectedCategory !== 'all' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'stock-asc') return a.stock - b.stock;
      return 0; // Default newest
    });
  }, [products, search, activeTab, selectedCategory, sortBy]);

  // Paginated list
  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, page, pageSize]);

  // Select all handler
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedProducts.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Stock quick edit save
  const handleSaveStock = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: editingStockVal } : p))
    );
    setEditingStockId(null);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'SKU', 'Category', 'Price (NPR)', 'Stock', 'Status', 'Seller'];
    const rows = filteredProducts.map((p) => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.sku || 'N/A',
      p.category,
      p.price,
      p.stock,
      p.status,
      `"${p.sellerName.replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aurabeads_products_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: '32px', maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24, color: '#ffffff' }}>
      
      {/* ── Top Header Bar ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', color: '#d4af37', textTransform: 'uppercase', marginBottom: 4 }}>
            STORE CATALOG ADMINISTRATION
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
            Products Directory
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
            Manage, filter, and inspect products across all seller accounts.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={handleExportCSV}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              borderRadius: 12,
              padding: '10px 18px',
              fontSize: 13,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.8)',
              background: '#161622',
              border: '1px solid rgba(255,255,255,0.12)',
              cursor: 'pointer',
            }}
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>

          <Link
            href="/seller/products/add"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              borderRadius: 12,
              padding: '10px 22px',
              fontSize: 13,
              fontWeight: 700,
              color: '#000000',
              background: 'linear-gradient(135deg, #d4af37, #a07c2e)',
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(212,175,55,0.3)',
            }}
          >
            <PlusCircle size={16} />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* ── Interactive Metric Cards ───────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {[
          { key: 'all', label: 'Total Catalog', count: stats.total, color: '#d4af37', icon: Package },
          { key: 'active', label: 'Active Listings', count: stats.active, color: '#34d399', icon: CheckCircle2 },
          { key: 'lowStock', label: 'Low Stock (≤10)', count: stats.lowStock, color: '#f59e0b', icon: AlertTriangle },
          { key: 'outOfStock', label: 'Out of Stock', count: stats.outOfStock, color: '#f87171', icon: XCircle },
        ].map((item) => {
          const Icon = item.icon;
          const isSelected = activeTab === item.key;
          return (
            <div
              key={item.key}
              onClick={() => {
                setActiveTab(item.key as any);
                setPage(1);
              }}
              style={{
                background: isSelected ? 'rgba(212,175,55,0.08)' : '#161622',
                border: isSelected ? '1px solid #d4af37' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: 18,
                padding: '20px 22px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
              }}
            >
              <div>
                <span style={{ fontSize: 26, fontWeight: 800, color: item.color, display: 'block', lineHeight: 1 }}>
                  {item.count}
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginTop: 6, display: 'block' }}>
                  {item.label}
                </span>
              </div>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={20} color={item.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Search, Tabs & Filters Bar ─────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, background: '#161622', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 18 }}>
        
        {/* Status Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 14 }}>
          {[
            { id: 'all', label: `All Products (${stats.total})` },
            { id: 'active', label: `Active (${stats.active})` },
            { id: 'lowStock', label: `Low Stock (${stats.lowStock})` },
            { id: 'outOfStock', label: `Out of Stock (${stats.outOfStock})` },
            { id: 'draft', label: 'Drafts / Archived' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setPage(1);
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  border: 'none',
                  background: isActive ? 'linear-gradient(135deg, #d4af37, #a07c2e)' : 'rgba(255,255,255,0.04)',
                  color: isActive ? '#000000' : 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Inputs Row: Search + Category Filter + Sort */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          
          {/* Search Box */}
          <div style={{ flex: 1, minWidth: 260, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '9px 14px' }}>
            <Search size={16} color="rgba(255,255,255,0.3)" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by title, SKU, category, or seller name…"
              style={{ background: 'transparent', border: 'none', outline: 'none', color: '#ffffff', fontSize: 13, width: '100%' }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            style={{
              background: '#1c1c2b',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              padding: '9px 14px',
              color: '#ffffff',
              fontSize: 13,
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Categories</option>
            <option value="necklaces">Necklaces & Chokers</option>
            <option value="earrings">Earrings</option>
            <option value="bracelets">Bracelets</option>
            <option value="rings">Rings</option>
            <option value="anklets">Anklets</option>
          </select>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#1c1c2b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '0 12px' }}>
            <ArrowUpDown size={14} color="rgba(255,255,255,0.4)" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '9px 0',
                color: '#ffffff',
                fontSize: 13,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price-desc">Sort: Price High → Low</option>
              <option value="price-asc">Sort: Price Low → High</option>
              <option value="stock-asc">Sort: Lowest Stock First</option>
            </select>
          </div>
        </div>

      </div>

      {/* ── Table Card ────────────────────────────────────────────────────── */}
      <div style={{ background: '#161622', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '16px 20px', width: 40 }}>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={paginatedProducts.length > 0 && paginatedProducts.every((p) => selectedIds.includes(p.id))}
                    style={{ accentColor: '#d4af37', cursor: 'pointer' }}
                  />
                </th>
                <th style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Product
                </th>
                <th style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  SKU
                </th>
                <th style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Category
                </th>
                <th style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Price (NPR)
                </th>
                <th style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Stock Quantity
                </th>
                <th style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Status
                </th>
                <th style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Seller Account
                </th>
                <th style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'right' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '48px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                    No products found matching your active filters.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => {
                  const img = p.images?.[0] || '/product-earrings1.png';
                  const isSelected = selectedIds.includes(p.id);
                  const isLow = p.stock > 0 && p.stock <= 10;
                  const isOut = p.stock === 0;
                  const isActive = p.status === 'active' || p.status === 'Active';
                  const isEditingStock = editingStockId === p.id;

                  return (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        background: isSelected ? 'rgba(212,175,55,0.05)' : 'transparent',
                        transition: 'background 0.15s',
                      }}
                    >
                      {/* Checkbox */}
                      <td style={{ padding: '16px 20px' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(p.id)}
                          style={{ accentColor: '#d4af37', cursor: 'pointer' }}
                        />
                      </td>

                      {/* Product Name & Image */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          <div
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 12,
                              overflow: 'hidden',
                              background: '#252538',
                              flexShrink: 0,
                              border: '1px solid rgba(255,255,255,0.1)',
                            }}
                          >
                            <img
                              src={img}
                              alt={p.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/product-earrings1.png';
                              }}
                            />
                          </div>
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', margin: 0 }}>{p.name}</p>
                            {p.images?.length > 0 && p.images[0].startsWith('https://res.cloudinary.com') ? (
                              <span style={{ fontSize: 10, color: '#d4af37', fontWeight: 700 }}>☁ Cloudinary CDN</span>
                            ) : (
                              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Local Demo</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td style={{ padding: '16px 20px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
                        {p.sku || 'N/A'}
                      </td>

                      {/* Category */}
                      <td style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.8)', textTransform: 'capitalize' }}>
                        {p.category}
                      </td>

                      {/* Price */}
                      <td style={{ padding: '16px 20px', fontWeight: 800, color: '#ffffff' }}>
                        NPR {p.price.toLocaleString()}
                      </td>

                      {/* Stock Quantity + Inline Edit */}
                      <td style={{ padding: '16px 20px' }}>
                        {isEditingStock ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <input
                              type="number"
                              value={editingStockVal}
                              onChange={(e) => setEditingStockVal(parseInt(e.target.value, 10) || 0)}
                              style={{
                                width: 70,
                                background: '#1c1c2b',
                                border: '1px solid #d4af37',
                                color: '#fff',
                                padding: '4px 8px',
                                borderRadius: 6,
                                fontSize: 12,
                              }}
                            />
                            <button
                              onClick={() => handleSaveStock(p.id)}
                              style={{ background: '#d4af37', color: '#000', border: 'none', borderRadius: 6, padding: '4px 8px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {isOut ? (
                              <span style={{ color: '#ef4444', fontWeight: 700 }}>Out of Stock</span>
                            ) : isLow ? (
                              <span style={{ color: '#f59e0b', fontWeight: 700 }}>{p.stock} units (Low)</span>
                            ) : (
                              <span style={{ color: 'rgba(255,255,255,0.8)' }}>{p.stock} units</span>
                            )}
                            <button
                              onClick={() => {
                                setEditingStockId(p.id);
                                setEditingStockVal(p.stock);
                              }}
                              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 2 }}
                              title="Edit Stock"
                            >
                              <Edit2 size={12} />
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '16px 20px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '4px 12px',
                            borderRadius: 99,
                            fontSize: 11,
                            fontWeight: 700,
                            background: isActive ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.1)',
                            color: isActive ? '#34d399' : 'rgba(255,255,255,0.5)',
                            border: isActive ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.1)',
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              background: isActive ? '#34d399' : 'rgba(255,255,255,0.4)',
                            }}
                          />
                          {isActive ? 'Active' : p.status}
                        </span>
                      </td>

                      {/* Seller Account */}
                      <td style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.6)' }}>
                        {p.sellerName}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                          <button
                            onClick={() => setPreviewProduct(p)}
                            style={{
                              background: 'rgba(255,255,255,0.04)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: 8,
                              padding: 6,
                              color: 'rgba(255,255,255,0.7)',
                              cursor: 'pointer',
                            }}
                            title="Quick View"
                          >
                            <Eye size={14} />
                          </button>

                          <button
                            onClick={async () => {
                              const confirmed = window.confirm(`Delete "${p.name}" from store catalog?`);
                              if (!confirmed) return;

                              const result = await deleteProductAction(p.id);
                              if (result.success) {
                                setProducts((prev) => prev.filter((item) => item.id !== p.id));
                              } else {
                                alert(result.error || 'Unable to delete product.');
                              }
                            }}
                            style={{
                              background: 'rgba(239,68,68,0.1)',
                              border: '1px solid rgba(239,68,68,0.2)',
                              borderRadius: 8,
                              padding: 6,
                              color: '#f87171',
                              cursor: 'pointer',
                            }}
                            title="Delete Product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Table Footer & Pagination ───────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            Showing {paginatedProducts.length} of {filteredProducts.length} filtered products ({products.length} total)
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: page === 1 ? 'rgba(255,255,255,0.2)' : '#ffffff',
                cursor: page === 1 ? 'default' : 'pointer',
              }}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
              <button
                key={pNum}
                onClick={() => setPage(pNum)}
                style={{
                  minWidth: 32,
                  height: 32,
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  border: 'none',
                  background: page === pNum ? 'linear-gradient(135deg, #d4af37, #a07c2e)' : 'rgba(255,255,255,0.04)',
                  color: page === pNum ? '#000000' : 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                }}
              >
                {pNum}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: page === totalPages ? 'rgba(255,255,255,0.2)' : '#ffffff',
                cursor: page === totalPages ? 'default' : 'pointer',
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Quick View Modal ──────────────────────────────────────────────── */}
      {previewProduct && (
        <div
          onClick={() => setPreviewProduct(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#161622',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 24,
              padding: 28,
              maxWidth: 520,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setPreviewProduct(null)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                color: '#fff',
                borderRadius: 99,
                width: 32,
                height: 32,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={16} />
            </button>

            <div style={{ display: 'flex', gap: 20 }}>
              <div style={{ width: 140, height: 140, borderRadius: 16, overflow: 'hidden', background: '#252538', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
                <img
                  src={previewProduct.images?.[0] || '/product-earrings1.png'}
                  alt={previewProduct.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#d4af37', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {previewProduct.category}
                </span>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>{previewProduct.name}</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0 }}>SKU: {previewProduct.sku || 'N/A'}</p>
                <p style={{ fontSize: 20, fontWeight: 800, color: '#34d399', margin: 0 }}>NPR {previewProduct.price.toLocaleString()}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 14 }}>
              <div>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', display: 'block' }}>Stock Status</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: previewProduct.stock > 0 ? '#ffffff' : '#ef4444' }}>
                  {previewProduct.stock} units
                </span>
              </div>
              <div>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', display: 'block' }}>Seller</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>{previewProduct.sellerName}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => setPreviewProduct(null)}
                style={{ padding: '10px 18px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
