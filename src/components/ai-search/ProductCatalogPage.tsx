"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/ai-search/product-card";
import { ProductDialog } from "@/components/ai-search/product-dialog";
import type { Product, ProductSearchResult } from "@/types/product";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Spinner } from "../common/spinner";

export default function ProductCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (query: string) => {
    const response = await fetch("/api/search?query=" + query);
    const { summaryAnswer, results } = await response.json();
    setProducts(
      results?.map(
        (result: ProductSearchResult) => result.document.structData
      ) || []
    );
    setAnswer(summaryAnswer || null);
    setLoading(false);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleSaveProduct = async (updatedProduct: Product) => {
    // Update the product in the products array
    const updatedProducts = products.map((p) =>
      p.product_id === updatedProduct.product_id ? updatedProduct : p
    );

    setProducts(updatedProducts);
    setSelectedProduct(updatedProduct);

    try {
      await fetch("/api/data/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: updatedProduct,
        }),
      });
      setProducts(updatedProducts);
      setSelectedProduct(updatedProduct);
      toast.success("Product updated", {
        description:
          "The update will be reflected in the catalog in a few minutes.",
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to update product");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Product Catalog</CardTitle>
          <CardDescription>
            Enter a query to find relevant products
          </CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Enter a query and press ENTER to search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setLoading(true);
                  fetchProducts(searchQuery);
                }
                if (e.key === "Escape") {
                  toast("hello", {
                    description: "world",
                  });
                }
              }}
              className="pl-10"
            />
          </div>
          {answer && (
            <div className="max-w-full mt-4 p-4 bg-slate-200 rounded-md text-left justify-start">
              <p>{answer}</p>
            </div>
          )}
        </CardHeader>
      </Card>
      {loading ? (
        <Spinner />
      ) : (
        products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={`${product.product_id}-${product.name}`}
                product={product}
                onClick={() => handleProductClick(product)}
              />
            ))}
          </div>
        )
      )}

      <ProductDialog
        product={selectedProduct}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveProduct}
      />
    </div>
  );
}
