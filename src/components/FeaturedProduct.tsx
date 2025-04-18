
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Check } from "lucide-react";
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

interface FeaturedProductProps {
  product: Product;
  index: number;
}

const FeaturedProduct = ({ product, index }: FeaturedProductProps) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  
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
    // We always use the current price
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
  
  // For discount percentage calculation, we should use comparable_price if available
  // This reflects the market price comparison
  const discountPercentage = product.comparable_price && product.comparable_price > product.price ? 
    Math.round(((product.comparable_price - product.price) / product.comparable_price) * 100) : 
    (product.original_price && product.original_price > product.price ? 
      Math.round(((product.original_price - product.price) / product.original_price) * 100) : null);
  
  // Get product image - if none available, use sample images based on product ID
  const getProductImage = () => {
    if (product.images && product.images.length > 0) {
      return product.images.find(img => img.is_main)?.image_url || product.images[0].image_url;
    } else {
      // Use a consistent image based on the product ID
      const index = product.id.charCodeAt(0) % SAMPLE_PRODUCT_IMAGES.length;
      return SAMPLE_PRODUCT_IMAGES[index];
    }
  };
  
  const mainImage = getProductImage();

  // Format the description by removing HTML tags and limiting length
  const formatDescription = (description: string) => {
    // Remove HTML tags if present
    const plainText = description.replace(/<[^>]*>/g, '');
    // Return a shortened version if it's too long
    return plainText.length > 120 ? plainText.substring(0, 120) + '...' : plainText;
  };

  return (
    <motion.div
      className="glass-card overflow-hidden backdrop-blur-md"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.2 }}
    >
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={mainImage} 
          alt={product.title} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
          loading="lazy"
        />
        <div className="absolute top-4 left-4 bg-primary text-white text-sm font-medium px-3 py-1 rounded-full">
          Featured
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{product.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{formatDescription(product.description)}</p>
        
        <div className="flex items-baseline mb-6">
          <span className="text-2xl font-bold">{formattedPrice}</span>
          {originalPrice && product.original_price > product.price && (
            <span className="ml-2 text-gray-500 line-through">{originalPrice}</span>
          )}
          {discountPercentage && discountPercentage > 0 && (
            <span className="ml-2 text-sm font-medium text-red-500">
              Save {discountPercentage}%
            </span>
          )}
        </div>
        
        <div className="flex gap-3">
          <Button 
            className={`flex-1 relative overflow-hidden transition-all duration-300 ${
              isAdding ? 
                "bg-green-600 hover:bg-green-700" : 
                "bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700"
            }`}
            onClick={handleAddToCart}
          >
            <motion.span
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: isAdding ? 0 : 1, y: isAdding ? -20 : 0 }}
              className="flex items-center absolute inset-0 justify-center"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isAdding ? 1 : 0, y: isAdding ? 0 : 20 }}
              className="flex items-center absolute inset-0 justify-center"
            >
              <Check className="mr-2 h-4 w-4" />
              Added
            </motion.span>
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            asChild
          >
            <Link to={`/products/${product.id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedProduct;
