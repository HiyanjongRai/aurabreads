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
  Package,
  DollarSign,
  Tag,
  Sparkles,
  Layers,
  HelpCircle,
  Eye,
  ArrowLeft,
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
    <div style={{ padding: '32px', maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24, color: '#ffffff' }}>
      
      {/* Toast Notification */}
      {savedStatus && (
        <div style={{
          position: 'fixed', top: 80, right: 32, zIndex: 50,
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
          border: '1px solid #10b981',
          borderRadius: 14, padding: '14px 20px', color: '#ffffff',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        }}>
          <Check size={18} color="#34d399" />
          <span style={{ fontSize: 13, fontWeight: 700 }}>{savedStatus}</span>
        </div>
      )}

      {/* Header & Breadcrumb */}
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
            type="button"
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
            type="button"
            onClick={handlePublish}
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
            }}
          >
            <Sparkles size={16} />
            <span>Publish Product</span>
          </button>
        </div>
      </div>

      <form onSubmit={handlePublish} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        
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
                  placeholder="e.g. Royal Kundan Gold Choker Necklace Set"
                  required
                  style={inputContainerStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>SKU / Code</label>
                  <input
                    type="text"
                    placeholder="e.g. NCK-001"
                    style={{ ...inputContainerStyle, fontFamily: 'monospace' }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select style={{ ...inputContainerStyle, cursor: 'pointer', background: '#1c1c2b' }}>
                    <option value="">Select Category</option>
                    <option value="necklaces">Necklaces & Chokers</option>
                    <option value="earrings">Earrings & Studs</option>
                    <option value="bracelets">Bracelets & Bangles</option>
                    <option value="rings">Rings</option>
                    <option value="anklets">Anklets</option>
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <div>
                <label style={labelStyle}>Regular Price (NPR)</label>
                <input type="number" placeholder="e.g. 3500" style={inputContainerStyle} />
              </div>
              <div>
                <label style={labelStyle}>Sale Price (NPR)</label>
                <input type="number" placeholder="e.g. 2800" style={inputContainerStyle} />
              </div>
              <div>
                <label style={labelStyle}>Stock Quantity</label>
                <input type="number" placeholder="e.g. 25" defaultValue={10} style={inputContainerStyle} />
              </div>
            </div>
          </div>

          {/* Card 3: Images */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 20 }}>
              <ImageIcon size={18} color="#d4af37" />
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', margin: 0 }}>Product Images</h2>
            </div>

            {/* Dropzone */}
            <div style={{
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
            }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(212,175,55,0.12)', color: '#d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UploadCloud size={24} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', margin: 0 }}>
                  Click to upload or drag & drop images
                </p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                  SVG, PNG, JPG or WEBP (Max 5MB per file)
                </p>
              </div>
            </div>
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
                <label style={labelStyle}>Status</label>
                <select style={{ ...inputContainerStyle, background: '#1c1c2b', cursor: 'pointer' }}>
                  <option value="active">Active (Published)</option>
                  <option value="draft">Draft (Hidden)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>Featured Product</span>
                <input
                  type="checkbox"
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
                <select style={{ ...inputContainerStyle, background: '#1c1c2b' }}>
                  <option>Gold Plated</option>
                  <option>Solid Gold</option>
                  <option>Sterling Silver</option>
                  <option>Brass / Alloy</option>
                  <option>Beaded</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Color / Finish</label>
                <input type="text" placeholder="e.g. Yellow Gold / Antique" style={inputContainerStyle} />
              </div>

              <div>
                <label style={labelStyle}>Style / Collection</label>
                <input type="text" placeholder="e.g. Traditional Bridal" style={inputContainerStyle} />
              </div>
            </div>
          </div>

        </div>

      </form>
    </div>
  );
}
