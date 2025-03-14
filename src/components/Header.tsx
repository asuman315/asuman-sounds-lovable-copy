
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = isMobileMenuOpen ? "" : "hidden";
  };

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
      setIsMobileMenuOpen(false);
      document.body.style.overflow = "";
    }
  };

  const navItems = [
    { name: "Home", href: "hero" },
    { name: "Features", href: "features" },
    { name: "Team", href: "team" },
    { name: "Contact", href: "contact" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-4 md:px-8",
        isScrolled
          ? "bg-white/70 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <a href="#hero" className="flex items-center space-x-2">
            <span className="text-gradient font-bold text-xl">Asuman Sounds</span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollTo(item.href)}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group"
            >
              {item.name}
              <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
            </button>
          ))}
        </nav>

        <button className="hidden md:block btn-primary">Shop Now</button>

        {/* Mobile Navigation Toggle */}
        <button
          className="md:hidden text-foreground p-1"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X size={24} className="transition-transform duration-300" />
          ) : (
            <Menu size={24} className="transition-transform duration-300" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "fixed inset-0 bg-white z-40 transition-transform duration-300 md:hidden",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="h-full flex flex-col pt-24 px-6 space-y-8">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollTo(item.href)}
              className="text-xl font-medium py-2 border-b border-gray-100"
            >
              {item.name}
            </button>
          ))}
          <button className="btn-primary mt-auto mb-8">Shop Now</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
