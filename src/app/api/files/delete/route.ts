// src/app/api/files/delete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { bucket } from '@/lib/gcs';

export async function DELETE(req: NextRequest) {
  const { filePath } = await req.json(); // Full path of the file to delete

  if (!filePath) {
    return NextResponse.json({ error: 'File path is required.' }, { status: 400 });
  }

  try {
    await bucket.file(filePath).delete();
    return NextResponse.json({ message: `File '${filePath}' deleted successfully.` });
  } catch (error: any) {
    console.error('Error deleting file:', error);
    // Handle "Not Found" specifically if needed
    if (error.code === 404) {
        return NextResponse.json({ error: 'File not found.' }, { status: 404 });
    }
    return NextResponse.json({ error: error.message || 'Failed to delete file.' }, { status: 500 });
  }
}