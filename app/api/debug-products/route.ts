// Debug route to inspect products in the DB
// Visit: GET /api/debug-products
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://twyrkcgwpiyeftrdlumi.supabase.co';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';

  // Use service role to bypass RLS
  const supabase = createClient(url, serviceKey || anonKey, {
    auth: { persistSession: false },
  });

  const { data, error } = await supabase
    .from('Product')
    .select('id, name, status, images, price, createdAt')
    .order('createdAt', { ascending: false })
    .limit(20);

  const { data: allStatuses } = await supabase
    .from('Product')
    .select('status')
    .limit(50);

  return NextResponse.json({
    totalFound: data?.length ?? 0,
    error: error?.message ?? null,
    statusSummary: allStatuses?.reduce((acc: Record<string, number>, p: { status: string }) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {}),
    products: data?.map(p => ({
      id: p.id,
      name: p.name,
      status: p.status,
      price: p.price,
      imageCount: p.images?.length ?? 0,
      firstImagePreview: p.images?.[0]?.substring(0, 80) ?? null,
      isCloudinaryImage: p.images?.[0]?.startsWith('https://res.cloudinary.com') ?? false,
    })) ?? [],
  });
}
