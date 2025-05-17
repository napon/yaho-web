// src/app/api/files/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { bucket } from "@/lib/gcs";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll("files") as File[];
  const prefix = (formData.get("prefix") as string) || ""; // Current directory/prefix

  if (!files || files.length === 0) {
    return NextResponse.json({ error: "No files selected." }, { status: 400 });
  }

  const uploadedFilesInfo = [];

  try {
    for (const file of files) {
      const filePath = `${prefix}${file.name}`;
      const blob = bucket.file(filePath);

      // Convert ReadableStream (from File object) to Node.js Readable stream
      const buffer = await file.arrayBuffer();

      // Pipe the stream (this part needs careful handling for web streams vs node streams in Next.js Edge/Node.js runtimes)
      // A simpler way for moderate files is to just pass the buffer:
      await blob.save(Buffer.from(buffer), {
        metadata: { contentType: file.type },
      });

      uploadedFilesInfo.push({
        name: file.name,
        path: filePath,
        size: file.size,
      });
    }
    return NextResponse.json({
      message: "Files uploaded successfully.",
      uploadedFiles: uploadedFilesInfo,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "File upload failed." },
      { status: 500 }
    );
  }
}
