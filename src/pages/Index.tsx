
import { useEffect, useRef } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Team from "@/components/Team";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initAnimations = () => {
      const revealElements = document.querySelectorAll(
        ".reveal-down, .reveal-left, .reveal-right"
      );

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("reveal-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      revealElements.forEach((el) => {
        observer.observe(el);
      });
    };

    if (pageRef.current) {
      initAnimations();
    }
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <Features />
        <Team />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
