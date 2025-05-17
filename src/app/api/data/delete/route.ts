// This route is used to delete the product data from LLM

import { NextRequest, NextResponse } from "next/server";
import { indexBucket } from "@/lib/gcs";

// This route is used to delete the product data from LLM
export async function DELETE(req: NextRequest) {
  const { productId } = await req.json();
  const filePath = `${productId}.json`;
  const blob = indexBucket.file(filePath);
  await blob.delete();
  return NextResponse.json({ message: "Product deleted" });
}
