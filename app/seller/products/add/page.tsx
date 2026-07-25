'use client';

import { useActionState, useState, useRef } from 'react';
import { createProductAction, CreateProductState } from '@/app/actions/product';
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
  Package,
  DollarSign,
  Sparkles,
  ArrowLeft,
  X,
  AlertCircle,
  RefreshCw,
  Tag,
} from 'lucide-react';

const lightCardStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 16,
  padding: '24px 28px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 700,
  color: '#1e293b',
  marginBottom: 6,
};

const subTextStyle: React.CSSProperties = {
  fontSize: 11,
  color: '#64748b',
  marginTop: 4,
};

const inputContainerStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #cbd5e1',
  borderRadius: 10,
  padding: '10px 14px',
  color: '#0f172a',
  fontSize: 13,
  outline: 'none',
  width: '100%',
  transition: 'border-color 0.2s',
};

const initialState: CreateProductState = {};

function compressImage(file: File, maxWidth = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(e.target?.result as string);

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

export default function AddNewProductPage() {
  const [state, formAction, isPending] = useActionState(createProductAction, initialState);
  const [shortDesc, setShortDesc] = useState('');
  const [status, setStatus] = useState('active');
  const [visibility, setVisibility] = useState('visible');
  const [featured, setFeatured] = useState(false);
  const [trackInventory, setTrackInventory] = useState(true);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_COUNT = 8; // Exactly 8 image slots matching Screenshot 1!
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);

    if (previews.length + fileList.length > MAX_COUNT) {
      setValidationError(`Maximum ${MAX_COUNT} images allowed per product. You have added ${previews.length}.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    for (const file of fileList) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setValidationError(`"${file.name}" is not a supported image format. Please select JPG, PNG, or WEBP.`);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        setValidationError(`"${file.name}" is ${sizeMb}MB. Maximum image size allowed is 5MB.`);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
    }

    setIsProcessingImages(true);
    try {
      const compressed: string[] = [];
      for (const file of fileList) {
        const dataUrl = await compressImage(file);
        if (dataUrl) compressed.push(dataUrl);
      }
      setPreviews((prev) => [...prev, ...compressed]);
    } catch (err) {
      console.error('Image compression error:', err);
      setValidationError('Failed to process image files. Please try another image.');
    } finally {
      setIsProcessingImages(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setValidationError(null);
    const updated = [...previews];
    updated.splice(index, 1);
    setPreviews(updated);
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '28px 32px 100px', color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Toast Notification for Success */}
      {state?.success && (
        <div style={{
          position: 'fixed', top: 80, right: 32, zIndex: 50,
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
          border: '1px solid #10b981',
          borderRadius: 14, padding: '14px 20px', color: '#ffffff',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        }}>
          <Check size={18} color="#34d399" />
          <span style={{ fontSize: 13, fontWeight: 700 }}>
            {state.message || 'Product published successfully!'}
          </span>
        </div>
      )}

      {/* Validation Error Banner (Client & Server) */}
      {(validationError || state?.error) && (
        <div style={{
          marginBottom: 20,
          padding: '14px 18px',
          borderRadius: 14,
          background: '#fef2f2',
          border: '1px solid #fca5a5',
          color: '#dc2626',
          fontSize: 13,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{validationError || state?.error}</span>
        </div>
      )}

      <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1320, margin: '0 auto' }}>
        
        {/* Header Breadcrumb */}
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: 0 }}>Add New Product</h1>
          <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
            Dashboard &gt; Products &gt; <strong style={{ color: '#0f172a' }}>Add New Product</strong>
          </p>
        </div>

        {/* ── Main Form Layout: 2 Columns (Screenshot 1) ────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24, alignItems: 'start' }}>
          
          {/* ── Left Main Column (Product Info & Details) ──────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, gridColumn: 'span 2' }}>
            
            {/* Card 1: Product Information */}
            <div style={lightCardStyle}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 20px' }}>Product Information</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                
                {/* Row 1: Product Name & SKU */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>
                      Product Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={state?.fields?.name ?? ''}
                      placeholder="Enter product name"
                      required
                      style={inputContainerStyle}
                    />
                    {state?.fieldErrors?.name && (
                      <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{state.fieldErrors.name[0]}</p>
                    )}
                  </div>
                  <div>
                    <label style={labelStyle}>
                      SKU <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="sku"
                      defaultValue={state?.fields?.sku ?? ''}
                      placeholder="Enter SKU"
                      style={inputContainerStyle}
                    />
                    <p style={subTextStyle}>Unique stock keeping unit</p>
                  </div>
                </div>

                {/* Row 2: Category & Collection */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>
                      Category <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      name="category"
                      defaultValue={state?.fields?.category ?? 'necklaces'}
                      required
                      style={{ ...inputContainerStyle, cursor: 'pointer' }}
                    >
                      <option value="">Select category</option>
                      <option value="necklaces">Necklaces &amp; Chokers</option>
                      <option value="earrings">Earrings &amp; Studs</option>
                      <option value="bracelets">Bracelets &amp; Bangles</option>
                      <option value="rings">Rings</option>
                      <option value="anklets">Anklets</option>
                      <option value="sets">Full Sets</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Collection</label>
                    <select
                      name="collection"
                      defaultValue=""
                      style={{ ...inputContainerStyle, cursor: 'pointer' }}
                    >
                      <option value="">Select collection</option>
                      <option value="summer">Summer Edit</option>
                      <option value="bridal">Bridal Collection</option>
                      <option value="bestsellers">Bestsellers</option>
                    </select>
                  </div>
                </div>

                {/* Row 3: Price & Compare at Price */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>
                      Price <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: 13, fontWeight: 600 }}>NPR</span>
                      <input
                        type="number"
                        step="0.01"
                        name="price"
                        defaultValue={state?.fields?.price ?? ''}
                        placeholder="0.00"
                        required
                        style={{ ...inputContainerStyle, paddingLeft: 46 }}
                      />
                    </div>
                    {state?.fieldErrors?.price && (
                      <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{state.fieldErrors.price[0]}</p>
                    )}
                  </div>
                  <div>
                    <label style={labelStyle}>Compare at Price</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: 13, fontWeight: 600 }}>NPR</span>
                      <input
                        type="number"
                        step="0.01"
                        name="salePrice"
                        placeholder="0.00"
                        style={{ ...inputContainerStyle, paddingLeft: 46 }}
                      />
                    </div>
                    <p style={subTextStyle}>Original price (for discounts)</p>
                  </div>
                </div>

                {/* Row 4: Short Description */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <label style={{ ...labelStyle, margin: 0 }}>
                      Short Description <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <span style={{ fontSize: 11, color: '#64748b' }}>{shortDesc.length}/160</span>
                  </div>
                  <textarea
                    rows={2}
                    maxLength={160}
                    name="shortDescription"
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    placeholder="Enter a short description about the product..."
                    style={{ ...inputContainerStyle, resize: 'vertical' }}
                  />
                </div>

                {/* Row 5: Description with Formatting Toolbar */}
                <div>
                  <label style={labelStyle}>
                    Description <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ border: '1px solid #cbd5e1', borderRadius: 10, overflow: 'hidden', background: '#ffffff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 12px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
                      {[Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, LinkIcon, ImageIcon].map((Icon, idx) => (
                        <button key={idx} type="button" style={{ background: 'none', border: 'none', color: '#475569', padding: 6, borderRadius: 6, cursor: 'pointer', display: 'flex' }}>
                          <Icon size={14} />
                        </button>
                      ))}
                    </div>
                    <textarea
                      rows={5}
                      name="fullDescription"
                      defaultValue={state?.fields?.fullDescription ?? ''}
                      placeholder="Write a detailed description about the product..."
                      style={{ ...inputContainerStyle, border: 'none', borderRadius: 0, resize: 'vertical' }}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Card 2: Product Details (Screenshot 1) */}
            <div style={lightCardStyle}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 20px' }}>Product Details</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Material</label>
                    <select name="material" style={{ ...inputContainerStyle, cursor: 'pointer' }}>
                      <option value="">Select material</option>
                      <option value="18k_gold">18K Gold Plated Stainless Steel</option>
                      <option value="silver">925 Sterling Silver</option>
                      <option value="pearl">Freshwater Pearl</option>
                      <option value="brass">Brass</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Color</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        name="color"
                        placeholder="Enter color (e.g. Gold, Silver)"
                        style={{ ...inputContainerStyle, paddingRight: 36 }}
                      />
                      <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, borderRadius: '50%', background: '#d4af37', border: '1px solid #cbd5e1' }} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Finish</label>
                    <select name="finish" style={{ ...inputContainerStyle, cursor: 'pointer' }}>
                      <option value="">Select finish</option>
                      <option value="polished">High Polish Gold</option>
                      <option value="matte">Matte Finish</option>
                      <option value="hammered">Hammered Texture</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Style</label>
                    <input
                      type="text"
                      name="style"
                      placeholder="Enter style (e.g. Minimal, Boho)"
                      style={inputContainerStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Tags</label>
                  <input
                    type="text"
                    name="tags"
                    placeholder="Enter tags and press Enter..."
                    style={inputContainerStyle}
                  />
                  <p style={subTextStyle}>Add relevant tags to help customers find your product</p>
                </div>
              </div>
            </div>

          </div>

          {/* ── Right Sidebar Column (Images, Status, Inventory) ───────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Right Card 1: Product Images (Screenshot 1) */}
            <div style={lightCardStyle}>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>Product Images</h2>

              {/* Hidden File Input */}
              <input
                type="file"
                name="images"
                multiple
                accept="image/jpeg,image/png,image/webp"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              {/* Hidden Compressed Base64 Image Inputs */}
              {previews.map((src, idx) => (
                <input key={idx} type="hidden" name="imageUrls" value={src} />
              ))}

              {/* Drag & Drop Upload Box */}
              <div
                onClick={() => {
                  if (previews.length < MAX_COUNT) fileInputRef.current?.click();
                }}
                style={{
                  border: '2px dashed #cbd5e1',
                  borderRadius: 12,
                  padding: '28px 16px',
                  textAlign: 'center',
                  background: '#f8fafc',
                  cursor: previews.length >= MAX_COUNT ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 16,
                  transition: 'all 0.2s',
                }}
              >
                <UploadCloud size={32} color="#64748b" />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Drag &amp; drop images here
                  </p>
                  <p style={{ fontSize: 12, color: '#0284c7', fontWeight: 600, margin: '2px 0 0' }}>
                    or click to browse
                  </p>
                </div>
                <p style={{ fontSize: 10, color: '#94a3b8', margin: '4px 0 0' }}>
                  Upload up to 8 images (PNG, JPG, WEBP)<br />Recommended size: 1200 x 1200px
                </p>
              </div>

              {/* 8 Image Slots Grid (Screenshot 1 Layout) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {Array.from({ length: 8 }).map((_, idx) => {
                  const previewSrc = previews[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        if (!previewSrc && previews.length < MAX_COUNT) fileInputRef.current?.click();
                      }}
                      style={{
                        aspectRatio: '1',
                        borderRadius: 10,
                        border: '1px dashed #cbd5e1',
                        background: previewSrc ? '#ffffff' : '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: previewSrc ? 'default' : 'pointer',
                      }}
                    >
                      {previewSrc ? (
                        <>
                          <img src={previewSrc} alt={`Slot ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(idx);
                            }}
                            style={{
                              position: 'absolute', top: 2, right: 2, width: 20, height: 20,
                              borderRadius: '50%', background: 'rgba(0,0,0,0.75)', color: '#fff',
                              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                          >
                            <X size={12} />
                          </button>
                        </>
                      ) : (
                        <ImageIcon size={18} color="#cbd5e1" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Card 2: Product Status (Screenshot 1) */}
            <div style={lightCardStyle}>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>Product Status</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={labelStyle}>
                    Status <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      name="statusSelect"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      style={{ ...inputContainerStyle, paddingLeft: 30, cursor: 'pointer' }}
                    >
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                    <div style={{
                      position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                      width: 8, height: 8, borderRadius: '50%',
                      background: status === 'active' ? '#22c55e' : status === 'draft' ? '#f59e0b' : '#94a3b8',
                    }} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>
                    Visibility <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    name="visibility"
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                    style={{ ...inputContainerStyle, cursor: 'pointer' }}
                  >
                    <option value="visible">Visible</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>
                  <div>
                    <label style={{ ...labelStyle, margin: 0 }}>Featured Product</label>
                    <p style={subTextStyle}>Show this product on homepage</p>
                  </div>
                  <input
                    type="checkbox"
                    name="featured"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: '#d4af37', cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>

            {/* Right Card 3: Inventory (Screenshot 1) */}
            <div style={lightCardStyle}>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>Inventory</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
                  <label style={{ ...labelStyle, margin: 0 }}>Track Inventory</label>
                  <input
                    type="checkbox"
                    checked={trackInventory}
                    onChange={(e) => setTrackInventory(e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: '#d4af37', cursor: 'pointer' }}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    Quantity <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    defaultValue="0"
                    placeholder="0"
                    required
                    style={inputContainerStyle}
                  />
                  {state?.fieldErrors?.stock && (
                    <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{state.fieldErrors.stock[0]}</p>
                  )}
                </div>

                <div>
                  <label style={labelStyle}>Low Stock Alert</label>
                  <input
                    type="number"
                    name="lowStockAlert"
                    defaultValue="5"
                    placeholder="5"
                    style={inputContainerStyle}
                  />
                  <p style={subTextStyle}>You'll be notified when stock is below this level</p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ── Fixed Bottom Action Bar (Screenshot 1) ────────────────────── */}
        <div style={{
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 32,
          borderRadius: 16,
          boxShadow: '0 -2px 10px rgba(0,0,0,0.03)',
        }}>
          <Link
            href="/seller/products"
            style={{
              padding: '10px 20px',
              borderRadius: 10,
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Cancel
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              type="submit"
              name="status"
              value="draft"
              disabled={isPending}
              style={{
                padding: '10px 24px',
                borderRadius: 10,
                border: '1.5px solid #d4af37',
                background: '#ffffff',
                color: '#a07c2e',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Save as Draft
            </button>

            <button
              type="submit"
              name="status"
              value="active"
              disabled={isPending}
              style={{
                padding: '10px 28px',
                borderRadius: 10,
                border: 'none',
                background: 'linear-gradient(135deg, #d4af37 0%, #a07c2e 100%)',
                color: '#ffffff',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(212,175,55,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {isPending ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <span>Publish Product</span>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
