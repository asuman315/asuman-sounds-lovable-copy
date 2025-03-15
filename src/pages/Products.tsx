
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, X, ChevronDown, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import FeaturedProduct from "@/components/FeaturedProduct";
import { Product } from "@/types/product";
import { getProducts, getFeaturedProducts, getProductsByCategory, searchProducts, categories } from "@/services/ProductService";
import { useQuery } from "@tanstack/react-query";

const Products = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || "all"
  );
  const [sortOption, setSortOption] = useState<string>(
    searchParams.get("sort") || "featured"
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get("q") || ""
  );

  // Fetch all products
  const { data: allProducts, isLoading: isLoadingProducts, error: productsError } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  });

  // Fetch featured products
  const { data: featuredProductsData, isLoading: isLoadingFeatured, error: featuredError } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: getFeaturedProducts
  });

  useEffect(() => {
    if (productsError || featuredError) {
      toast({
        title: "Error",
        description: "Failed to load products. Please try again later.",
        variant: "destructive",
      });
    }
  }, [productsError, featuredError, toast]);

  useEffect(() => {
    // Update search params
    const params: { [key: string]: string } = {};
    if (selectedCategory !== "all") params.category = selectedCategory;
    if (sortOption !== "featured") params.sort = sortOption;
    if (searchQuery) params.q = searchQuery;
    setSearchParams(params);
    
    // Filter and sort products
    if (!allProducts) return;
    
    let filtered = [...allProducts];
    
    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    switch (sortOption) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "best-selling":
        // In a real app, you'd have a field for tracking sales
        // For now, just keep the default order
        break;
      default:
        // Default to featured order, but since we don't have a specific field for this,
        // we just use the default order
        break;
    }
    
    setDisplayProducts(filtered);
  }, [selectedCategory, sortOption, searchQuery, allProducts, setSearchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already applied via the useEffect
  };

  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero section */}
      <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10"></div>
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1616627547584-bf28cee262db?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Premium speakers and audio equipment" 
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="container relative z-20 h-full flex flex-col justify-center items-start px-4 md:px-6">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Our Products
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-white/90 max-w-xl mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Discover premium sound that transforms your audio experience
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <Button className="btn-primary text-base" size="lg">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Shop Now
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container px-4 md:px-6">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our selection of premium audio equipment, handpicked for exceptional quality and sound
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoadingFeatured ? (
              // Skeleton loading for featured products
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-video w-full">
                    <div className="h-full w-full bg-gray-200 animate-pulse rounded-xl"></div>
                  </div>
                  <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
                </div>
              ))
            ) : featuredProductsData && featuredProductsData.length > 0 ? (
              featuredProductsData.slice(0, 3).map((product, index) => (
                <FeaturedProduct key={product.id} product={product} index={index} />
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <p className="text-muted-foreground">No featured products found.</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Product listing */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters (sidebar on desktop, modal on mobile) */}
            <div className={`${filtersOpen ? 'fixed inset-0 z-50 bg-black/50 flex justify-end' : 'hidden'} md:block md:static md:bg-transparent md:w-64 shrink-0`}>
              <div className={`${filtersOpen ? 'w-full max-w-xs h-full' : 'w-full'} bg-white p-6 overflow-auto md:rounded-xl md:border md:shadow-sm`}>
                <div className="flex items-center justify-between mb-6 md:hidden">
                  <h3 className="text-lg font-medium">Filters</h3>
                  <Button variant="ghost" size="icon" onClick={toggleFilters}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* Categories */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Categories</h3>
                  <div className="space-y-2">
                    <button
                      className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedCategory === "all" 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedCategory("all")}
                    >
                      All Products
                    </button>
                    {categories.map(category => (
                      <button
                        key={category.id}
                        className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                          selectedCategory === category.id 
                            ? "bg-primary/10 text-primary font-medium" 
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Price Range */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Price Range</h3>
                  <div className="px-2">
                    {/* Price range slider - coming soon */}
                    <p className="text-muted-foreground text-sm">Coming soon</p>
                  </div>
                </div>
                
                {/* Availability */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Availability</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="in-stock" className="mr-2" />
                      <label htmlFor="in-stock">In Stock</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="on-sale" className="mr-2" />
                      <label htmlFor="on-sale">On Sale</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main product area */}
            <div className="flex-1">
              {/* Search and sort controls */}
              <div className="mb-8 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type="search"
                      placeholder="Search products..."
                      className="pl-10 w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </form>
                </div>
                <div className="flex gap-2">
                  <div className="md:hidden">
                    <Button 
                      variant="outline" 
                      onClick={toggleFilters}
                      className="flex items-center gap-2"
                    >
                      <Filter size={18} />
                      Filters
                    </Button>
                  </div>
                  <div className="relative">
                    <select
                      className="appearance-none bg-white border rounded-md px-4 py-2 pr-8 w-full focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                    >
                      <option value="featured">Featured</option>
                      <option value="newest">Newest</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>
                </div>
              </div>
              
              {/* Product count */}
              {!isLoadingProducts && (
                <div className="mb-6">
                  <p className="text-muted-foreground">
                    Showing {displayProducts.length} {displayProducts.length === 1 ? 'product' : 'products'}
                    {selectedCategory !== "all" && ` in ${categories.find(c => c.id === selectedCategory)?.name || selectedCategory}`}
                    {searchQuery && ` matching "${searchQuery}"`}
                  </p>
                </div>
              )}
              
              {/* Product grid - adjusted to show fewer cards per row */}
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate={isLoadingProducts ? "hidden" : "visible"}
              >
                {isLoadingProducts ? (
                  // Skeleton loading state
                  Array.from({ length: 6 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))
                ) : displayProducts.length > 0 ? (
                  // Product cards
                  displayProducts.map((product) => (
                    <motion.div key={product.id} variants={itemVariants}>
                      <ProductCard product={product} />
                    </motion.div>
                  ))
                ) : (
                  // No products found
                  <div className="col-span-full py-12 text-center">
                    <h3 className="text-xl font-medium mb-2">No products found</h3>
                    <p className="text-muted-foreground mb-6">
                      Try changing your filters or search terms
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSelectedCategory("all");
                        setSortOption("featured");
                        setSearchQuery("");
                      }}
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="glass-card p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Stay in the Loop
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Subscribe to our newsletter for exclusive deals, new product announcements, and audio tips.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-1"
                />
                <Button className="btn-primary">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Products;
