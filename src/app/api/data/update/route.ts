import { NextRequest, NextResponse } from "next/server";
import { indexBucket } from "@/lib/gcs";

// This route is used to update the product data for LLM
export async function POST(req: NextRequest) {
  const { product } = await req.json();
  const filePath = `${product.id}.json`;
  const productItemIndex = `${product.itemIndex}`;
  const blob = indexBucket.file(filePath);

  // 1. Download existing JSONL
  const [downloaded] = await blob.download();
  const text = downloaded.toString("utf-8");

  // 2. Parse into lines, replace the matching one
  const updatedLines = text
    .split("\n")
    .filter((l) => l.trim() !== "")
    .map((line) => {
      try {
        const obj = JSON.parse(line);
        console.log(
          "obj check",
          obj.id,
          product.id,
          obj.id === product.id,
          obj.itemIndex,
          productItemIndex,
          Number(obj.itemIndex) === Number(productItemIndex)
        );
        if (
          obj.id === product.id &&
          Number(obj.itemIndex) === Number(productItemIndex)
        ) {
          console.log("updating product", product.id, product.itemIndex);
          return JSON.stringify(product);
        }
        return line;
      } catch (e) {
        return line;
      }
    });

  const newContent = updatedLines.join("\n") + "\n";

  console.log("newContent", newContent);

  await blob.save(Buffer.from(newContent), {
    metadata: { contentType: "application/jsonl" },
  });

  return NextResponse.json({ message: "Product updated" });
}
