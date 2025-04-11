
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";

// Sample product images
const SAMPLE_PRODUCT_IMAGES = [
  "/lovable-uploads/99342f43-c8de-4064-af0c-1cd5a400b65a.png",
  "/lovable-uploads/3d1d0e5c-96c4-4d43-9a3b-89d78970f0e6.png",
  "/lovable-uploads/44eec910-e8b9-4b2c-ad86-f171bd68094f.png",
  "/lovable-uploads/7453c3c5-6ebc-4670-9a26-31e1a86dce55.png"
];

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  
  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    addToCart(product);
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1500);
  };
  
  const calculateDiscountedPrice = () => {
    // Always use the current price
    return product.price;
  };

  // Handle Ugandan Shillings formatting
  const formattedPrice = product.currency === 'UGX' 
    ? `USh ${new Intl.NumberFormat('en-US').format(calculateDiscountedPrice())}`
    : new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: product.currency || 'USD',
      }).format(calculateDiscountedPrice());
  
  const originalPrice = product.original_price 
    ? (product.currency === 'UGX' 
        ? `USh ${new Intl.NumberFormat('en-US').format(product.original_price)}`
        : new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: product.currency || 'USD',
          }).format(product.original_price)) 
    : null;

  // Use comparable_price for discount calculation if available
  const discountPercentage = product.comparable_price && product.comparable_price > product.price ? 
    Math.round(((product.comparable_price - product.price) / product.comparable_price) * 100) : 
    (product.original_price && product.original_price > product.price ? 
      Math.round(((product.original_price - product.price) / product.original_price) * 100) : null);

  // Format the description by removing HTML tags and limiting length
  const formatDescription = (description: string) => {
    // Remove HTML tags if present
    const plainText = description.replace(/<[^>]*>/g, '');
    // Return a shortened version if it's too long
    return plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText;
  };

  // Get product images - if none available, use sample images based on product ID
  const getProductImages = () => {
    if (product.images && product.images.length > 0) {
      return product.images.map(img => img.image_url);
    } else {
      // Use a consistent image based on the product ID
      const index = product.id.charCodeAt(0) % SAMPLE_PRODUCT_IMAGES.length;
      return [SAMPLE_PRODUCT_IMAGES[index]];
    }
  };
  
  const productImages = getProductImages();
  
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
            {discountPercentage && discountPercentage > 0 && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-500 text-white">
                {discountPercentage}% OFF
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
            {formatDescription(product.description)}
          </p>
          
          {/* Price */}
          <div className="flex items-end gap-2 mb-4">
            <span className="text-xl font-semibold">
              {formattedPrice}
            </span>
            {product.comparable_price && product.comparable_price > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {product.currency === 'UGX' 
                  ? `USh ${new Intl.NumberFormat('en-US').format(product.comparable_price)}`
                  : new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: product.currency || 'USD',
                    }).format(product.comparable_price)}
              </span>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              className={`flex-1 text-sm px-3 py-1 h-9 relative overflow-hidden transition-all duration-300 ${
                isAdding ? 
                  "bg-green-600 hover:bg-green-700" : 
                  "bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700"
              }`}
              disabled={product.stock_count <= 0}
              onClick={handleAddToCart}
            >
              <motion.span
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: isAdding ? 0 : 1, y: isAdding ? -20 : 0 }}
                className="flex items-center absolute inset-0 justify-center"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add to Cart
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isAdding ? 1 : 0, y: isAdding ? 0 : 20 }}
                className="flex items-center absolute inset-0 justify-center"
              >
                <Check className="h-4 w-4 mr-1" />
                Added
              </motion.span>
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
