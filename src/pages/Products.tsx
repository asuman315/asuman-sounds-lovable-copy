
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Filter, Search, ShoppingCart, Star, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import FeaturedProduct from "@/components/FeaturedProduct";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";

type Product = Tables<"products"> & {
  images: Tables<"product_images">[];
};

type SortOption = "newest" | "price-low" | "price-high" | "popularity";

const ProductsPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const categories = ["Headphones", "Speakers", "Earbuds", "Accessories", "New Releases"];

  // Fetch all products
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      // Fetch products
      const { data: products, error } = await supabase
        .from("products")
        .select("*, images:product_images(*)");

      if (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
        return [];
      }

      return products as Product[];
    },
  });

  // Filter products based on category and search query
  const filteredProducts = products
    ? products.filter((product) => {
        const matchesCategory = !selectedCategory || product.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch = !searchQuery || 
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          product.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
    : [];

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "popularity":
        return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
      case "newest":
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  // Get featured products
  const featuredProducts = products
    ? products.filter((product) => product.is_featured).slice(0, 5)
    : [];

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-12 md:py-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Our Products</h1>
          <p className="text-lg md:text-xl max-w-2xl opacity-90">
            Premium audio equipment crafted with precision and elegance. Experience sound like never before.
          </p>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-12 bg-gradient-to-b from-gray-900 to-background">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover our most popular products with exclusive offers up to 20% off
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <FeaturedProduct key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Products Section */}
      <section className="py-12 flex-grow">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters (Desktop) */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Categories</h3>
                  <ul className="space-y-1">
                    <li>
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={`w-full text-left px-2 py-1.5 rounded-md transition-colors ${
                          selectedCategory === null
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-muted"
                        }`}
                      >
                        All Products
                      </button>
                    </li>
                    {categories.map((category) => (
                      <li key={category}>
                        <button
                          onClick={() => setSelectedCategory(category)}
                          className={`w-full text-left px-2 py-1.5 rounded-md transition-colors ${
                            selectedCategory === category
                              ? "bg-primary/10 text-primary font-medium"
                              : "hover:bg-muted"
                          }`}
                        >
                          {category}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Sort By</h3>
                  <Select
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value as SortOption)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sort products" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest Arrivals</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="popularity">Popularity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Mobile Filters */}
            <div className="md:hidden flex justify-between items-center mb-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Filter size={16} />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                      Narrow down products based on your preferences
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-6 space-y-6">
                    <div>
                      <h3 className="text-md font-semibold mb-3">Categories</h3>
                      <ul className="space-y-2">
                        <li>
                          <button
                            onClick={() => setSelectedCategory(null)}
                            className={`w-full text-left px-2 py-1.5 rounded-md transition-colors ${
                              selectedCategory === null
                                ? "bg-primary/10 text-primary font-medium"
                                : "hover:bg-muted"
                            }`}
                          >
                            All Products
                          </button>
                        </li>
                        {categories.map((category) => (
                          <li key={category}>
                            <button
                              onClick={() => setSelectedCategory(category)}
                              className={`w-full text-left px-2 py-1.5 rounded-md transition-colors ${
                                selectedCategory === category
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "hover:bg-muted"
                              }`}
                            >
                              {category}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-md font-semibold mb-3">Sort By</h3>
                      <Select
                        value={sortBy}
                        onValueChange={(value) => setSortBy(value as SortOption)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sort products" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Newest Arrivals</SelectItem>
                          <SelectItem value="price-low">Price: Low to High</SelectItem>
                          <SelectItem value="price-high">Price: High to Low</SelectItem>
                          <SelectItem value="popularity">Popularity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as SortOption)}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low-High</SelectItem>
                  <SelectItem value="price-high">Price: High-Low</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="mb-6 flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pl-9"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  {sortedProducts.length} products
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                  ))}
                </div>
              ) : sortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button onClick={() => {
                    setSelectedCategory(null);
                    setSearchQuery("");
                  }}>
                    View all products
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-muted py-12">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-3">Subscribe for Exclusive Deals!</h2>
            <p className="text-muted-foreground mb-6">
              Join our newsletter to receive updates on new product releases, exclusive offers, and audio tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Enter your email"
                type="email"
                className="flex-1"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductsPage;
