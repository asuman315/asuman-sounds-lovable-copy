
import React, { useEffect, useRef, useState, forwardRef, ForwardedRef } from "react";
import { cn } from "@/lib/utils";

interface AnimatedElementProps {
  children: React.ReactNode;
  animation: "fade-in" | "fade-in-left" | "fade-in-right" | "scale-in" | "float" | "pulse-slow";
  delay?: number;
  className?: string;
  threshold?: number;
  once?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const AnimatedElement = forwardRef<HTMLDivElement, AnimatedElementProps>(({
  children,
  animation,
  delay = 0,
  className,
  threshold = 0.1,
  once = true,
  onMouseEnter,
  onMouseLeave,
}, ref) => {
  const localRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Combine the forwarded ref with our local ref
  const setRefs = (element: HTMLDivElement | null) => {
    // Update internal ref
    if (localRef) {
      (localRef as React.MutableRefObject<HTMLDivElement | null>).current = element;
    }
    
    // Forward the ref
    if (typeof ref === 'function') {
      ref(element);
    } else if (ref) {
      ref.current = element;
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && localRef.current) {
            observer.unobserve(localRef.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    const currentRef = localRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [once, threshold]);

  return (
    <div
      ref={setRefs}
      className={cn(
        isVisible ? `animate-${animation}` : "opacity-0",
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: "forwards",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
});

AnimatedElement.displayName = "AnimatedElement";

export default AnimatedElement;
