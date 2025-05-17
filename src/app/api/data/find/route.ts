// This route is used to find the product data from LLM

import { NextRequest, NextResponse } from "next/server";
import { indexBucket } from "@/lib/gcs";
import { FileMetadata } from "@google-cloud/storage";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    // return all products
    const [files] = await indexBucket.getFiles();
    console.log(files.forEach((f) => console.log(f.metadata)));
    return NextResponse.json({
      products: files.map((file: { metadata: FileMetadata }) => ({
        id: file.metadata.id,
        name: file.metadata.name,
      })),
    });
  }
  const filePath = `${id}.json`;
  const blob = indexBucket.file(filePath);
  const [content] = await blob.download();
  return NextResponse.json(JSON.parse(content.toString()));
}
