
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };
  
  const calculateDiscountedPrice = () => {
    if (product.original_price) {
      return product.price;
    }
    return product.price;
  };
  
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: product.currency || 'USD',
  }).format(calculateDiscountedPrice());
  
  const originalPrice = product.original_price ? new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: product.currency || 'USD',
  }).format(product.original_price) : null;

  // Get default placeholder image if no images are available
  const productImages = product.images && product.images.length > 0 
    ? product.images.map(img => img.image_url)
    : ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"];
  
  return (
    <motion.div
      className="group relative h-full rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
      whileHover={{ y: -5 }}
    >
      <Link to={`/products/${product.id}`} className="block h-full">
        <div className="relative aspect-square overflow-hidden">
          {/* Product image */}
          {productImages.length > 1 ? (
            <div
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
              style={{
                backgroundImage: `url(${productImages[currentImageIndex]})`,
              }}
              onMouseEnter={() => setCurrentImageIndex(1)}
              onMouseLeave={() => setCurrentImageIndex(0)}
            />
          ) : (
            <img 
              src={productImages[0]} 
              alt={product.title} 
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105" 
              loading="lazy"
            />
          )}
          
          {/* Like button */}
          <button
            onClick={toggleLike}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
            aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`h-[18px] w-[18px] transition-colors ${
                isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </button>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.original_price && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-500 text-white">
                {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
              </span>
            )}
            {product.stock_count <= 0 && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-800 text-white">
                Out of Stock
              </span>
            )}
          </div>
        </div>
        
        <div className="p-4">
          {/* Product name */}
          <div className="mb-2">
            <h3 className="text-lg font-medium line-clamp-1">{product.title}</h3>
          </div>
          
          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {product.description}
          </p>
          
          {/* Price */}
          <div className="flex items-end gap-2 mb-4">
            <span className="text-xl font-semibold">
              {formattedPrice}
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {originalPrice}
              </span>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              className="flex-1 text-sm px-3 py-1 h-9 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 transition-colors"
              disabled={product.stock_count <= 0}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add to Cart
            </Button>
            <Button 
              variant="outline" 
              className="text-sm px-3 py-1 h-9"
              asChild
            >
              <Link to={`/products/${product.id}`}>
                View Details
              </Link>
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
