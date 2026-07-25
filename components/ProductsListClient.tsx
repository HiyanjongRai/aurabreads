'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { PublicProduct } from '@/lib/products';
import {
  Heart,
  Grid,
  List,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Truck,
  RotateCcw,
  ShieldCheck,
  Award,
  Sparkles,
  Search,
  Check,
} from 'lucide-react';

type Props = {
  initialProducts: PublicProduct[];
};

const DEMO_PRODUCTS: (PublicProduct & { rating: number; reviews: number; badge?: string })[] = [
  {
    id: 'p1',
    name: 'Twist Knot Earrings',
    price: 18.0,
    salePrice: null,
    images: ['/product-earrings1.png'],
    category: 'Earrings',
    shortDescription: 'Handcrafted gold twist knot design',
    stock: 24,
    featured: true,
    rating: 5.0,
    reviews: 128,
    badge: 'NEW',
  },
  {
    id: 'p2',
    name: 'Chunky Hoop Earrings',
    price: 20.0,
    salePrice: null,
    images: ['/product-earrings2.png'],
    category: 'Earrings',
    shortDescription: 'Polished gold chunky hoop earrings',
    stock: 18,
    featured: true,
    rating: 4.9,
    reviews: 96,
    badge: 'NEW',
  },
  {
    id: 'p3',
    name: 'Pearl Drop Earrings',
    price: 16.0,
    salePrice: null,
    images: ['/product-earrings1.png'],
    category: 'Earrings',
    shortDescription: 'Lustrous freshwater pearl drops',
    stock: 15,
    featured: false,
    rating: 4.8,
    reviews: 74,
  },
  {
    id: 'p4',
    name: 'Chain Link Bracelet',
    price: 22.0,
    salePrice: null,
    images: ['/product-earrings2.png'],
    category: 'Bracelets',
    shortDescription: 'Bold gold chain link bracelet',
    stock: 12,
    featured: true,
    rating: 4.9,
    reviews: 64,
  },
  {
    id: 'p5',
    name: 'Layered Pendant Necklace',
    price: 24.0,
    salePrice: null,
    images: ['/product-earrings1.png'],
    category: 'Necklaces',
    shortDescription: 'Double chain gold disc pendant',
    stock: 20,
    featured: true,
    rating: 5.0,
    reviews: 112,
  },
  {
    id: 'p6',
    name: 'Minimal Stack Rings',
    price: 14.0,
    salePrice: null,
    images: ['/product-earrings2.png'],
    category: 'Rings',
    shortDescription: 'Set of 3 textured gold stacking rings',
    stock: 30,
    featured: false,
    rating: 4.7,
    reviews: 53,
  },
  {
    id: 'p7',
    name: 'Gold Hair Clip',
    price: 12.0,
    salePrice: null,
    images: ['/product-earrings1.png'],
    category: 'Hair Accessories',
    shortDescription: 'Sculptural gold bow hair clip',
    stock: 16,
    featured: false,
    rating: 4.8,
    reviews: 31,
  },
  {
    id: 'p8',
    name: 'Classic Sunglasses',
    price: 25.0,
    salePrice: null,
    images: ['/product-earrings2.png'],
    category: 'Sunglasses',
    shortDescription: 'Vintage gold rimmed tinted sunglasses',
    stock: 10,
    featured: true,
    rating: 4.9,
    reviews: 40,
  },
  {
    id: 'p9',
    name: 'Teardrop Earrings',
    price: 17.0,
    salePrice: null,
    images: ['/product-earrings1.png'],
    category: 'Earrings',
    shortDescription: 'Hollow gold teardrop hoops',
    stock: 22,
    featured: false,
    rating: 4.8,
    reviews: 68,
  },
  {
    id: 'p10',
    name: 'Dainty Heart Necklace',
    price: 19.0,
    salePrice: null,
    images: ['/product-earrings2.png'],
    category: 'Necklaces',
    shortDescription: 'Polished mini heart pendant chain',
    stock: 25,
    featured: true,
    rating: 5.0,
    reviews: 90,
  },
  {
    id: 'p11',
    name: 'Sleek Cuff Bracelet',
    price: 21.0,
    salePrice: null,
    images: ['/product-earrings1.png'],
    category: 'Bracelets',
    shortDescription: 'Open minimalist gold cuff',
    stock: 14,
    featured: false,
    rating: 4.7,
    reviews: 45,
  },
  {
    id: 'p12',
    name: 'Ear Cuff & Stud Set',
    price: 16.0,
    salePrice: null,
    images: ['/product-earrings2.png'],
    category: 'Earrings',
    shortDescription: 'Multi-hoop gold ear stack set',
    stock: 19,
    featured: true,
    rating: 4.9,
    reviews: 37,
  },
];

const CATEGORIES = [
  { name: 'Earrings', count: 62 },
  { name: 'Necklaces', count: 28 },
  { name: 'Rings', count: 18 },
  { name: 'Bracelets', count: 16 },
  { name: 'Hair Accessories', count: 12 },
  { name: 'Sunglasses', count: 10 },
  { name: 'Other Accessories', count: 10 },
];

const COLLECTIONS = ['New In', 'Bestsellers', 'Minimal Edit', 'Golden Hour', 'Everyday Essentials'];
const MATERIALS = ['Gold Plated', 'Stainless Steel', 'Brass', 'Alloy', 'Pearl'];
const COLORS = [
  { name: 'Gold', hex: '#d4af37' },
  { name: 'Silver', hex: '#cbd5e1' },
  { name: 'Rose Gold', hex: '#e0a96d' },
  { name: 'Black', hex: '#1f2937' },
];

function StarRating({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-500 text-xs">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= Math.round(rating) ? 'text-amber-400' : 'text-gray-300'}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function ProductsListClient({ initialProducts }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Collapse states for sidebar sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    categories: true,
    collection: true,
    price: true,
    material: true,
    color: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  // Combine DB products with rich fallback catalog items
  const allProducts = useMemo(() => {
    if (initialProducts && initialProducts.length > 0) {
      return initialProducts.map((p, idx) => ({
        ...p,
        rating: 4.8,
        reviews: 32 + (idx * 7) % 80,
        badge: idx === 0 ? 'NEW' : undefined,
      }));
    }
    return DEMO_PRODUCTS;
  }, [initialProducts]);

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        if (selectedCategory && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
        if (p.price > maxPrice) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        return 0;
      });
  }, [allProducts, selectedCategory, maxPrice, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSelectedCollections([]);
    setSelectedMaterials([]);
    setSelectedColor(null);
    setMaxPrice(100);
  };

  const handleAddToCart = (product: any) => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('aurabeads_cart');
        const items: any[] = stored ? JSON.parse(stored) : [];
        const existing = items.find((i) => i.id === product.id);
        if (existing) {
          existing.qty = (existing.qty || 1) + 1;
        } else {
          items.push({
            id: product.id,
            name: product.name,
            price: product.price,
            qty: 1,
            img: product.images && product.images.length ? product.images[0] : '/product-earrings1.png',
            category: product.category,
          });
        }
        localStorage.setItem('aurabeads_cart', JSON.stringify(items));
        window.dispatchEvent(new Event('aurabeads_cart_updated'));
      } catch (e) {
        console.error('Cart add error:', e);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-inter">

      {/* ── Top Announcement Bar (Screenshot Match) ─────────────────────────── */}
      <div className="bg-gray-950 text-white text-[11px] font-medium tracking-wider uppercase py-2 px-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-gold-400">
            <Truck size={13} />
            <span>FREE SHIPPING ON ORDERS OVER $50</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-gray-300 text-[10px]">
            <span className="flex items-center gap-1">
              <RotateCcw size={12} className="text-gold-400" /> 30-DAY RETURNS
            </span>
            <span>NEED HELP?</span>
          </div>
        </div>
      </div>

      {/* ── Page Header Banner (Screenshot Match) ──────────────────────────── */}
      <section className="relative bg-[#f7f5f0] border-b border-gray-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 grid md:grid-cols-12 items-center gap-8">
          <div className="md:col-span-7 space-y-3">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Link href="/" className="hover:text-gray-900 transition">Home</Link>
              <span>›</span>
              <span className="text-gray-900 font-medium">Shop</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-gray-950">
              All Products
            </h1>
            <p className="text-sm text-gray-600 max-w-md leading-relaxed">
              Discover our handpicked collection of fashion jewelry designed to elevate your everyday look.
            </p>
          </div>

          {/* Banner Hero Jewelry Image */}
          <div className="md:col-span-5 relative h-48 sm:h-56 rounded-2xl overflow-hidden shadow-sm border border-stone-200/80">
            <img
              src="/product-earrings1.png"
              alt="Luxury fashion jewelry collection"
              className="w-full h-full object-cover object-center transform scale-110 hover:scale-105 transition duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-900/30 to-transparent" />
          </div>
        </div>
      </section>

      {/* ── Main Catalog Workspace ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ── Left Sidebar Filter Panel (Screenshot Match) ───────────────── */}
          <aside className="lg:col-span-3 space-y-6 bg-white pr-2 border-r border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={15} className="text-gray-900" />
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-950">FILTER</h2>
              </div>
              {(selectedCategory || selectedCollections.length > 0 || maxPrice < 100) && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-gray-500 hover:text-gold-700 underline font-medium transition"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* 1. CATEGORIES */}
            <div className="border-b border-gray-200 pb-5">
              <button
                onClick={() => toggleSection('categories')}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-900 mb-3"
              >
                <span>CATEGORIES</span>
                <span>{openSections.categories ? '−' : '+'}</span>
              </button>
              {openSections.categories && (
                <div className="space-y-2.5">
                  {CATEGORIES.map((cat) => {
                    const isChecked = selectedCategory === cat.name;
                    return (
                      <label
                        key={cat.name}
                        onClick={() => setSelectedCategory(isChecked ? null : cat.name)}
                        className="flex items-center justify-between text-xs text-gray-600 hover:text-gray-950 cursor-pointer group transition"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${isChecked ? 'bg-gray-950 border-gray-950 text-white' : 'border-gray-300 group-hover:border-gray-400'}`}>
                            {isChecked && <Check size={11} strokeWidth={3} />}
                          </div>
                          <span className={isChecked ? 'font-semibold text-gray-950' : ''}>{cat.name}</span>
                        </div>
                        <span className="text-[11px] text-gray-400 font-mono">({cat.count})</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. COLLECTION */}
            <div className="border-b border-gray-200 pb-5">
              <button
                onClick={() => toggleSection('collection')}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-900 mb-3"
              >
                <span>COLLECTION</span>
                <span>{openSections.collection ? '−' : '+'}</span>
              </button>
              {openSections.collection && (
                <div className="space-y-2.5">
                  {COLLECTIONS.map((col) => {
                    const isChecked = selectedCollections.includes(col);
                    return (
                      <label
                        key={col}
                        onClick={() => {
                          setSelectedCollections((prev) =>
                            prev.includes(col) ? prev.filter((i) => i !== col) : [...prev, col]
                          );
                        }}
                        className="flex items-center gap-2.5 text-xs text-gray-600 hover:text-gray-950 cursor-pointer group transition"
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${isChecked ? 'bg-gray-950 border-gray-950 text-white' : 'border-gray-300 group-hover:border-gray-400'}`}>
                          {isChecked && <Check size={11} strokeWidth={3} />}
                        </div>
                        <span className={isChecked ? 'font-semibold text-gray-950' : ''}>{col}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. PRICE SLIDER */}
            <div className="border-b border-gray-200 pb-5">
              <button
                onClick={() => toggleSection('price')}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-900 mb-3"
              >
                <span>PRICE</span>
                <span>{openSections.price ? '−' : '+'}</span>
              </button>
              {openSections.price && (
                <div className="space-y-3 pt-1">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <div className="flex justify-between items-center text-xs font-medium text-gray-700">
                    <span>$ 10</span>
                    <span className="font-bold text-gray-950">$ {maxPrice}</span>
                  </div>
                </div>
              )}
            </div>

            {/* 4. MATERIAL */}
            <div className="border-b border-gray-200 pb-5">
              <button
                onClick={() => toggleSection('material')}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-900 mb-3"
              >
                <span>MATERIAL</span>
                <span>{openSections.material ? '−' : '+'}</span>
              </button>
              {openSections.material && (
                <div className="space-y-2.5">
                  {MATERIALS.map((mat) => {
                    const isChecked = selectedMaterials.includes(mat);
                    return (
                      <label
                        key={mat}
                        onClick={() => {
                          setSelectedMaterials((prev) =>
                            prev.includes(mat) ? prev.filter((i) => i !== mat) : [...prev, mat]
                          );
                        }}
                        className="flex items-center gap-2.5 text-xs text-gray-600 hover:text-gray-950 cursor-pointer group transition"
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${isChecked ? 'bg-gray-950 border-gray-950 text-white' : 'border-gray-300 group-hover:border-gray-400'}`}>
                          {isChecked && <Check size={11} strokeWidth={3} />}
                        </div>
                        <span className={isChecked ? 'font-semibold text-gray-950' : ''}>{mat}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 5. COLOR SWATCHES */}
            <div className="pb-2">
              <button
                onClick={() => toggleSection('color')}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-900 mb-3"
              >
                <span>COLOR</span>
                <span>{openSections.color ? '−' : '+'}</span>
              </button>
              {openSections.color && (
                <div className="flex items-center gap-3 pt-1">
                  {COLORS.map((c) => {
                    const isSelected = selectedColor === c.name;
                    return (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(isSelected ? null : c.name)}
                        title={c.name}
                        className={`w-7 h-7 rounded-full transition transform hover:scale-110 shadow-sm border ${isSelected ? 'ring-2 ring-gray-950 ring-offset-2 scale-110' : 'border-gray-200'}`}
                        style={{ backgroundColor: c.hex }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </aside>

          {/* ── Main Catalog Grid Column ───────────────────────────────────── */}
          <main className="lg:col-span-9 space-y-6">

            {/* Top Grid Toolbar (Screenshot Match) */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200">
              <p className="text-xs text-gray-600">
                Showing <strong className="text-gray-950 font-semibold">1–{filteredProducts.length}</strong> of{' '}
                <strong className="text-gray-950 font-semibold">156</strong> products
              </p>

              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-9 px-3 text-xs font-semibold rounded-lg border border-gray-200 bg-white outline-none focus:border-gray-950 cursor-pointer"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>

                {/* View Mode Toggle Buttons */}
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition ${viewMode === 'grid' ? 'bg-gray-950 text-white' : 'text-gray-500 hover:text-gray-950'}`}
                    title="Grid View"
                  >
                    <Grid size={15} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition ${viewMode === 'list' ? 'bg-gray-950 text-white' : 'text-gray-500 hover:text-gray-950'}`}
                    title="List View"
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* ── 4-Column Product Grid (Screenshot Match) ───────────────────── */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                <Sparkles size={36} className="mx-auto text-amber-600" />
                <h3 className="font-serif text-xl font-bold text-gray-950">No products match your filter</h3>
                <p className="text-xs text-gray-500">Try adjusting your filters or price range to find items.</p>
                <button
                  onClick={clearAllFilters}
                  className="px-5 py-2.5 bg-gray-950 text-white text-xs font-bold rounded-xl hover:bg-black transition"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8'
                    : 'space-y-4'
                }
              >
                {filteredProducts.map((product) => {
                  const isWishlisted = wishlist.includes(product.id);
                  const img = product.images && product.images.length > 0 ? product.images[0] : '/product-earrings1.png';

                  return (
                    <div
                      key={product.id}
                      className="group flex flex-col justify-between bg-white rounded-2xl overflow-hidden border border-transparent hover:border-amber-200 hover:shadow-xl transition-all duration-300"
                    >
                      {/* Image Container */}
                      <div className="relative aspect-square w-full overflow-hidden bg-[#f5f4f0] flex items-center justify-center">
                        <Link href={`/product/${product.id}`} className="w-full h-full block">
                          <img
                            src={img}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </Link>

                        {/* Top Left Badge */}
                        {product.badge && (
                          <span className="absolute top-3 left-3 bg-gray-950 text-white text-[9px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded">
                            {product.badge}
                          </span>
                        )}

                        {/* Top Right Wishlist Button */}
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-gray-100 flex items-center justify-center text-gray-600 hover:text-red-500 transition shadow-sm"
                          aria-label="Add to wishlist"
                        >
                          <Heart size={15} className={isWishlisted ? 'fill-red-500 text-red-500' : ''} />
                        </button>
                      </div>

                      {/* Info & Pricing */}
                      <div className="pt-3 pb-1 space-y-1">
                        <Link href={`/product/${product.id}`}>
                          <h3 className="text-xs font-semibold text-gray-950 truncate hover:text-amber-700 transition">
                            {product.name}
                          </h3>
                        </Link>

                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-gray-950">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <StarRating rating={product.rating} />
                          <span className="text-[11px] text-gray-400 font-medium">({product.reviews})</span>
                        </div>

                        {/* Quick Add Button */}
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full mt-2 py-2 text-[11px] font-bold uppercase tracking-wider bg-gray-950 text-white rounded-xl hover:bg-black transition shadow-sm active:scale-98"
                        >
                          Add to Bag
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Pagination Bar (Screenshot Match) ─────────────────────────── */}
            <div className="flex items-center justify-center gap-2 pt-10 border-t border-gray-100">
              <button className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-950 transition">
                <ChevronLeft size={16} />
              </button>

              <button className="w-9 h-9 rounded-lg bg-gray-950 text-white font-bold text-xs flex items-center justify-center">
                1
              </button>
              <button className="w-9 h-9 rounded-lg border border-gray-200 text-gray-700 font-medium text-xs hover:border-gray-950 transition flex items-center justify-center">
                2
              </button>
              <button className="w-9 h-9 rounded-lg border border-gray-200 text-gray-700 font-medium text-xs hover:border-gray-950 transition flex items-center justify-center">
                3
              </button>
              <button className="w-9 h-9 rounded-lg border border-gray-200 text-gray-700 font-medium text-xs hover:border-gray-950 transition flex items-center justify-center">
                4
              </button>
              <span className="text-xs text-gray-400 px-1">...</span>
              <button className="w-9 h-9 rounded-lg border border-gray-200 text-gray-700 font-medium text-xs hover:border-gray-950 transition flex items-center justify-center">
                13
              </button>

              <button className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-950 transition">
                <ChevronRight size={16} />
              </button>
            </div>
          </main>

        </div>
      </div>

      {/* ── Bottom Trust Features Bar (Screenshot Match) ────────────────────── */}
      <section className="bg-stone-50 border-t border-stone-200 py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center text-amber-700 shadow-sm flex-shrink-0">
              <Truck size={22} />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-950">FREE SHIPPING</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">On orders over $50</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center text-amber-700 shadow-sm flex-shrink-0">
              <RotateCcw size={22} />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-950">30-DAY RETURNS</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Hassle-free returns</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center text-amber-700 shadow-sm flex-shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-950">SECURE PAYMENT</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Safe &amp; trusted checkout</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center text-amber-700 shadow-sm flex-shrink-0">
              <Award size={22} />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-950">QUALITY GUARANTEE</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Premium materials</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
