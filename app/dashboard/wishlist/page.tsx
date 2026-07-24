import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Heart, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const wishlistItems = [
  { id: '1', name: 'Gold Kundan Choker', price: 'NPR 4,500', inStock: true, image: '/product-necklace.png' },
  { id: '2', name: 'Pearl & Diamond Studs', price: 'NPR 2,800', inStock: true, image: '/product-earrings1.png' },
  { id: '3', name: 'Silver Charm Bracelet', price: 'NPR 1,950', inStock: false, image: '/product-bracelet.png' },
];

export default async function WishlistPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <div style={{ color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Link href="/dashboard" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>My Wishlist</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>Saved items for later</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {wishlistItems.map((item) => (
          <div key={item.id} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 12,
              background: 'rgba(212,175,55,0.1)', color: '#d4af37',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, flexShrink: 0
            }}>
              <Heart size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</h3>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#d4af37', margin: '2px 0' }}>{item.price}</p>
              <span style={{ fontSize: 11, color: item.inStock ? '#4ade80' : '#f87171' }}>
                {item.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 4 }}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
