
import { useState } from "react";
import { Tables } from "@/integrations/supabase/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type Product = Tables<"products"> & {
  images: Tables<"product_images">[];
};

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
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

  const handleViewDetails = () => {
    // Navigate to product detail page (to be implemented)
    navigate(`/products/${product.id}`);
  };

  // Truncate description to 100 characters
  const truncatedDescription = product.description.length > 100
    ? `${product.description.substring(0, 100)}...`
    : product.description;

  return (
    <Card 
      className={`overflow-hidden transition-all duration-300 ${
        isHovered ? "shadow-lg transform translate-y-[-5px]" : "shadow-sm"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={product.title}
          className="h-full w-full object-cover object-center transition-transform duration-300"
          style={{
            transform: isHovered ? "scale(1.05)" : "scale(1)",
          }}
        />
        
        {/* Discount badge */}
        {product.original_price && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            {Math.round((1 - (product.price / product.original_price)) * 100)}% OFF
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="mb-1 flex items-center">
          <div className="flex items-center text-amber-500 mr-2">
            <Star className="fill-amber-500 h-4 w-4" />
            <span className="text-sm ml-1">4.8</span>
          </div>
          <span className="text-xs text-muted-foreground">(120 reviews)</span>
        </div>

        <h3 className="font-bold text-lg mb-1 line-clamp-1">{product.title}</h3>
        
        <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
          {truncatedDescription}
        </p>

        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-lg">{formattedPrice}</span>
          {formattedOriginalPrice && (
            <span className="text-muted-foreground text-sm line-through">
              {formattedOriginalPrice}
            </span>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          {product.stock_count > 0 
            ? `${product.stock_count} in stock` 
            : "Out of stock"}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={handleViewDetails}
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
        <Button 
          size="sm" 
          className="w-full"
          onClick={handleAddToCart}
          disabled={product.stock_count <= 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
