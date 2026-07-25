import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const folder = searchParams.get('folder') || 'aurabeads_products';

  const apiKey = process.env.CLOUDINARY_API_KEY || '115994652678237';
  const apiSecret = process.env.CLOUDINARY_API_SECRET || 'l-LNv-xFzvEHUpIeTR7wLL_8lEs';
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'x7qchau7';

  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

  return NextResponse.json({
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder,
  });
}
