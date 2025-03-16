
import { Link } from "react-router-dom";
import { Headphones, Speaker, Music, Package, Radio } from "lucide-react";
import AnimatedElement from "./AnimatedElement";
import { categories } from "@/data/products";

// Map category IDs to icons
const categoryIcons: Record<string, React.ElementType> = {
  "headphones": Headphones,
  "speakers": Speaker,
  "earbuds": Music,
  "accessories": Package,
  "vinyl": Radio,
};

// Map category IDs to images
const categoryImages: Record<string, string> = {
  "headphones": "/lovable-uploads/0c8ad1fb-ccf6-4eb9-a5b2-b50e2cf65dbb.png",
  "speakers": "/lovable-uploads/bed0e827-0c2e-407e-bb0c-a3723f3e7388.png",
  "earbuds": "/lovable-uploads/1aa5d768-fc23-44d4-b6f7-7deef3937dbb.png",
};

const Categories = () => {
  return (
    <section id="categories" className="py-20 md:py-32 bg-white/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-secondary/20 pointer-events-none"></div>
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <AnimatedElement animation="fade-in">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
              Browse Categories
            </span>
          </AnimatedElement>
          
          <AnimatedElement animation="fade-in" delay={200}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Discover Our Collection
            </h2>
          </AnimatedElement>
          
          <AnimatedElement animation="fade-in" delay={400}>
            <p className="text-lg text-foreground/80">
              Explore our premium audio products across different categories, each designed with precision and elegance.
            </p>
          </AnimatedElement>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {categories.map((category, index) => {
            const Icon = categoryIcons[category.id] || Package;
            const hasImage = categoryImages[category.id];
            
            return (
              <AnimatedElement 
                key={category.id}
                animation="fade-in"
                delay={index * 100 + 600}
                className="group"
              >
                <Link 
                  to={`/category/${category.id}`} 
                  className="h-full"
                >
                  <div className="glass-card h-full flex flex-col items-center justify-center p-6 text-center transition-all duration-300 group-hover:shadow-soft-lg">
                    {hasImage ? (
                      <div className="mb-4 p-2 rounded-full bg-white/80 transform transition-transform duration-500 group-hover:scale-110">
                        <img 
                          src={categoryImages[category.id]} 
                          alt={`${category.name} image`} 
                          className="w-20 h-20 object-contain"
                        />
                      </div>
                    ) : (
                      <div className="mb-4 p-4 rounded-full bg-primary/10 text-primary transform transition-transform duration-500 group-hover:scale-110 group-hover:bg-primary/20">
                        <Icon size={32} />
                      </div>
                    )}
                    <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                    <span className="text-sm text-foreground/70">Explore →</span>
                    
                    {/* Decorative circles */}
                    <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </Link>
              </AnimatedElement>
            );
          })}
        </div>
        
        <AnimatedElement animation="fade-in" delay={1100} className="mt-16 text-center">
          <Link 
            to="/products" 
            className="btn-secondary inline-flex items-center gap-2 px-8 py-3 hover:shadow-soft"
          >
            View All Products
          </Link>
        </AnimatedElement>
      </div>
    </section>
  );
};

export default Categories;
