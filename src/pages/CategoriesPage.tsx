
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { categories } from "@/data/products";
import { Headphones, Speaker, Music, Package, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

// Map category IDs to icons
const categoryIcons: Record<string, React.ElementType> = {
  "headphones": Headphones,
  "speakers": Speaker,
  "earbuds": Music,
  "accessories": Package,
  "vinyl": Radio,
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const CategoriesPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/10">
      <Header />
      
      <main className="pt-24 pb-32">
        {/* Hero Section */}
        <section className="relative overflow-hidden mb-20">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          
          <div className="container max-w-7xl mx-auto px-4 sm:px-6">
            <div className="py-12 md:py-20 text-center relative">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Product <span className="text-gradient">Categories</span>
              </motion.h1>
              
              <motion.p 
                className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Explore our carefully curated selection of premium audio products, designed to deliver exceptional sound quality and elegant aesthetics.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="h-1 w-20 bg-primary/50 mx-auto rounded-full" />
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Categories Grid */}
        <section className="mb-24">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {categories.map((category, index) => {
                const Icon = categoryIcons[category.id] || Package;
                
                return (
                  <motion.div 
                    key={category.id}
                    variants={item}
                    whileHover={{ 
                      y: -5,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <Link 
                      to={`/products?category=${category.id}`}
                      className="block h-full"
                    >
                      <Card className={cn(
                        "h-full overflow-hidden bg-white/80 backdrop-blur-md border-white/30 shadow-soft hover:shadow-soft-lg transition-all duration-300",
                      )}>
                        <CardContent className="p-0">
                          <div className="aspect-square relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                            
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                              <div className="mb-6 p-5 rounded-full bg-primary/10 text-primary">
                                <Icon size={40} strokeWidth={1.5} />
                              </div>
                              
                              <h3 className="text-2xl font-bold mb-3">{category.name}</h3>
                              
                              <p className="text-foreground/70 mb-6">
                                {category.description || `Explore our selection of premium ${category.name.toLowerCase()}`}
                              </p>
                              
                              <span className="px-6 py-2.5 rounded-full bg-primary/10 text-primary font-medium text-sm transition-colors hover:bg-primary/20">
                                Explore Collection →
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
        
        {/* Featured Products Call-to-Action */}
        <section>
          <div className="container max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div 
              className="glass-card py-20 px-6 md:px-12 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to experience premium audio?</h2>
              <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-10">
                Discover our featured products curated for audiophiles and music enthusiasts.
              </p>
              <Link 
                to="/#featured-products" 
                className="btn-primary inline-block"
              >
                View Featured Products
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoriesPage;
