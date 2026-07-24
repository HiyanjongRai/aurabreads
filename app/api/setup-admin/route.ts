import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

/**
 * ONE-TIME setup endpoint — sets a user's role in the DB.
 * REMOVE this file after use!
 * Usage: GET /api/setup-admin?email=you@example.com&secret=aurabeads332
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const secret = searchParams.get('secret');
  const role = (searchParams.get('role') ?? 'ADMIN').toUpperCase() as 'ADMIN' | 'SELLER' | 'CUSTOMER';

  // Basic protection
  if (secret !== 'aurabeads332') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!email) {
    return NextResponse.json({ error: 'email param required' }, { status: 400 });
  }

  if (!['ADMIN', 'SELLER', 'CUSTOMER'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  try {
    const db = getDb();

    // List all users first
    const allUsers = await db.user.findMany({
      select: { id: true, email: true, role: true, name: true },
      orderBy: { createdAt: 'asc' },
    });

    // Update the target user
    const updated = await db.user.updateMany({
      where: { email },
      data: { role },
    });

    return NextResponse.json({
      success: true,
      updatedCount: updated.count,
      targetEmail: email,
      newRole: role,
      allUsers,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
