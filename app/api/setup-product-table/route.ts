// Create the Product table in Supabase via SQL API
// Run this once: GET /api/setup-product-table

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://twyrkcgwpiyeftrdlumi.supabase.co';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';

const CREATE_SQL = `
-- Ensure UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create Product table
CREATE TABLE IF NOT EXISTS "Product" (
  id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "sellerId"       TEXT NOT NULL,
  name             TEXT NOT NULL,
  sku              TEXT,
  category         TEXT NOT NULL DEFAULT 'uncategorized',
  "shortDescription" TEXT,
  "fullDescription"  TEXT,
  price            DOUBLE PRECISION NOT NULL DEFAULT 0,
  "salePrice"      DOUBLE PRECISION,
  stock            INTEGER NOT NULL DEFAULT 0,
  images           TEXT[] DEFAULT '{}',
  status           TEXT NOT NULL DEFAULT 'active',
  featured         BOOLEAN NOT NULL DEFAULT FALSE,
  material         TEXT,
  color            TEXT,
  style            TEXT,
  "createdAt"      TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index on sellerId for fast per-seller queries
CREATE INDEX IF NOT EXISTS idx_product_seller ON "Product"("sellerId");
CREATE INDEX IF NOT EXISTS idx_product_category ON "Product"(category);
CREATE INDEX IF NOT EXISTS idx_product_status ON "Product"(status);
`;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');

  if (secret !== 'aurabeads332') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    // Use the Supabase SQL API via service role key
    const response = await fetch(`${url}/rest/v1/rpc/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({ query: CREATE_SQL }),
    });

    // Try via SQL management API
    const sqlResponse = await fetch(`${url}/pg/v0/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey,
      },
      body: JSON.stringify({ query: CREATE_SQL }),
    });

    const sqlText = await sqlResponse.text();
    console.log('[SETUP TABLE SQL RESPONSE]', sqlResponse.status, sqlText.slice(0, 200));

    return NextResponse.json({
      status: 'attempted',
      sqlStatus: sqlResponse.status,
      message: 'Product table creation attempted. Check Supabase SQL editor if issues persist.',
      sql: CREATE_SQL,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg, sql: CREATE_SQL }, { status: 500 });
  }
}
