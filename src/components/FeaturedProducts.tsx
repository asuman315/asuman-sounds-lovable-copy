
import { useQuery } from "@tanstack/react-query";
import { getFeaturedProducts } from "@/services/ProductService";
import FeaturedProduct from "@/components/FeaturedProduct";
import AnimatedElement from "@/components/AnimatedElement";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedProducts = () => {
  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: getFeaturedProducts,
  });

  return (
    <section id="featured-products" className="py-20 md:py-32 bg-secondary/30 relative overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <AnimatedElement animation="fade-in">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
              Featured Products
            </span>
          </AnimatedElement>
          
          <AnimatedElement animation="fade-in" delay={200}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Our Premium Collection
            </h2>
          </AnimatedElement>
          
          <AnimatedElement animation="fade-in" delay={400}>
            <p className="text-lg text-foreground/80">
              Discover our handpicked selection of premium audio products designed to elevate your listening experience.
            </p>
          </AnimatedElement>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="glass-card overflow-hidden">
                <div className="aspect-square">
                  <Skeleton className="h-full w-full" />
                </div>
                <div className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-8 w-1/3" />
                  <div className="flex gap-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredProducts && featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => (
                <FeaturedProduct 
                  key={product.id} 
                  product={product} 
                  index={index} 
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-foreground/70">No featured products available at the moment.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
