
import React, { useEffect, useRef, useState, forwardRef } from "react";
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
  
  // Use provided ref or local ref
  const elementRef = ref || localRef;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && elementRef.current) {
            observer.unobserve(elementRef.current);
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

    const currentRef = elementRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [once, threshold, elementRef]);

  return (
    <div
      ref={elementRef}
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
