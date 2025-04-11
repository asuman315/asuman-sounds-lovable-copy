import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { getProductById } from "@/services/ProductService";
import { Product } from "@/types/product";
import AnimatedElement from "@/components/AnimatedElement";
import Header from "@/components/Header";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Check, 
  Star, 
  ChevronRight,
  Shield,
  Truck,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import ProductGallery from "@/components/ProductGallery";
import ProductSpecifications from "@/components/ProductSpecifications";
import ProductReviews from "@/components/ProductReviews";
import RelatedProducts from "@/components/RelatedProducts";

const SAMPLE_PRODUCT_IMAGES = [
  "/lovable-uploads/99342f43-c8de-4064-af0c-1cd5a400b65a.png",
  "/lovable-uploads/3d1d0e5c-96c4-4d43-9a3b-89d78970f0e6.png",
  "/lovable-uploads/44eec910-e8b9-4b2c-ad86-f171bd68094f.png",
  "/lovable-uploads/7453c3c5-6ebc-4670-9a26-31e1a86dce55.png"
];

const ProductDetails = () => {
  const { productId } = useParams<{ productId: string }>();
  const { addToCart } = useCart();
  const [currentImage, setCurrentImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("description");

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProductById(productId || ''),
  });

  const handleAddToCart = () => {
    if (product) {
      setIsAdding(true);
      addToCart(product);
      
      setTimeout(() => {
        setIsAdding(false);
      }, 1500);
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto pt-20 pb-12 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-gray-100 animate-pulse rounded-xl"></div>
          <div className="space-y-6">
            <div className="h-10 bg-gray-100 animate-pulse rounded-md w-3/4"></div>
            <div className="h-6 bg-gray-100 animate-pulse rounded-md w-1/2"></div>
            <div className="h-24 bg-gray-100 animate-pulse rounded-md"></div>
            <div className="h-12 bg-gray-100 animate-pulse rounded-md w-1/3"></div>
            <div className="h-12 bg-gray-100 animate-pulse rounded-md"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container max-w-7xl mx-auto pt-20 pb-12 px-4 sm:px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <p className="mb-6">Sorry, we couldn't find the product you're looking for.</p>
        <Button asChild>
          <Link to="/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  const formatDescription = (description: string) => {
    return description.replace(/<[^>]*>/g, '');
  };

  const getProductImages = () => {
    if (product.images && product.images.length > 0) {
      return product.images.map(img => img.image_url);
    } else {
      const index = product.id.charCodeAt(0) % SAMPLE_PRODUCT_IMAGES.length;
      return [SAMPLE_PRODUCT_IMAGES[index]];
    }
  };

  const productImages = getProductImages();

  const formattedPrice = product.currency === 'UGX' 
    ? `USh ${new Intl.NumberFormat('en-US').format(product.price)}`
    : new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: product.currency || 'USD',
      }).format(product.price);

  const originalPrice = product.comparable_price 
    ? (product.currency === 'UGX' 
        ? `USh ${new Intl.NumberFormat('en-US').format(product.comparable_price)}`
        : new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: product.currency || 'USD',
          }).format(product.comparable_price)) 
    : null;

  const discountPercentage = product.comparable_price && product.comparable_price > product.price ? 
    Math.round(((product.comparable_price - product.price) / product.comparable_price) * 100) : null;

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 min-h-screen">
      <Header />
      
      <div className="container max-w-7xl mx-auto pt-20 px-4 sm:px-6">
        <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-800 dark:text-gray-200 font-medium truncate">{product?.title}</span>
        </nav>
      </div>
      
      <div className="container max-w-7xl mx-auto pt-4 px-4 sm:px-6 md:hidden">
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1 rounded-full" 
          asChild
        >
          <Link to="/products">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <main className="container max-w-7xl mx-auto pt-8 pb-16 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <AnimatedElement animation="fade-in-left" className="h-full">
            <ProductGallery images={productImages} />
          </AnimatedElement>

          <AnimatedElement animation="fade-in-right" className="flex flex-col">
            <div className="mb-4">
              <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium px-2.5 py-1 rounded-full">
                {product.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {product.title}
            </h1>

            <div className="flex items-center mb-6">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Star 
                    key={rating} 
                    className={`h-4 w-4 ${rating <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">4.0 (24 reviews)</span>
            </div>

            <div className="flex items-baseline mb-6">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {formattedPrice}
              </span>
              {originalPrice && product.comparable_price > product.price && (
                <span className="text-lg text-gray-500 line-through ml-2">
                  {originalPrice}
                </span>
              )}
              {discountPercentage && discountPercentage > 0 && (
                <span className="ml-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 text-xs font-medium rounded-full">
                  {discountPercentage}% OFF
                </span>
              )}
            </div>

            <div className="prose prose-sm dark:prose-invert max-w-none mb-8">
              <p className="text-gray-600 dark:text-gray-300">
                {formatDescription(product.description)}
              </p>
            </div>

            <div className="mb-8">
              <p className="flex items-center text-sm font-medium">
                {product.stock_count > 0 ? (
                  <>
                    <span className="flex h-3 w-3 relative mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-green-600 dark:text-green-400">
                      In Stock - {product.stock_count} available
                    </span>
                  </>
                ) : (
                  <>
                    <span className="h-3 w-3 bg-red-500 rounded-full mr-2"></span>
                    <span className="text-red-600 dark:text-red-400">Out of Stock</span>
                  </>
                )}
              </p>
            </div>

            <div className="flex gap-4 mb-8">
              <Button 
                className={`flex-1 h-12 rounded-full relative overflow-hidden transition-all duration-300 ${
                  isAdding ? 
                    "bg-green-600 hover:bg-green-700" : 
                    "bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700"
                }`}
                disabled={product.stock_count <= 0 || isAdding}
                onClick={handleAddToCart}
              >
                <motion.span
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: isAdding ? 0 : 1, y: isAdding ? -20 : 0 }}
                  className="flex items-center absolute inset-0 justify-center"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isAdding ? 1 : 0, y: isAdding ? 0 : 20 }}
                  className="flex items-center absolute inset-0 justify-center"
                >
                  <Check className="mr-2 h-5 w-5" />
                  Added to Cart
                </motion.span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-12 w-12 rounded-full" 
                onClick={toggleLike}
              >
                <Heart 
                  className={`h-5 w-5 transition-colors ${
                    isLiked ? "fill-red-500 text-red-500" : "text-gray-600 dark:text-gray-400"
                  }`} 
                />
              </Button>
              
              <Button 
                variant="outline" 
                className="h-12 w-12 rounded-full"
              >
                <Share2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </Button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-8 backdrop-blur-sm">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Shield className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <span className="block text-sm font-medium">1-Year Warranty</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Full coverage for manufacturing defects</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <Truck className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <span className="block text-sm font-medium">Free Shipping</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Delivered within 2-4 business days</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <RotateCcw className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <span className="block text-sm font-medium">30-Day Returns</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Hassle-free return policy</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="space-y-3 border rounded-xl overflow-hidden">
              <Collapsible
                open={expandedSection === "description"}
                onOpenChange={() => setExpandedSection(expandedSection === "description" ? null : "description")}
                className="border-b last:border-b-0"
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                  <span className="font-medium">Product Description</span>
                  <ChevronRight className={`h-5 w-5 transition-transform ${expandedSection === "description" ? "rotate-90" : ""}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4 pt-0">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {formatDescription(product.description)}
                  </p>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible
                open={expandedSection === "specs"}
                onOpenChange={() => setExpandedSection(expandedSection === "specs" ? null : "specs")}
                className="border-b last:border-b-0"
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                  <span className="font-medium">Specifications</span>
                  <ChevronRight className={`h-5 w-5 transition-transform ${expandedSection === "specs" ? "rotate-90" : ""}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4 pt-0">
                  <ProductSpecifications product={product} />
                </CollapsibleContent>
              </Collapsible>

              <Collapsible
                open={expandedSection === "shipping"}
                onOpenChange={() => setExpandedSection(expandedSection === "shipping" ? null : "shipping")}
                className="border-b last:border-b-0"
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                  <span className="font-medium">Shipping & Returns</span>
                  <ChevronRight className={`h-5 w-5 transition-transform ${expandedSection === "shipping" ? "rotate-90" : ""}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4 pt-0">
                  <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                    <p>Free standard shipping on all orders over $50. Expedited and international shipping options available at checkout.</p>
                    <p>We accept returns within 30 days of delivery for a full refund or exchange. Items must be unused and in original packaging.</p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </AnimatedElement>
        </div>
      </main>

      <section className="bg-white dark:bg-gray-950 py-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatedElement animation="fade-in" className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-2">Customer Reviews</h2>
            <p className="text-center text-gray-500 dark:text-gray-400">What our customers are saying about this product</p>
          </AnimatedElement>
          
          <ProductReviews productId={product.id} />
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatedElement animation="fade-in" className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-2">You May Also Like</h2>
            <p className="text-center text-gray-500 dark:text-gray-400">Explore more products in our collection</p>
          </AnimatedElement>
          
          <RelatedProducts 
            currentProductId={product.id} 
            category={product.category} 
          />
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
