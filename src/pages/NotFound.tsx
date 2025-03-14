
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import AnimatedElement from "@/components/AnimatedElement";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
      <div className="glass-card p-8 max-w-md w-full text-center">
        <AnimatedElement animation="fade-in">
          <span className="inline-block text-5xl mb-6">404</span>
        </AnimatedElement>
        
        <AnimatedElement animation="fade-in" delay={200}>
          <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
        </AnimatedElement>
        
        <AnimatedElement animation="fade-in" delay={400}>
          <p className="text-foreground/80 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </AnimatedElement>
        
        <AnimatedElement animation="fade-in" delay={600}>
          <a 
            href="/" 
            className="btn-primary inline-flex items-center"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Home
          </a>
        </AnimatedElement>
      </div>
    </div>
  );
};

export default NotFound;
