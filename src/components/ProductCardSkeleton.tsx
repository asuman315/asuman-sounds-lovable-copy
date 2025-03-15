
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const ProductCardSkeleton = () => {
  return (
    <Card className="overflow-hidden h-full transition-shadow hover:shadow-md">
      <Skeleton className="aspect-square w-full" />
      
      <CardContent className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-3 w-16" />
        </div>
        
        <Skeleton className="h-6 w-4/5 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4 mb-3" />
        
        <div className="flex items-center gap-2 mb-1">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
        
        <Skeleton className="h-3 w-24" />
      </CardContent>
      
      <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
        <Skeleton className="h-9 w-full rounded-md" />
        <Skeleton className="h-9 w-full rounded-md" />
      </CardFooter>
    </Card>
  );
};

export default ProductCardSkeleton;
