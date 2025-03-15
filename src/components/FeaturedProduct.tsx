
import { Tables } from "@/integrations/supabase/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type Product = Tables<"products"> & {
  images: Tables<"product_images">[];
};

interface FeaturedProductProps {
  product: Product;
}

const FeaturedProduct = ({ product }: FeaturedProductProps) => {
  const navigate = useNavigate();
  
  // Find the main image or use the first one
  const mainImage = product.images.find(img => img.is_main) || product.images[0];
  const imageUrl = mainImage?.image_url || "/placeholder.svg";

  // Format price with currency
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: product.currency || 'USD',
  }).format(product.price);

  // Format original price if present
  const formattedOriginalPrice = product.original_price 
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: product.currency || 'USD',
      }).format(product.original_price)
    : null;

  const handleAddToCart = () => {
    toast.success(`${product.title} added to cart`);
    // Here you would implement actual cart functionality
  };

  const handleViewProduct = () => {
    navigate(`/products/${product.id}`);
  };

  // Calculate discount percentage
  const discountPercentage = product.original_price 
    ? Math.round((1 - (product.price / product.original_price)) * 100) 
    : null;

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={product.title}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        
        <div className="absolute top-3 left-3 bg-gradient-to-r from-primary to-blue-600 text-primary-foreground px-3 py-1 rounded-full text-xs font-bold flex items-center">
          <Star className="h-3 w-3 mr-1 fill-current" />
          Best Seller
        </div>
        
        {discountPercentage && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-rose-600 text-white px-3 py-1 rounded-full text-xs font-bold">
            {discountPercentage}% OFF
          </div>
        )}
      </div>
      
      <CardContent className="p-5 flex-grow flex flex-col">
        <h3 className="font-bold text-xl mb-2 text-balance">{product.title}</h3>
        
        <p className="text-muted-foreground mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="font-bold text-xl text-primary">{formattedPrice}</span>
          {formattedOriginalPrice && (
            <span className="text-muted-foreground line-through">
              {formattedOriginalPrice}
            </span>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            className="flex-1 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary transition-all duration-300" 
            onClick={handleAddToCart}
            disabled={product.stock_count <= 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={handleViewProduct}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Product
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturedProduct;
