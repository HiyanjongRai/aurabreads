'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  UploadCloud,
  Image as ImageIcon,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Check,
} from 'lucide-react';

export default function AddNewProductPage() {
  const [shortDesc, setShortDesc] = useState('');
  const [featured, setFeatured] = useState(false);
  const [trackInventory, setTrackInventory] = useState(true);
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedStatus('Product Published Successfully!');
    setTimeout(() => setSavedStatus(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Notification */}
      {savedStatus && (
        <div className="fixed top-24 right-8 z-50 flex items-center gap-3 rounded-2xl bg-emerald-900 px-6 py-4 text-white shadow-2xl animate-slide-left">
          <Check size={20} className="text-emerald-400" />
          <span className="text-sm font-semibold">{savedStatus}</span>
        </div>
      )}

      {/* Header & Breadcrumb */}
      <div>
        <h1 className="font-serif text-3xl font-light text-slate-900">Add New Product</h1>
        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
          <Link href="/seller" className="hover:text-slate-900 transition">Dashboard</Link>
          <span>›</span>
          <Link href="/seller/products" className="hover:text-slate-900 transition">Products</Link>
          <span>›</span>
          <span className="text-slate-900 font-medium">Add New Product</span>
        </div>
      </div>

      <form onSubmit={handlePublish} className="grid gap-8 lg:grid-cols-12">
        {/* ─── Left Main Column ───────────────────────────────────────────── */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Product Information */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
            <h2 className="font-sans text-lg font-semibold text-slate-900 border-b border-slate-100 pb-4">
              Product Information
            </h2>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Product Name <span className="text-amber-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter product name"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  SKU <span className="text-amber-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter SKU"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-200"
                />
                <p className="text-[11px] text-slate-400">Unique stock keeping unit</p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Category <span className="text-amber-600">*</span>
                </label>
                <select
                  required
                  defaultValue=""
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm text-slate-800 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-200"
                >
                  <option value="" disabled>Select category</option>
                  <option value="earrings">Earrings</option>
                  <option value="necklaces">Necklaces</option>
                  <option value="bracelets">Bracelets</option>
                  <option value="rings">Rings</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Collection
                </label>
                <select
                  defaultValue=""
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm text-slate-800 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-200"
                >
                  <option value="" disabled>Select collection</option>
                  <option value="summer">Summer Edit</option>
                  <option value="bridal">Bridal Collection</option>
                  <option value="gift">Gift Sets</option>
                  <option value="timeless">Timeless Elegance</option>
                </select>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Price <span className="text-amber-600">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-sm text-slate-400 font-semibold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-8 pr-4 text-sm outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Compare at Price
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-sm text-slate-400 font-semibold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-8 pr-4 text-sm outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-200"
                  />
                </div>
                <p className="text-[11px] text-slate-400">Original price (for discounts)</p>
              </div>
            </div>

            {/* Short Description */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Short Description <span className="text-amber-600">*</span>
                </label>
                <span className="text-xs text-slate-400">{shortDesc.length}/160</span>
              </div>
              <textarea
                required
                maxLength={160}
                rows={3}
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="Enter a short description about the product..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-sm outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-200"
              />
            </div>

            {/* Detailed Description Rich Text Editor */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Description <span className="text-amber-600">*</span>
              </label>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                {/* Formatting Toolbar */}
                <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 px-3 py-2 text-slate-600">
                  <button type="button" className="p-1.5 rounded hover:bg-slate-200" title="Bold"><Bold size={16} /></button>
                  <button type="button" className="p-1.5 rounded hover:bg-slate-200" title="Italic"><Italic size={16} /></button>
                  <button type="button" className="p-1.5 rounded hover:bg-slate-200" title="Underline"><Underline size={16} /></button>
                  <div className="h-4 w-px bg-slate-300 mx-1" />
                  <button type="button" className="p-1.5 rounded hover:bg-slate-200" title="Bullet List"><List size={16} /></button>
                  <button type="button" className="p-1.5 rounded hover:bg-slate-200" title="Numbered List"><ListOrdered size={16} /></button>
                  <div className="h-4 w-px bg-slate-300 mx-1" />
                  <button type="button" className="p-1.5 rounded hover:bg-slate-200" title="Align Left"><AlignLeft size={16} /></button>
                  <button type="button" className="p-1.5 rounded hover:bg-slate-200" title="Align Center"><AlignCenter size={16} /></button>
                  <button type="button" className="p-1.5 rounded hover:bg-slate-200" title="Align Right"><AlignRight size={16} /></button>
                  <div className="h-4 w-px bg-slate-300 mx-1" />
                  <button type="button" className="p-1.5 rounded hover:bg-slate-200" title="Insert Link"><LinkIcon size={16} /></button>
                  <button type="button" className="p-1.5 rounded hover:bg-slate-200" title="Insert Image"><ImageIcon size={16} /></button>
                </div>
                <textarea
                  required
                  rows={6}
                  placeholder="Write a detailed description about the product..."
                  className="w-full bg-white p-4 text-sm outline-none"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Product Details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
            <h2 className="font-sans text-lg font-semibold text-slate-900 border-b border-slate-100 pb-4">
              Product Details
            </h2>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Material</label>
                <select
                  defaultValue=""
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm text-slate-800 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-200"
                >
                  <option value="" disabled>Select material</option>
                  <option value="gold-18k">18k Gold Plated</option>
                  <option value="silver-925">925 Sterling Silver</option>
                  <option value="brass">Hypoallergenic Brass</option>
                  <option value="pearl">Freshwater Pearl</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Color</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Enter color (e.g. Gold, Silver)"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-4 pr-10 text-sm outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-200"
                  />
                  <div className="absolute right-3 h-5 w-5 rounded-full border border-slate-300 bg-[#d4af37]" />
                </div>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Finish</label>
                <select
                  defaultValue=""
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm text-slate-800 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-200"
                >
                  <option value="" disabled>Select finish</option>
                  <option value="polished">High Polish</option>
                  <option value="matte">Matte / Brushed</option>
                  <option value="textured">Hammered Texture</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Style</label>
                <input
                  type="text"
                  placeholder="Enter style (e.g. Minimal, Boho)"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Tags</label>
              <input
                type="text"
                placeholder="Enter tags and press Enter..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-200"
              />
              <p className="text-[11px] text-slate-400">Add relevant tags to help customers find your product</p>
            </div>
          </div>
        </div>

        {/* ─── Right Sidebar Column ────────────────────────────────────────── */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card: Product Images */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="font-sans text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
              Product Images
            </h2>

            {/* Dropzone */}
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 text-center transition hover:border-amber-500 hover:bg-amber-50/20 cursor-pointer group">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 group-hover:bg-amber-100 group-hover:text-amber-700 transition">
                <UploadCloud size={24} />
              </div>
              <p className="mt-3 text-xs font-semibold text-slate-800">
                Drag & drop images here
              </p>
              <p className="text-xs text-amber-700 font-medium">or click to browse</p>
              <p className="mt-2 text-[10px] text-slate-400">
                Upload up to 8 images (PNG, JPG, WEBP)<br />
                Recommended size: 1200 x 1200px
              </p>
            </div>

            {/* Thumbnail Placeholders Grid (8 slots) */}
            <div className="grid grid-cols-4 gap-2 pt-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((slot) => (
                <div
                  key={slot}
                  className="flex aspect-square items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-300 hover:border-amber-400 hover:text-amber-500 transition cursor-pointer"
                >
                  <ImageIcon size={18} />
                </div>
              ))}
            </div>
          </div>

          {/* Card: Product Status */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="font-sans text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
              Product Status
            </h2>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Status <span className="text-amber-600">*</span>
              </label>
              <select
                defaultValue="active"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-xs text-slate-800 font-semibold outline-none focus:border-amber-500 focus:bg-white"
              >
                <option value="active">🟢 Active</option>
                <option value="draft">🟡 Draft</option>
                <option value="archived">🔴 Archived</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Visibility <span className="text-amber-600">*</span>
              </label>
              <select
                defaultValue="visible"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-xs text-slate-800 font-semibold outline-none focus:border-amber-500 focus:bg-white"
              >
                <option value="visible">Visible</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>

            {/* Toggle Switch: Featured Product */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <span className="block text-xs font-semibold text-slate-800">Featured Product</span>
                <span className="block text-[11px] text-slate-400">Show this product on homepage</span>
              </div>
              <button
                type="button"
                onClick={() => setFeatured(!featured)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  featured ? 'bg-[#c9a84c]' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    featured ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Card: Inventory */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="font-sans text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
              Inventory
            </h2>

            {/* Toggle Switch: Track Inventory */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800">Track Inventory</span>
              <button
                type="button"
                onClick={() => setTrackInventory(!trackInventory)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  trackInventory ? 'bg-[#c9a84c]' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    trackInventory ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {trackInventory && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Quantity <span className="text-amber-600">*</span>
                  </label>
                  <input
                    type="number"
                    defaultValue="0"
                    required
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-xs text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Low Stock Alert
                  </label>
                  <input
                    type="number"
                    defaultValue="5"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-xs text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                  />
                  <p className="text-[11px] text-slate-400">You&apos;ll be notified when stock is below this level</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ─── Bottom Actions Bar ─────────────────────────────────────────── */}
        <div className="lg:col-span-12 flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <Link
            href="/seller/products"
            className="w-full sm:w-auto text-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:border-slate-400"
          >
            Cancel
          </Link>
          <button
            type="button"
            className="w-full sm:w-auto rounded-xl border-2 border-[#c9a84c] px-6 py-3 text-xs font-bold text-[#a07c2e] transition hover:bg-[#c9a84c]/10"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#a07c2e] px-8 py-3 text-xs font-bold text-black shadow-lg transition hover:shadow-xl hover:from-[#d4af37] hover:to-[#b08c3e] cursor-pointer"
          >
            Publish Product
          </button>
        </div>
      </form>
    </div>
  );
}
