import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');

  if (secret !== 'aurabeads332') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const db = getDb();
    
    // Check if delete parameter was passed
    const action = searchParams.get('action');
    if (action === 'delete-all') {
      const deleted = await db.product.deleteMany({});
      return NextResponse.json({
        message: 'Deleted all old test products!',
        count: deleted.count,
      });
    }

    const products = await db.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      total: products.length,
      products,
      tip: 'To delete old test products created before image fix, visit: /api/clean-products?action=delete-all&secret=aurabeads332',
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
