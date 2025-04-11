
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Filter, ChevronDown, ArrowLeft, GridIcon, List, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

import { getProductsByCategory, categories } from "@/services/ProductService";
import { Product } from "@/types/product";

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const productsPerPage = 9;

  // Find the category name from the ID
  const category = categories.find(c => c.id === categoryId);
  
  // If category doesn't exist, redirect to products page
  useEffect(() => {
    if (categoryId && !category) {
      navigate("/products");
      toast.error("Category not found");
    }
  }, [categoryId, category, navigate]);

  // Fetch products for the current category
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', 'category', categoryId],
    queryFn: () => getProductsByCategory(categoryId || ''),
    enabled: !!categoryId
  });

  // Show error toast if products can't be loaded
  useEffect(() => {
    if (error) {
      toast.error("Failed to load products. Please try again later.");
    }
  }, [error]);

  // Filter products based on search query
  const filteredProducts = products ? products.filter(product => 
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  // Sort products based on selected option
  const sortedProducts = [...(filteredProducts || [])].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return 0; // Default to original order for featured
    }
  });

  // Paginate products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

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

  // Page change handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero section */}
      <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10"></div>
        <div className="absolute inset-0 z-0">
          <motion.img 
            src={`https://images.unsplash.com/photo-1616627547584-bf28cee262db?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`} 
            alt={category?.name || "Category"}
            className="w-full h-full object-cover object-center"
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
          />
        </div>
        <div className="container relative z-20 h-full flex flex-col justify-center items-start px-4 md:px-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-6 text-white border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20"
            onClick={() => navigate("/products")}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to all products
          </Button>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {category?.name || "Products"}
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/90 max-w-xl mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Discover our premium {category?.name?.toLowerCase() || "products"} collection
          </motion.p>
          
          <motion.div
            className="flex gap-3 items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="text-white/80">
              <span className="font-medium text-white">{sortedProducts.length}</span> products
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Main content */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters sidebar (desktop) / modal (mobile) */}
            <div className={`${filtersOpen ? 'fixed inset-0 z-50 bg-black/50 flex justify-end' : 'hidden'} md:block md:static md:bg-transparent md:w-64 shrink-0`}>
              <Card glass={true} className={`${filtersOpen ? 'w-full max-w-xs h-full' : 'w-full'} md:h-auto overflow-auto`}>
                <div className="flex items-center justify-between p-6 border-b md:hidden">
                  <h3 className="text-lg font-medium">Filters</h3>
                  <Button variant="ghost" size="icon" onClick={() => setFiltersOpen(false)}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </div>
                
                <CardContent className="p-6">
                  {/* Price range filter */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Price Range</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="price-1" className="mr-2" />
                        <label htmlFor="price-1">$0 - $100</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="price-2" className="mr-2" />
                        <label htmlFor="price-2">$100 - $300</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="price-3" className="mr-2" />
                        <label htmlFor="price-3">$300 - $500</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="price-4" className="mr-2" />
                        <label htmlFor="price-4">$500+</label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Availability filter */}
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
                  
                  {/* Mobile-only apply filter button */}
                  <div className="mt-8 md:hidden">
                    <Button className="w-full" onClick={() => setFiltersOpen(false)}>
                      Apply Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main product area */}
            <div className="flex-1">
              {/* Search and sort controls */}
              <div className="mb-8 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type="search"
                      placeholder="Search in this category..."
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
                      onClick={() => setFiltersOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <Filter size={18} />
                      Filters
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center border rounded-md overflow-hidden">
                      <button 
                        className={`p-2 ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'}`}
                        onClick={() => setViewMode('grid')}
                        aria-label="Grid view"
                      >
                        <GridIcon size={16} />
                      </button>
                      <button
                        className={`p-2 ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'}`}
                        onClick={() => setViewMode('list')}
                        aria-label="List view"
                      >
                        <List size={16} />
                      </button>
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
              </div>
              
              {/* Product count */}
              {!isLoading && (
                <div className="mb-6">
                  <p className="text-muted-foreground">
                    Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, sortedProducts.length)} of {sortedProducts.length} products
                    {searchQuery && ` matching "${searchQuery}"`}
                  </p>
                </div>
              )}
              
              {/* Product grid/list */}
              <motion.div 
                className={viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" 
                  : "flex flex-col gap-4"
                }
                variants={containerVariants}
                initial="hidden"
                animate={isLoading ? "hidden" : "visible"}
              >
                {isLoading ? (
                  // Skeleton loading state
                  Array.from({ length: 6 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))
                ) : currentProducts.length > 0 ? (
                  // Product cards
                  currentProducts.map((product: Product) => (
                    <motion.div 
                      key={product.id} 
                      variants={itemVariants}
                      className={viewMode === 'list' ? "w-full" : ""}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))
                ) : (
                  // No products found
                  <div className="col-span-full py-12 text-center">
                    <h3 className="text-xl font-medium mb-2">No products found</h3>
                    <p className="text-muted-foreground mb-6">
                      Try changing your search term or filter options
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchQuery("");
                        setSortOption("featured");
                      }}
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </motion.div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                          className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }).map((_, index) => (
                        <PaginationItem key={index}>
                          <PaginationLink
                            isActive={currentPage === index + 1}
                            onClick={() => handlePageChange(index + 1)}
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                          className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter section with glass morphism */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 md:px-6">
          <Card glass={true} className="p-8 md:p-12 backdrop-blur-md bg-white/25 border-white/30">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Join Our Newsletter
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Stay updated with our latest {category?.name?.toLowerCase() || "products"} and exclusive offers.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-1"
                />
                <Button>
                  Subscribe
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;
