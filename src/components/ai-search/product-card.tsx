"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/product";
import { Carousel } from "../ui/carousel";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <Card
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <Carousel
        images={product.image_urls || []}
        aspectRatio="square"
        showArrows={true}
        showIndicators={true}
        lazyLoad={true}
        placeholderText={product.name}
      />
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>

        {product.product_materials_english &&
          product.product_materials_english.length > 0 && (
            <div className="flex items-start gap-1 mt-2">
              <span className="text-xs font-medium">Material:</span>
              <span className="text-xs">
                {product.product_materials_english.join(", ")}
              </span>
            </div>
          )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-wrap gap-1">
        {(product.colors_english || []).slice(0, 3).map((color, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {color}
          </Badge>
        ))}
        {product.colors_english && product.colors_english.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{product.colors_english.length - 3} more
          </Badge>
        )}

        {product.product_finishes_english &&
          product.product_finishes_english.length > 0 && (
            <Badge variant="secondary" className="text-xs ml-auto">
              {product.product_finishes_english.length} finishes
            </Badge>
          )}
      </CardFooter>
    </Card>
  );
}
