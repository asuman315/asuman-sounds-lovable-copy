
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
      className="glass-card overflow-hidden backdrop-blur-md"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.2 }}
    >
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
          loading="lazy"
        />
        <div className="absolute top-4 left-4 bg-primary text-white text-sm font-medium px-3 py-1 rounded-full">
          Featured
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex items-baseline mb-6">
          <span className="text-2xl font-bold">{formattedPrice}</span>
          {product.discount && (
            <span className="ml-2 text-gray-500 line-through">{originalPrice}</span>
          )}
          {product.discount && (
            <span className="ml-2 text-sm font-medium text-red-500">
              Save {Math.round(product.discount * 100)}%
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
