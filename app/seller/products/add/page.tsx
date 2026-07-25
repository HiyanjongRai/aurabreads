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
  const [shortDesc, setShortDesc] = useState('');
  const [featured, setFeatured] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingImages(true);
    try {
      const compressed: string[] = [];
      for (const file of Array.from(files)) {
        if (file.type.startsWith('image/')) {
          const dataUrl = await compressImage(file);
          if (dataUrl) compressed.push(dataUrl);
        }
      }
      setPreviews((prev) => [...prev, ...compressed]);
    } catch (err) {
      console.error('Image compression error:', err);
    } finally {
      setIsProcessingImages(false);
    }
  };

  const removeImage = (index: number) => {
    const updated = [...previews];
    updated.splice(index, 1);
    setPreviews(updated);
  };

  return (
    <div style={{ padding: '32px', maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24, color: '#ffffff' }}>
      
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
            {state.message || 'Product published to Supabase & Cloudinary!'}
          </span>
        </div>
      )}

      {/* Error Banner */}
      {state?.error && (
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
          <span>{state.error}</span>
        </div>
      )}

      {/* Header & Breadcrumb */}
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
                  <span>Uploading to Cloudinary & Saving...</span>
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          
          {/* ── Left Column (Main Information) ─────────────────────────────── */}
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
                    defaultValue={state?.fields?.name ?? ''}
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
                      defaultValue={state?.fields?.sku ?? ''}
                      placeholder="e.g. NCK-001"
                      style={{ ...inputContainerStyle, fontFamily: 'monospace' }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Category <span style={{ color: '#f87171' }}>*</span></label>
                    <select
                      name="category"
                      defaultValue={state?.fields?.category ?? 'necklaces'}
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
                    placeholder="Brief 1-2 sentence summary for search and cards…"
                    style={{ ...inputContainerStyle, resize: 'vertical' }}
                  />
                </div>

                {/* Rich Text Editor */}
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
                      rows={5}
                      name="fullDescription"
                      defaultValue={state?.fields?.fullDescription ?? ''}
                      placeholder="Provide full description, specifications, dimensions, and care instructions…"
                      style={{ ...inputContainerStyle, border: 'none', background: 'transparent', borderRadius: 0, resize: 'vertical' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Pricing & Inventory */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 20 }}>
                <DollarSign size={18} color="#d4af37" />
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', margin: 0 }}>Pricing & Inventory</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Regular Price (NPR) <span style={{ color: '#f87171' }}>*</span></label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    defaultValue={state?.fields?.price ?? ''}
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
                    placeholder="e.g. 2800"
                    style={inputContainerStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Stock Quantity <span style={{ color: '#f87171' }}>*</span></label>
                  <input
                    type="number"
                    name="stock"
                    defaultValue={state?.fields?.stock ?? '10'}
                    placeholder="e.g. 25"
                    required
                    style={inputContainerStyle}
                  />
                </div>
              </div>
            </div>

            {/* Card 3: Images & Cloudinary Upload */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 20 }}>
                <ImageIcon size={18} color="#d4af37" />
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', margin: 0 }}>Product Images (Cloudinary CDN)</h2>
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                name="images"
                multiple
                accept="image/*"
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
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed rgba(212,175,55,0.3)',
                  borderRadius: 16,
                  padding: '36px 20px',
                  textAlign: 'center',
                  background: 'rgba(212,175,55,0.03)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(212,175,55,0.12)', color: '#d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UploadCloud size={24} />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', margin: 0 }}>
                    Click to select images to upload to Cloudinary
                  </p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                    PNG, JPG, WEBP up to 5MB (Cloud Key: 979236259656447)
                  </p>
                </div>
              </div>

              {/* Image Preview Grid */}
              {previews.length > 0 && (
                <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 12 }}>
                  {previews.map((src, index) => (
                    <div key={index} style={{ position: 'relative', width: 100, height: 100, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(212,175,55,0.4)' }}>
                      <img src={src} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        style={{
                          position: 'absolute', top: 4, right: 4, width: 22, height: 22,
                          borderRadius: 99, background: 'rgba(0,0,0,0.8)', color: '#fff',
                          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* ── Right Column (Sidebar Settings) ───────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* Status Card */}
            <div style={cardStyle}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Publish Status
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Visibility Status</label>
                  <select name="statusSelect" style={{ ...inputContainerStyle, background: '#1c1c2b', cursor: 'pointer' }}>
                    <option value="active">Active (Published)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>Featured Item</span>
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

            {/* Specifications Card */}
            <div style={cardStyle}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Jewelry Specifications
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={labelStyle}>Material</label>
                  <select name="material" style={{ ...inputContainerStyle, background: '#1c1c2b' }}>
                    <option value="Gold Plated">Gold Plated</option>
                    <option value="Solid Gold">Solid Gold</option>
                    <option value="Sterling Silver">Sterling Silver</option>
                    <option value="Brass / Alloy">Brass / Alloy</option>
                    <option value="Beaded">Beaded / Crystal</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Color / Finish</label>
                  <input type="text" name="color" placeholder="e.g. Yellow Gold / Antique" style={inputContainerStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Style / Collection</label>
                  <input type="text" name="style" placeholder="e.g. Traditional Bridal" style={inputContainerStyle} />
                </div>
              </div>
            </div>

          </div>

        </div>

      </form>
    </div>
  );
}
