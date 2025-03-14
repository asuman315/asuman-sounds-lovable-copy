
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedElementProps {
  children: React.ReactNode;
  animation: "fade-in" | "fade-in-left" | "fade-in-right" | "scale-in" | "float" | "pulse-slow";
  delay?: number;
  className?: string;
  threshold?: number;
  once?: boolean;
}

const AnimatedElement = ({
  children,
  animation,
  delay = 0,
  className,
  threshold = 0.1,
  once = true,
}: AnimatedElementProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
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

    const currentRef = ref.current;
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
      ref={ref}
      className={cn(
        isVisible ? `animate-${animation}` : "opacity-0",
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: "forwards",
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedElement;
