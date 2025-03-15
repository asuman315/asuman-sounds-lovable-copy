
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";

interface FeaturedProductProps {
  product: Product;
  index: number;
}

const FeaturedProduct = ({ product, index }: FeaturedProductProps) => {
  const calculateDiscountedPrice = () => {
    if (product.original_price && product.original_price > product.price) {
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
  
  const discountPercentage = product.original_price ? 
    Math.round(((product.original_price - product.price) / product.original_price) * 100) : null;
  
  const mainImage = product.images && product.images.length > 0 ? 
    product.images.find(img => img.is_main)?.image_url || product.images[0].image_url : 
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3';

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
          {originalPrice && (
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
            className="flex-1 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 transition-colors"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
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
