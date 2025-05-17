"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CarouselProps = {
  images: string[];
  className?: string;
  aspectRatio?: "square" | "video" | "wide" | string;
  showArrows?: boolean;
  showIndicators?: boolean;
  autoPlay?: boolean;
  interval?: number;
  onImageChange?: (index: number) => void;
  lazyLoad?: boolean;
  placeholderText?: string;
};

export function Carousel({
  images,
  className,
  aspectRatio = "square",
  showArrows = true,
  showIndicators = true,
  autoPlay = false,
  interval = 5000,
  onImageChange,
  lazyLoad = false,
  placeholderText = "",
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isLoaded, setIsLoaded] = React.useState<boolean[]>([]);
  const [isVisible, setIsVisible] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Initialize isLoaded array
  React.useEffect(() => {
    setIsLoaded(images.map(() => false));
  }, [images]);

  // Set up intersection observer for lazy loading
  React.useEffect(() => {
    if (!lazyLoad) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [lazyLoad]);

  // Auto play functionality
  React.useEffect(() => {
    if (!autoPlay || !isVisible || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, images.length, isVisible]);

  // Notify parent component when image changes
  React.useEffect(() => {
    onImageChange?.(currentIndex);
  }, [currentIndex, onImageChange]);

  const handlePrevious = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handleIndicatorClick = (
    index: number,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    setCurrentIndex(index);
  };

  const handleImageLoad = (index: number) => {
    setIsLoaded((prev) => {
      const newLoaded = [...prev];
      newLoaded[index] = true;
      return newLoaded;
    });
  };

  // Get aspect ratio class
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square";
      case "video":
        return "aspect-video";
      case "wide":
        return "aspect-[16/9]";
      default:
        return aspectRatio;
    }
  };

  // If no images, show placeholder
  if (images.length === 0) {
    return (
      <div
        className={cn(
          getAspectRatioClass(),
          "bg-muted flex items-center justify-center text-muted-foreground",
          className
        )}
      >
        {placeholderText || "No images available"}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative group overflow-hidden rounded-md content-center",
        getAspectRatioClass(),
        className
      )}
    >
      <CarouselContent className="relative w-full overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <CarouselItem key={index} className="w-full h-full flex-shrink-0">
              {(isVisible || !lazyLoad) && (
                <>
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Product image ${index + 1}`}
                    className={cn(
                      "w-full h-full object-cover transition-opacity duration-300",
                      isLoaded[index] ? "opacity-100" : "opacity-0"
                    )}
                    onLoad={() => handleImageLoad(index)}
                    onError={(e) => {
                      e.currentTarget.src = `/placeholder.svg?height=400&width=400&text=Image`;
                      handleImageLoad(index);
                    }}
                  />
                  {!isLoaded[index] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                      <div className="animate-pulse w-8 h-8 rounded-full bg-muted-foreground/20"></div>
                    </div>
                  )}
                </>
              )}
              {lazyLoad && !isVisible && (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <div className="animate-pulse w-8 h-8 rounded-full bg-muted-foreground/20"></div>
                </div>
              )}
            </CarouselItem>
          ))}
        </div>
      </CarouselContent>

      {showArrows && images.length > 1 && (
        <>
          <CarouselPrevious
            onClick={handlePrevious}
            aria-label="Previous image"
          >
            <ArrowLeft className="h-4 w-4" />
          </CarouselPrevious>
          <CarouselNext onClick={handleNext} aria-label="Next image">
            <ArrowRight className="h-4 w-4" />
          </CarouselNext>
        </>
      )}

      {showIndicators && images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {images.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all",
                index === currentIndex ? "bg-primary w-3" : "bg-primary/50"
              )}
              onClick={(e) => handleIndicatorClick(index, e)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn("relative w-full overflow-hidden", className)}
    ref={ref}
    {...props}
  />
));
CarouselContent.displayName = "CarouselContent";

export const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn("w-full h-full flex-shrink-0", className)}
    ref={ref}
    {...props}
  />
));
CarouselItem.displayName = "CarouselItem";

export const CarouselPrevious = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLButtonElement>) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background/90",
        className
      )}
      {...props}
    />
  );
};
CarouselPrevious.displayName = "CarouselPrevious";

export const CarouselNext = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLButtonElement>) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background/90",
        className
      )}
      {...props}
    />
  );
};
CarouselNext.displayName = "CarouselNext";
