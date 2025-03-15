
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getProducts } from "@/services/ProductService";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";

interface RelatedProductsProps {
  currentProductId: string;
  category?: string;
}

const RelatedProducts = ({ currentProductId, category }: RelatedProductsProps) => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', { category }],
    queryFn: () => getProducts(),
  });

  // Filter out the current product and limit to 4 related products
  const relatedProducts = products
    ? products
        .filter(product => product.id !== currentProductId)
        .filter(product => !category || product.category === category)
        .slice(0, 4)
    : [];

  // Check if product is in the same category
  const isRelatedByCategoryMap = relatedProducts.reduce<Record<string, boolean>>((acc, product) => {
    acc[product.id] = product.category === category;
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!relatedProducts.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No related products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {relatedProducts.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div className="relative">
            {isRelatedByCategoryMap[product.id] && (
              <span className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-primary to-blue-600 text-white text-xs px-2 py-1 rounded-full">
                Similar
              </span>
            )}
            <ProductCard product={product} />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default RelatedProducts;
