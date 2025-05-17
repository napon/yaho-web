"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/product";
import { Carousel } from "../ui/carousel";
import { useTranslation } from "@/lib/i18n";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const { t } = useTranslation();
  const isChinese = t("lang") === "zh";

  const colors = isChinese ? product.colors_chinese : product.colors_english;
  const materials = isChinese
    ? product.product_materials_chinese
    : product.product_materials_english;
  const finishes = isChinese
    ? product.product_finishes_chinese
    : product.product_finishes_english;

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

        {materials && materials.length > 0 && (
          <div className="flex items-start gap-1 mt-2">
            <span className="text-xs font-medium">
              {t("productCard.material")}:
            </span>
            <span className="text-xs">{materials.join(", ")}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-wrap gap-1">
        {(colors || []).slice(0, 3).map((color, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {color}
          </Badge>
        ))}
        {colors && colors.length > 3 && (
          <Badge variant="outline" className="text-xs">
            {t("productCard.moreColors", { count: colors.length - 3 })}
          </Badge>
        )}

        {finishes && finishes.length > 0 && (
          <Badge variant="secondary" className="text-xs ml-auto">
            {t("productCard.finishes", { count: finishes.length })}
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}
