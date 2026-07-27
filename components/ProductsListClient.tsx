'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PublicProduct } from '@/lib/products';
import {
  Heart,
  Grid,
  List,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Truck,
  RotateCcw,
  ShieldCheck,
  Award,
  Sparkles,
  Check,
} from 'lucide-react';

type Props = {
  initialProducts: PublicProduct[];
};

type CatalogProduct = PublicProduct & { rating: number; reviews: number; badge?: string };

type CatalogCartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  img: string;
  category?: string | null;
};

const CATALOG_FALLBACK: CatalogProduct[] = [
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
    <div className="ab-pl-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= Math.round(rating) ? 'ab-pl-star filled' : 'ab-pl-star'}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function ProductsListClient({ initialProducts }: Props) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(50000); // High upper limit so DB items are never filtered out unexpectedly
  const [sortBy, setSortBy] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Section collapse toggles
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
        reviews: 32 + ((idx * 7) % 80),
        badge: idx === 0 ? 'NEW' : undefined,
      }));
    }
    return CATALOG_FALLBACK;
  }, [initialProducts]);

  const categoryOptions = useMemo(() => {
    const counts = allProducts.reduce<Record<string, number>>((acc, product) => {
      const key = product.category || 'Other Accessories';
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [allProducts]);

  const collectionCounts = useMemo<Record<string, number>>(() => {
    return {
      'New In': allProducts.length,
      Bestsellers: allProducts.filter((product) => product.featured).length,
      'Minimal Edit': allProducts.length,
      'Golden Hour': allProducts.length,
      'Everyday Essentials': allProducts.length,
    };
  }, [allProducts]);

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        if (selectedCategory && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }

        if (selectedCollections.length > 0) {
          const matchesCollection = selectedCollections.some((col) => {
            if (col === 'Bestsellers') return p.featured;
            return true;
          });
          if (!matchesCollection) return false;
        }

        if (selectedMaterials.length > 0) {
          // Product data does not contain explicit material metadata yet.
          // Keep this as a pass-through for future dynamic material filtering.
        }

        if (selectedColor && selectedColor !== p.category) {
          // No product color metadata available currently.
        }

        if (p.price > maxPrice) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        return 0;
      });
  }, [allProducts, selectedCategory, selectedCollections, selectedMaterials, selectedColor, maxPrice, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSelectedCollections([]);
    setSelectedMaterials([]);
    setSelectedColor(null);
    setMaxPrice(50000);
  };

  const openProductDetails = (product: CatalogProduct) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('aurabeads_last_viewed_product', JSON.stringify(product));
    }
    router.push(`/product/${product.id}`);
  };

  const handleAddToCart = (product: CatalogProduct) => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('aurabeads_cart');
        const items: CatalogCartItem[] = stored ? JSON.parse(stored) : [];
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
    <div className="ab-pl-root">

      {/* ── Top Announcement Bar ────────────────────────────────────────── */}
      <div className="ab-pl-announcement">
        <div className="ab-pl-announcement-inner">
          <div className="ab-pl-announcement-left">
            <Truck size={13} />
            <span>FREE SHIPPING ON ORDERS OVER $50</span>
          </div>
          <div className="ab-pl-announcement-right">
            <span><RotateCcw size={12} /> 30-DAY RETURNS</span>
            <span>NEED HELP?</span>
          </div>
        </div>
      </div>

      {/* ── Banner Header ────────────────────────────────────────────────── */}
      <section className="ab-pl-banner">
        <div className="ab-pl-banner-inner">
          <div className="ab-pl-banner-copy">
            <div className="ab-pl-breadcrumb">
              <Link href="/">Home</Link>
              <span>›</span>
              <span className="current">Shop</span>
            </div>
            <h1 className="ab-pl-banner-title">All Products</h1>
            <p className="ab-pl-banner-sub">
              Discover our handpicked collection of fashion jewelry designed to elevate your everyday look.
            </p>
          </div>

          <div className="ab-pl-banner-img-wrap">
            <img
              src="/product-earrings1.png"
              alt="Fashion jewelry banner"
              className="ab-pl-banner-img"
            />
          </div>
        </div>
      </section>

      {/* ── Main Catalog Content ────────────────────────────────────────── */}
      <div className="ab-pl-container">
        <div className="ab-pl-layout">

          {/* ── Left Sidebar Filters ────────────────────────────────────── */}
          <aside className="ab-pl-sidebar">
            <div className="ab-pl-filter-header">
              <div className="ab-pl-filter-title">
                <SlidersHorizontal size={14} />
                <span>FILTER</span>
              </div>
              {(selectedCategory || selectedCollections.length > 0 || maxPrice < 50000) && (
                <button onClick={clearAllFilters} className="ab-pl-clear-btn">
                  Clear All
                </button>
              )}
            </div>

            {/* 1. CATEGORIES */}
            <div className="ab-pl-group">
              <button onClick={() => toggleSection('categories')} className="ab-pl-group-header">
                <span>CATEGORIES</span>
                <span>{openSections.categories ? '−' : '+'}</span>
              </button>
              {openSections.categories && (
                <div className="ab-pl-group-body">
                  {categoryOptions.map((cat) => {
                    const isChecked = selectedCategory === cat.name;
                    return (
                      <button
                        type="button"
                        aria-pressed={isChecked}
                        key={cat.name}
                        onClick={() => setSelectedCategory(isChecked ? null : cat.name)}
                        className={`ab-pl-checkbox-row ${isChecked ? 'active' : ''}`}
                      >
                        <div className={`ab-pl-checkbox ${isChecked ? 'checked' : ''}`}>
                          {isChecked && <Check size={10} strokeWidth={3} />}
                        </div>
                        <span className="ab-pl-checkbox-label">{cat.name}</span>
                        <span className="ab-pl-checkbox-count">({cat.count})</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. COLLECTION */}
            <div className="ab-pl-group">
              <button onClick={() => toggleSection('collection')} className="ab-pl-group-header">
                <span>COLLECTION</span>
                <span>{openSections.collection ? '−' : '+'}</span>
              </button>
              {openSections.collection && (
                <div className="ab-pl-group-body">
                  {COLLECTIONS.map((col) => {
                    const isChecked = selectedCollections.includes(col);
                    return (
                      <button
                        type="button"
                        aria-pressed={isChecked}
                        key={col}
                        onClick={() => {
                          setSelectedCollections((prev) =>
                            prev.includes(col) ? prev.filter((i) => i !== col) : [...prev, col]
                          );
                        }}
                        className={`ab-pl-checkbox-row ${isChecked ? 'active' : ''}`}
                      >
                        <div className={`ab-pl-checkbox ${isChecked ? 'checked' : ''}`}>
                          {isChecked && <Check size={10} strokeWidth={3} />}
                        </div>
                        <span className="ab-pl-checkbox-label">{col}</span>
                        <span className="ab-pl-checkbox-count">({collectionCounts[col] ?? 0})</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. PRICE */}
            <div className="ab-pl-group">
              <button onClick={() => toggleSection('price')} className="ab-pl-group-header">
                <span>PRICE</span>
                <span>{openSections.price ? '−' : '+'}</span>
              </button>
              {openSections.price && (
                <div className="ab-pl-price-body">
                  <input
                    type="range"
                    min="10"
                    max="50000"
                    step="100"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="ab-pl-slider"
                  />
                  <div className="ab-pl-price-labels">
                    <span>NPR 10</span>
                    <strong>NPR {maxPrice.toLocaleString()}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* 4. MATERIAL */}
            <div className="ab-pl-group">
              <button onClick={() => toggleSection('material')} className="ab-pl-group-header">
                <span>MATERIAL</span>
                <span>{openSections.material ? '−' : '+'}</span>
              </button>
              {openSections.material && (
                <div className="ab-pl-group-body">
                  {MATERIALS.map((mat) => {
                    const isChecked = selectedMaterials.includes(mat);
                    return (
                      <button
                        type="button"
                        aria-pressed={isChecked}
                        key={mat}
                        onClick={() => {
                          setSelectedMaterials((prev) =>
                            prev.includes(mat) ? prev.filter((i) => i !== mat) : [...prev, mat]
                          );
                        }}
                        className={`ab-pl-checkbox-row ${isChecked ? 'active' : ''}`}
                      >
                        <div className={`ab-pl-checkbox ${isChecked ? 'checked' : ''}`}>
                          {isChecked && <Check size={10} strokeWidth={3} />}
                        </div>
                        <span className="ab-pl-checkbox-label">{mat}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 5. COLOR */}
            <div className="ab-pl-group no-border">
              <button onClick={() => toggleSection('color')} className="ab-pl-group-header">
                <span>COLOR</span>
                <span>{openSections.color ? '−' : '+'}</span>
              </button>
              {openSections.color && (
                <div className="ab-pl-swatch-row">
                  {COLORS.map((c) => {
                    const isSelected = selectedColor === c.name;
                    return (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(isSelected ? null : c.name)}
                        title={c.name}
                        className={`ab-pl-swatch ${isSelected ? 'selected' : ''}`}
                        style={{ backgroundColor: c.hex }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </aside>

          {/* ── Right Main Grid Column ──────────────────────────────────── */}
          <main className="ab-pl-main">

            {/* Toolbar */}
            <div className="ab-pl-toolbar">
              <p className="ab-pl-count-text">
                Showing <strong>1–{filteredProducts.length}</strong> of <strong>{allProducts.length}</strong> products
              </p>

              <div className="ab-pl-toolbar-right">
                <div className="ab-pl-sort-wrap">
                  <span>Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="ab-pl-sort-select"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>

                <div className="ab-pl-view-toggle">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`ab-pl-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    title="Grid View"
                  >
                    <Grid size={15} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`ab-pl-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    title="List View"
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Grid vs Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="ab-pl-empty-box">
                <Sparkles size={32} className="ab-pl-empty-icon" />
                <h3>No products match your filter</h3>
                <p>Try adjusting your price filter or selected category.</p>
                <button onClick={clearAllFilters} className="ab-pl-reset-btn">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'ab-pl-grid' : 'ab-pl-list'}>
                {filteredProducts.map((product) => {
                  const isWishlisted = wishlist.includes(product.id);
                  const img = product.images && product.images.length > 0 ? product.images[0] : '/product-earrings1.png';

                  return (
                    <div
                      key={product.id}
                      className="ab-pl-card"
                      role="button"
                      tabIndex={0}
                      onClick={() => openProductDetails(product)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          openProductDetails(product);
                        }
                      }}
                    >
                      {/* Image container */}
                      <div className="ab-pl-card-img-wrap">
                        <img src={img} alt={product.name} className="ab-pl-card-img" />
                        <div className="ab-card-view-options ab-card-view-options--catalog" aria-hidden="true">
                          <span>View Options</span>
                        </div>

                        {product.badge && (
                          <span className="ab-pl-badge">{product.badge}</span>
                        )}

                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleWishlist(product.id);
                          }}
                          className="ab-pl-wish-btn"
                          aria-label="Add to wishlist"
                          type="button"
                        >
                          <Heart size={14} className={isWishlisted ? 'filled' : ''} />
                        </button>
                      </div>

                      {/* Card Content */}
                      <div className="ab-pl-card-content">
                        <h3 className="ab-pl-card-title">{product.name}</h3>

                        <div className="ab-pl-card-price-row">
                          <span className="ab-pl-card-price">
                            NPR {product.price.toLocaleString()}
                          </span>
                        </div>

                        <div className="ab-pl-card-rating-row">
                          <StarRating rating={product.rating} />
                          <span className="ab-pl-card-reviews">({product.reviews})</span>
                        </div>

                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            handleAddToCart(product);
                          }}
                          className="ab-pl-add-btn"
                          type="button"
                        >
                          Add to Bag
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            <div className="ab-pl-pagination">
              <button className="ab-pl-page-btn arrow" disabled><ChevronLeft size={15} /></button>
              <button className="ab-pl-page-btn active">1</button>
              <button className="ab-pl-page-btn">2</button>
              <button className="ab-pl-page-btn">3</button>
              <button className="ab-pl-page-btn">4</button>
              <span className="ab-pl-page-ellipsis">...</span>
              <button className="ab-pl-page-btn">13</button>
              <button className="ab-pl-page-btn arrow"><ChevronRight size={15} /></button>
            </div>
          </main>

        </div>
      </div>

      {/* ── Bottom Trust Features Strip ─────────────────────────────────── */}
      <section className="ab-pl-trust-section">
        <div className="ab-pl-trust-container">
          <div className="ab-pl-trust-item">
            <div className="ab-pl-trust-icon"><Truck size={20} /></div>
            <div>
              <h4>FREE SHIPPING</h4>
              <p>On orders over $50</p>
            </div>
          </div>

          <div className="ab-pl-trust-item">
            <div className="ab-pl-trust-icon"><RotateCcw size={20} /></div>
            <div>
              <h4>30-DAY RETURNS</h4>
              <p>Hassle-free returns</p>
            </div>
          </div>

          <div className="ab-pl-trust-item">
            <div className="ab-pl-trust-icon"><ShieldCheck size={20} /></div>
            <div>
              <h4>SECURE PAYMENT</h4>
              <p>Safe &amp; trusted checkout</p>
            </div>
          </div>

          <div className="ab-pl-trust-item">
            <div className="ab-pl-trust-icon"><Award size={20} /></div>
            <div>
              <h4>QUALITY GUARANTEE</h4>
              <p>Premium materials</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
