
import { Skeleton } from "@/components/ui/skeleton";

const ProductCardSkeleton = () => {
  return (
    <div className="rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm">
      {/* Image skeleton */}
      <div className="aspect-square w-full">
        <Skeleton className="h-full w-full" />
      </div>
      
      {/* Content skeleton */}
      <div className="p-4">
        {/* Title */}
        <Skeleton className="h-6 w-3/4 mb-2" />
        
        {/* Rating */}
        <Skeleton className="h-4 w-1/3 mb-3" />
        
        {/* Description */}
        <Skeleton className="h-4 w-full mb-1.5" />
        <Skeleton className="h-4 w-11/12 mb-3" />
        
        {/* Price */}
        <Skeleton className="h-7 w-1/4 mb-4" />
        
        {/* Buttons */}
        <div className="flex gap-2">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
