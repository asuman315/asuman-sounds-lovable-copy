
import { useState, useRef, useEffect } from "react";
import AnimatedElement from "./AnimatedElement";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";

// Product categories - same as in Admin.tsx
const productCategories = [
  { value: "headphones", label: "Headphones" },
  { value: "speakers", label: "Speakers" },
  { value: "earbuds", label: "Earbuds" },
  { value: "accessories", label: "Accessories" },
  { value: "new-releases", label: "New Releases" }
];

const Hero = () => {
  const { user } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const headphonesRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  
  const scrollToNext = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle mouse movement for the floating headphones
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!headphonesRef.current || !isHovering) return;
    
    const { left, top, width, height } = headphonesRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Calculate relative mouse position from center of element
    const relativeX = (e.clientX - centerX) / 15;
    const relativeY = (e.clientY - centerY) / 15;
    
    setMousePosition({ x: relativeX, y: relativeY });
  };

  return (
    <section
      id="hero"
      className="min-h-screen-dynamic flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-br from-white to-secondary/30 pt-24 md:pt-28"
      onMouseMove={handleMouseMove}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/10 to-transparent opacity-60 animate-spin-slow"></div>
        <div className="absolute top-20 right-[10%] w-20 h-20 rounded-full bg-primary/5 animate-float"></div>
        <div className="absolute bottom-32 left-[15%] w-12 h-12 rounded-full bg-primary/10 animate-pulse-slow"></div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto relative">
          <AnimatedElement animation="fade-in" delay={100}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
              Premium Audio Experience
            </span>
          </AnimatedElement>

          <AnimatedElement animation="fade-in" delay={300} className="relative">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight md:leading-tight mb-6 text-balance">
              Experience <span className="text-gradient relative">
                Sound
                <AnimatedElement 
                  animation="float" 
                  className="absolute md:-left-[500px] -z-10 opacity-80 block w-[400px] h-[400px] top-[-20px]"
                  ref={headphonesRef}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => {
                    setIsHovering(false);
                    setMousePosition({ x: 0, y: 0 });
                  }}
                >
                  <img 
                    src="/lovable-uploads/0c8ad1fb-ccf6-4eb9-a5b2-b50e2cf65dbb.png" 
                    alt="Premium headphones" 
                    className="object-contain transform"
                    style={{
                      transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) ${isHovering ? 'scale(1.05)' : ''}`,
                      transition: isHovering ? 'transform 0.1s ease-out' : 'transform 0.3s ease-out',
                    }}
                  />
                </AnimatedElement>
              </span> Like Never Before
            </h1>
          </AnimatedElement>

          <AnimatedElement animation="fade-in" delay={500}>
            <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto mb-8 text-balance">
              Asuman Sounds delivers premium audio equipment designed with precision and elegance. 
              Discover the perfect harmony of aesthetics and acoustic excellence.
            </p>
          </AnimatedElement>

          <AnimatedElement animation="fade-in" delay={700}>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link to="/products" className="btn-primary flex items-center justify-center gap-2">
                Shop Now
              </Link>
            </div>
          </AnimatedElement>
        </div>

        <AnimatedElement animation="fade-in" delay={1000} className="mt-12 md:mt-16 relative">
          <div className="relative mx-auto max-w-5xl">
            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 p-2 md:p-4 shadow-soft-lg glass-card">
              <div className="w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                <div className="relative">
                  <img 
                    src="/lovable-uploads/310ec201-7407-47d1-a118-e2bf47c2279a.png" 
                    alt="Premium headphones" 
                    className="max-w-xs md:max-w-md lg:max-w-lg mx-auto object-contain transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute -inset-8 bg-primary/10 rounded-full filter blur-xl opacity-30 animate-pulse-slow"></div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 glass-card py-3 px-6 text-foreground/90 font-medium">
              {productCategories.map((category, index) => (
                <span key={category.value} className="inline-block">
                  {category.label}
                  {index < productCategories.length - 1 && <span className="mx-2">•</span>}
                </span>
              ))}
            </div>
          </div>
        </AnimatedElement>
      </div>

      <button
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce p-2"
        aria-label="Scroll to next section"
      >
        <ChevronDown size={24} className="text-primary" />
      </button>
    </section>
  );
};

export default Hero;
