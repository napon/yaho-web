import { NextRequest, NextResponse } from "next/server";
import { indexBucket } from "@/lib/gcs";

// This route is used to update the product data for LLM
export async function POST(req: NextRequest) {
  const { product } = await req.json();
  const filePath = `${product.product_id}.json`;
  const blob = indexBucket.file(filePath);

  const buffer = await JSON.stringify(product);
  await blob.save(Buffer.from(buffer), {
    metadata: { contentType: "application/json" },
  });

  return NextResponse.json({ message: "Product updated" });
}
