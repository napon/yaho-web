// src/app/api/files/view/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { bucket } from '@/lib/gcs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filePath = searchParams.get('filePath');

  if (!filePath) {
    return NextResponse.json({ error: 'File path is required.' }, { status: 400 });
  }

  try {
    const options = {
      version: 'v4' as 'v2' | 'v4',
      action: 'read' as 'read' | 'write' | 'delete' | 'resumable',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };

    const [url] = await bucket.file(filePath).getSignedUrl(options);
    return NextResponse.json({ viewUrl: url });
  } catch (error: any) {
    console.error('Error generating signed URL:', error);
    if (error.code === 404) {
      return NextResponse.json({ error: 'File not found.' }, { status: 404 });
    }
    return NextResponse.json({ error: error.message || 'Failed to get view URL.' }, { status: 500 });
  }
}