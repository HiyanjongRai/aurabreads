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
  Eye,
  Star,
  Tag,
} from 'lucide-react';

const cardStyle: React.CSSProperties = {
  background: '#161622',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 20,
  padding: '24px 28px',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: 'rgba(255,255,255,0.6)',
  marginBottom: 8,
};

const inputContainerStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 12,
  padding: '11px 14px',
  color: '#ffffff',
  fontSize: 14,
  outline: 'none',
  width: '100%',
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
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('necklaces');
  const [shortDesc, setShortDesc] = useState('');
  const [price, setPrice] = useState<string>('');
  const [salePrice, setSalePrice] = useState<string>('');
  const [stock, setStock] = useState<string>('10');
  const [featured, setFeatured] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_COUNT = 6;
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  const numPrice = parseFloat(price) || 0;
  const numSalePrice = parseFloat(salePrice) || 0;
  const discountPercent =
    numPrice > 0 && numSalePrice > 0 && numSalePrice < numPrice
      ? Math.round(((numPrice - numSalePrice) / numPrice) * 100)
      : 0;

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
        setValidationError(`"${file.name}" is not a supported format. Please select JPG, PNG, or WEBP.`);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        setValidationError(`"${file.name}" is ${sizeMb}MB. Maximum allowed image size is 5MB.`);
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
    <div style={{ padding: '32px', maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24, color: '#ffffff', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Toast Notification for Success */}
      {state?.success && (
        <div style={{
          position: 'fixed', top: 80, right: 32, zIndex: 50,
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
          border: '1px solid #10b981',
          borderRadius: 14, padding: '14px 20px', color: '#ffffff',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
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
          padding: '14px 18px',
          borderRadius: 14,
          background: 'rgba(239,68,68,0.12)',
          border: '1px solid rgba(239,68,68,0.3)',
          color: '#f87171',
          fontSize: 13,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{validationError || state?.error}</span>
        </div>
      )}

      {/* Form Action */}
      <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Link href="/seller" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <ArrowLeft size={16} />
              </Link>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: '#d4af37', textTransform: 'uppercase' }}>
                SELLER CATALOG
              </span>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
              Add New Product
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              type="submit"
              name="status"
              value="draft"
              disabled={isPending}
              style={{
                padding: '10px 20px',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.7)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Save Draft
            </button>

            <button
              type="submit"
              name="status"
              value="active"
              disabled={isPending}
              style={{
                padding: '10px 24px',
                borderRadius: 12,
                border: 'none',
                background: 'linear-gradient(135deg, #d4af37, #a07c2e)',
                color: '#000000',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 4px 14px rgba(212,175,55,0.3)',
                opacity: isPending ? 0.7 : 1,
              }}
            >
              {isPending ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Uploading & Publishing...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Publish Product</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Main Form Grid ────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          
          {/* ── Left Column (Form Inputs) ─────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, gridColumn: 'span 2' }}>
            
            {/* Card 1: Product Information */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 20 }}>
                <Package size={18} color="#d4af37" />
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', margin: 0 }}>Product Details</h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <label style={labelStyle}>
                    Product Name <span style={{ color: '#f87171' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Royal Kundan Gold Choker Necklace Set"
                    required
                    style={inputContainerStyle}
                  />
                  {state?.fieldErrors?.name && (
                    <p style={{ fontSize: 11, color: '#f87171', marginTop: 4 }}>{state.fieldErrors.name[0]}</p>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>SKU / Item Code</label>
                    <input
                      type="text"
                      name="sku"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="e.g. NCK-001"
                      style={{ ...inputContainerStyle, fontFamily: 'monospace' }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Category <span style={{ color: '#f87171' }}>*</span></label>
                    <select
                      name="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                      style={{ ...inputContainerStyle, cursor: 'pointer', background: '#1c1c2b' }}
                    >
                      <option value="necklaces">Necklaces & Chokers</option>
                      <option value="earrings">Earrings & Studs</option>
                      <option value="bracelets">Bracelets & Bangles</option>
                      <option value="rings">Rings</option>
                      <option value="anklets">Anklets</option>
                      <option value="sets">Full Sets</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <label style={{ ...labelStyle, margin: 0 }}>Short Description</label>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{shortDesc.length}/160</span>
                  </div>
                  <textarea
                    rows={2}
                    maxLength={160}
                    name="shortDescription"
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    placeholder="Brief 1-2 sentence summary for search cards and listings…"
                    style={{ ...inputContainerStyle, resize: 'vertical' }}
                  />
                </div>

                {/* Rich Text Description */}
                <div>
                  <label style={labelStyle}>Full Description & Care Instructions</label>
                  <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap' }}>
                      {[Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, LinkIcon].map((Icon, idx) => (
                        <button key={idx} type="button" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', padding: 6, borderRadius: 6, cursor: 'pointer', display: 'flex' }}>
                          <Icon size={14} />
                        </button>
                      ))}
                    </div>
                    <textarea
                      rows={4}
                      name="fullDescription"
                      defaultValue={state?.fields?.fullDescription ?? ''}
                      placeholder="Provide detailed description, specifications, weight, dimensions, and care guidelines…"
                      style={{ ...inputContainerStyle, border: 'none', background: 'transparent', borderRadius: 0, resize: 'vertical' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Pricing & Inventory */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <DollarSign size={18} color="#d4af37" />
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', margin: 0 }}>Pricing & Inventory</h2>
                </div>
                {discountPercent > 0 && (
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#4ade80', background: 'rgba(34,197,94,0.14)', padding: '3px 10px', borderRadius: 99 }}>
                    Save {discountPercent}% OFF
                  </span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Regular Price (NPR) <span style={{ color: '#f87171' }}>*</span></label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 3500"
                    required
                    style={inputContainerStyle}
                  />
                  {state?.fieldErrors?.price && (
                    <p style={{ fontSize: 11, color: '#f87171', marginTop: 4 }}>{state.fieldErrors.price[0]}</p>
                  )}
                </div>
                <div>
                  <label style={labelStyle}>Sale Price (NPR)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="salePrice"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="e.g. 2800"
                    style={inputContainerStyle}
                  />
                  {state?.fieldErrors?.salePrice && (
                    <p style={{ fontSize: 11, color: '#f87171', marginTop: 4 }}>{state.fieldErrors.salePrice[0]}</p>
                  )}
                </div>
                <div>
                  <label style={labelStyle}>Stock Quantity <span style={{ color: '#f87171' }}>*</span></label>
                  <input
                    type="number"
                    name="stock"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="e.g. 25"
                    required
                    style={inputContainerStyle}
                  />
                  {state?.fieldErrors?.stock && (
                    <p style={{ fontSize: 11, color: '#f87171', marginTop: 4 }}>{state.fieldErrors.stock[0]}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Card 3: Images & Cloudinary Upload */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <ImageIcon size={18} color="#d4af37" />
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', margin: 0 }}>Product Images</h2>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: previews.length >= MAX_COUNT ? '#f87171' : 'rgba(255,255,255,0.4)' }}>
                  {previews.length}/{MAX_COUNT} Uploaded
                </span>
              </div>

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

              {/* Dropzone */}
              <div
                onClick={() => {
                  if (previews.length < MAX_COUNT) fileInputRef.current?.click();
                }}
                style={{
                  border: `2px dashed ${previews.length >= MAX_COUNT ? 'rgba(239,68,68,0.3)' : 'rgba(212,175,55,0.35)'}`,
                  borderRadius: 16,
                  padding: '32px 20px',
                  textAlign: 'center',
                  background: 'rgba(212,175,55,0.03)',
                  cursor: previews.length >= MAX_COUNT ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(212,175,55,0.12)', color: '#d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isProcessingImages ? <RefreshCw size={20} className="animate-spin" /> : <UploadCloud size={22} />}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', margin: 0 }}>
                    {previews.length >= MAX_COUNT ? 'Maximum 6 images reached' : 'Click or drop files to upload product images'}
                  </p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                    Supported: JPG, PNG, WEBP · Max 5MB per image · Max 15MB total
                  </p>
                </div>
              </div>

              {/* Image Preview Grid */}
              {previews.length > 0 && (
                <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 12 }}>
                  {previews.map((src, index) => (
                    <div key={index} style={{ position: 'relative', width: 90, height: 90, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(212,175,55,0.4)', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                      <img src={src} alt={`Preview ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        style={{
                          position: 'absolute', top: 4, right: 4, width: 22, height: 22,
                          borderRadius: 99, background: 'rgba(0,0,0,0.85)', color: '#fff',
                          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                      >
                        <X size={12} />
                      </button>
                      {index === 0 && (
                        <span style={{ position: 'absolute', bottom: 2, left: 2, right: 2, background: 'rgba(212,175,55,0.9)', color: '#000', fontSize: 9, fontWeight: 800, textAlign: 'center', borderRadius: 4, padding: '1px 0' }}>
                          COVER
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* ── Right Column: Live Storefront Card Preview ──────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Eye size={16} color="#d4af37" />
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', margin: 0 }}>Live Storefront Preview</h3>
              </div>

              {/* Product Card Replica */}
              <div style={{
                background: '#ffffff',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                color: '#1a1a1a',
              }}>
                <div style={{ position: 'relative', height: 200, background: '#fbf9f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {previews[0] ? (
                    <img src={previews[0]} alt="Card Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                      <ImageIcon size={32} style={{ margin: '0 auto 6px' }} />
                      <span style={{ fontSize: 11 }}>Upload image to preview</span>
                    </div>
                  )}

                  {discountPercent > 0 && (
                    <span style={{ position: 'absolute', top: 10, left: 10, background: '#d97706', color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 99 }}>
                      -{discountPercent}% OFF
                    </span>
                  )}
                </div>

                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c9a84c' }}>
                    {category}
                  </span>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {name || 'Your Product Title'}
                  </h4>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                    {numSalePrice > 0 && numSalePrice < numPrice ? (
                      <>
                        <span style={{ fontSize: 15, fontWeight: 800, color: '#d97706' }}>
                          NPR {numSalePrice.toLocaleString()}
                        </span>
                        <span style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'line-through' }}>
                          NPR {numPrice.toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span style={{ fontSize: 15, fontWeight: 800, color: '#111827' }}>
                        NPR {numPrice > 0 ? numPrice.toLocaleString() : '0.00'}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f59e0b', fontSize: 12, marginTop: 4 }}>
                    <Star size={12} fill="#f59e0b" />
                    <span style={{ fontWeight: 700, color: '#374151', fontSize: 11 }}>4.9 (New)</span>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 14, textAlign: 'center', margin: '14px 0 0' }}>
                This is how your item card will display to shoppers on the homepage.
              </p>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
