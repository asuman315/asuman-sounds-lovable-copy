
import AnimatedElement from "./AnimatedElement";
import { ChevronDown } from "lucide-react";

const Hero = () => {
  const scrollToNext = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="min-h-screen-dynamic flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-br from-white to-secondary/30 pt-24 md:pt-28"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/10 to-transparent opacity-60 animate-spin-slow"></div>
        <div className="absolute top-20 right-[10%] w-20 h-20 rounded-full bg-primary/5 animate-float"></div>
        <div className="absolute bottom-32 left-[15%] w-12 h-12 rounded-full bg-primary/10 animate-pulse-slow"></div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <AnimatedElement animation="fade-in" delay={100}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
              Premium Audio Experience
            </span>
          </AnimatedElement>

          <AnimatedElement animation="fade-in" delay={300}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight md:leading-tight mb-6 text-balance">
              Experience <span className="text-gradient">Sound</span> Like Never Before
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
              <button className="btn-primary">
                Shop Collection
              </button>
              <button className="btn-secondary">
                Learn More
              </button>
            </div>
          </AnimatedElement>
        </div>

        <AnimatedElement animation="fade-in" delay={1000} className="mt-12 md:mt-16 relative">
          <div className="relative mx-auto max-w-5xl">
            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 p-2 md:p-4 shadow-soft-lg glass-card">
              <div className="w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                <div className="relative">
                  <img 
                    src="/lovable-uploads/dda80657-f174-4543-a9c9-c0216afa2891.png" 
                    alt="Premium blue headphones" 
                    className="max-w-xs md:max-w-md lg:max-w-lg mx-auto object-contain transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute -inset-8 bg-primary/10 rounded-full filter blur-xl opacity-30 animate-pulse-slow"></div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 glass-card py-3 px-6 text-foreground/90 font-medium">
              Premium Headphones • Speakers • Earbuds
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
