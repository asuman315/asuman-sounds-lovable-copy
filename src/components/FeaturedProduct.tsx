
import { Tables } from "@/integrations/supabase/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
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

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={product.title}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        
        <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold flex items-center">
          <Star className="h-3 w-3 mr-1 fill-current" />
          Best Seller
        </div>
        
        {product.original_price && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            {Math.round((1 - (product.price / product.original_price)) * 100)}% OFF
          </div>
        )}
      </div>
      
      <CardContent className="p-5">
        <h3 className="font-bold text-xl mb-2">{product.title}</h3>
        
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="font-bold text-xl">{formattedPrice}</span>
          {formattedOriginalPrice && (
            <span className="text-muted-foreground line-through">
              {formattedOriginalPrice}
            </span>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            className="flex-1" 
            onClick={handleAddToCart}
            disabled={product.stock_count <= 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleViewProduct}
          >
            View Product
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturedProduct;
