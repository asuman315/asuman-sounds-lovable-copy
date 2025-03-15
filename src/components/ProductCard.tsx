
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
    if (product.discount) {
      return product.price - (product.price * product.discount);
    }
    return product.price;
  };
  
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(calculateDiscountedPrice());
  
  const originalPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price);
  
  return (
    <motion.div
      className="group relative h-full rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
      whileHover={{ y: -5 }}
    >
      <Link to={`/products/${product.id}`} className="block h-full">
        <div className="relative aspect-square overflow-hidden">
          {/* Product image */}
          {product.images.length > 1 ? (
            <div
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
              style={{
                backgroundImage: `url(${product.images[currentImageIndex]})`,
              }}
              onMouseEnter={() => setCurrentImageIndex(1)}
              onMouseLeave={() => setCurrentImageIndex(0)}
            />
          ) : (
            <img 
              src={product.images[0]} 
              alt={product.name} 
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
            {product.discount && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-500 text-white">
                {Math.round(product.discount * 100)}% OFF
              </span>
            )}
            {!product.inStock && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-800 text-white">
                Out of Stock
              </span>
            )}
          </div>
        </div>
        
        <div className="p-4">
          {/* Product name and rating */}
          <div className="mb-2">
            <h3 className="text-lg font-medium line-clamp-1">{product.name}</h3>
            {product.rating && (
              <div className="flex items-center mt-1">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating!)
                          ? "text-yellow-400"
                          : i < product.rating!
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-1">
                  ({product.reviewCount})
                </span>
              </div>
            )}
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
            {product.discount && (
              <span className="text-sm text-gray-500 line-through">
                {originalPrice}
              </span>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              className="flex-1 text-sm px-3 py-1 h-9 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 transition-colors"
              disabled={!product.inStock}
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
