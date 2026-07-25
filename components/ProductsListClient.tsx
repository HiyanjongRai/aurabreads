'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { PublicProduct } from '@/lib/products';

const filters = {
  categories: ['Earrings', 'Necklaces', 'Rings', 'Bracelets', 'Hair Accessories', 'Sunglasses'],
  collections: ['New In', 'Bestsellers', 'Minimal Edit', 'Golden Hour', 'Everyday Essentials'],
};

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'low-to-high', label: 'Price: Low to High' },
  { value: 'high-to-low', label: 'Price: High to Low' },
];

type Props = {
  initialProducts: PublicProduct[];
};

function StarRating({ rating = 5 }: { rating?: number }) {
  return (
    <div className="ab-stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= Math.floor(rating) ? 'ab-star filled' : s - 0.5 <= rating ? 'ab-star half' : 'ab-star'}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function ProductsListClient({ initialProducts }: Props) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [sort, setSort] = useState<string>('newest');
  const [gridMode, setGridMode] = useState<'grid' | 'list'>('grid');

  const categoryCounts = useMemo(() => {
    return initialProducts.reduce<Record<string, number>>((acc, product) => {
      acc[product.category] = (acc[product.category] ?? 0) + 1;
      return acc;
    }, {});
  }, [initialProducts]);

  const products = useMemo(() => {
    const normalized = initialProducts.map((product) => ({
      ...product,
      displayPrice: product.salePrice ?? product.price,
      originalPrice: product.salePrice ? product.price : null,
      rating: 4.8,
      reviews: 32 + Math.floor(product.price % 80),
      imageUrl: product.images && product.images.length ? product.images[0] : '/product-earrings1.png',
    }));

    return normalized
      .filter((product) => selectedCategories.length === 0 || selectedCategories.includes(product.category))
      .filter((product) => {
        if (selectedCollections.length === 0) return true;
        if (selectedCollections.includes('Bestsellers')) return product.featured;
        return true;
      })
      .sort((a, b) => {
        if (sort === 'low-to-high') return a.displayPrice - b.displayPrice;
        if (sort === 'high-to-low') return b.displayPrice - a.displayPrice;
        return 0;
      });
  }, [initialProducts, selectedCategories, selectedCollections, sort]);

  return (
    <main className="ab-shop-page">
      <section className="ab-section" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <div className="ab-container">
          <div className="ab-shop-hero">
            <div className="ab-shop-hero-copy">
              <div className="ab-shop-breadcrumbs">
                <Link href="/" style={{ color: '#6b7280', textDecoration: 'none' }}>Home</Link>
                <span>/</span>
                <span>Shop</span>
              </div>
              <h1 className="ab-section-title" style={{ marginBottom: 16 }}>All Products</h1>
              <p>Discover our handpicked collection of fashion jewelry designed to elevate your everyday look.</p>
            </div>
            <div className="ab-shop-hero-image">
              <img
                src="/hero-model.png"
                alt="All products hero"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

          <div className="ab-shop-wrapper">
            <aside className="ab-shop-sidebar">
              <div className="ab-shop-sidebar-header">
                <h2>Filter</h2>
                <button className="ab-shop-clear" onClick={() => { setSelectedCategories([]); setSelectedCollections([]); }}>Clear All</button>
              </div>

              <div className="ab-shop-filter-group">
                <div className="ab-shop-filter-title">Categories</div>
                <div className="ab-shop-filter-list">
                  {filters.categories.map((item) => (
                    <label key={item} className="ab-shop-checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(item)}
                        onChange={() => {
                          setSelectedCategories((prev) =>
                            prev.includes(item) ? prev.filter((value) => value !== item) : [...prev, item]
                          );
                        }}
                      />
                      <span>{item}</span>
                      <strong>{categoryCounts[item] ?? 0}</strong>
                    </label>
                  ))}
                </div>
              </div>

              <div className="ab-shop-filter-group">
                <div className="ab-shop-filter-title">Collection</div>
                <div className="ab-shop-filter-list">
                  {filters.collections.map((item) => (
                    <label key={item} className="ab-shop-checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedCollections.includes(item)}
                        onChange={() => {
                          setSelectedCollections((prev) =>
                            prev.includes(item) ? prev.filter((value) => value !== item) : [...prev, item]
                          );
                        }}
                      />
                      <span>{item}</span>
                      <strong>{item === 'Bestsellers' ? '24' : '14'}</strong>
                    </label>
                  ))}
                </div>
              </div>

              <div className="ab-shop-filter-group">
                <div className="ab-shop-filter-title">Price</div>
                <div style={{ display: 'grid', gap: 12, marginTop: 10 }}>
                  <input type="range" min="10" max="200" defaultValue="100" style={{ width: '100%' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280' }}>
                    <span>$10</span>
                    <span>$100</span>
                  </div>
                </div>
              </div>

              <div className="ab-shop-filter-group">
                <div className="ab-shop-filter-title">Material</div>
                <div className="ab-shop-filter-list">
                  {['Gold Plated', 'Stainless Steel', 'Brass', 'Alloy', 'Pearl'].map((item) => (
                    <button key={item} className="ab-shop-filter-button" type="button">
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="ab-shop-filter-group" style={{ paddingBottom: 0, marginBottom: 0, borderBottom: 'none' }}>
                <div className="ab-shop-filter-title">Color</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 10, marginTop: 10 }}>
                  {['#c59c6d', '#f8f5ee', '#d7cbb5', '#b39f7d', '#1f2937'].map((color) => (
                    <button
                      key={color}
                      className="ab-shop-filter-button"
                      type="button"
                      style={{ padding: 0, minHeight: 40, justifyContent: 'center', background: color, borderColor: 'rgba(0,0,0,0.08)' }}
                    />
                  ))}
                </div>
              </div>
            </aside>

            <section>
              <div className="ab-shop-toolbar">
                <div className="ab-shop-toolbar-left">
                  <span>Showing 1–{products.length} of {initialProducts.length} products</span>
                </div>
                <div className="ab-shop-sort">
                  <label htmlFor="sort" style={{ fontSize: 13, color: '#4b5563' }}>Sort by</label>
                  <select id="sort" value={sort} onChange={(event) => setSort(event.target.value)}>
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div className="ab-shop-mode-toggle">
                  <button type="button" className={gridMode === 'grid' ? 'active' : ''} onClick={() => setGridMode('grid')}>
                    ▢
                  </button>
                  <button type="button" className={gridMode === 'list' ? 'active' : ''} onClick={() => setGridMode('list')}>
                    ☰
                  </button>
                </div>
              </div>

              <div className={gridMode === 'grid' ? 'ab-shop-grid' : ''}>
                {products.map((product) => (
                  <article key={product.id} className="ab-shop-card" style={gridMode === 'list' ? { display: 'flex', gap: 20, alignItems: 'start' } : undefined}>
                    <div className="ab-shop-card-header" style={gridMode === 'list' ? { flex: '0 0 260px' } : undefined}>
                      <div className="ab-shop-card-image">
                        <Link href={`/product/${product.id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                          <img src={product.imageUrl} alt={product.name} loading="lazy" />
                        </Link>
                      </div>
                      <span className="ab-shop-card-status">NEW</span>
                    </div>
                    <div className="ab-shop-card-body" style={gridMode === 'list' ? { paddingTop: 0 } : undefined}>
                      <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h2 className="ab-shop-card-title">{product.name}</h2>
                      </Link>
                      <div className="ab-shop-card-meta">
                        <div className="ab-shop-card-price">
                          <strong>Rs {product.displayPrice.toFixed(2)}</strong>
                          {product.originalPrice && <span>Rs {product.originalPrice.toFixed(2)}</span>}
                        </div>
                        <div className="ab-shop-card-rating">
                          <StarRating rating={product.rating} />
                          <span>({product.reviews})</span>
                        </div>
                      </div>
                      <div className="ab-shop-bottom-traits">
                        <div className="ab-shop-trait">Free shipping</div>
                        <div className="ab-shop-trait">30-day returns</div>
                        <div className="ab-shop-trait">Quality guarantee</div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
