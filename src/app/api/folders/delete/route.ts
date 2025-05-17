// src/app/api/folders/delete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { bucket } from '@/lib/gcs';

export async function DELETE(req: NextRequest) {
  const { folderPath } = await req.json(); // Full path of the folder to delete, e.g., "my-folder/"

  if (!folderPath || !folderPath.endsWith('/')) {
    return NextResponse.json({ error: 'Invalid folder path. Must end with /' }, { status: 400 });
  }

  try {
    // Delete all files within the folder (prefix)
    await bucket.deleteFiles({ prefix: folderPath });
    // Optionally, delete the folder marker itself if you create one explicitly
    // await bucket.file(folderPath).delete({ ignoreNotFound: true });

    return NextResponse.json({ message: `Folder '${folderPath}' and its contents deleted successfully.` });
  } catch (error: any) {
    console.error('Error deleting folder:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete folder.' }, { status: 500 });
  }
}