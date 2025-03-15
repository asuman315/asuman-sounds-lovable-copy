
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, User, LogOut, LogIn, UserPlus, PlusCircle, ShoppingBag, ShoppingCart } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CartDropdown from "@/components/CartDropdown";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Add console logs to debug
  console.log("Header rendering, user state:", !!user);
  console.log("User object:", user);

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

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
    setIsCartOpen(false);
    document.body.style.overflow = "";
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = isMobileMenuOpen ? "" : "hidden";
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const scrollTo = (id: string) => {
    // Only use scroll behavior on homepage
    if (location.pathname !== "/") {
      navigate("/");
      // We need to wait for navigation to complete before scrolling
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 80,
            behavior: "smooth",
          });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 80,
          behavior: "smooth",
        });
      }
    }
    setIsMobileMenuOpen(false);
    document.body.style.overflow = "";
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navItems = [
    { name: "Home", href: "hero", isPage: false },
    { name: "Products", href: "/products", isPage: true },
    { name: "Features", href: "features", isPage: false },
    { name: "Team", href: "team", isPage: false },
    { name: "Contact", href: "contact", isPage: false },
  ];

  // Log authentication components being rendered
  console.log("Auth components rendering - user status:", user ? "logged in" : "logged out");
  console.log("Rendering header with links for admin:", user ? "showing add product" : "not showing");

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-4 md:px-8",
        isScrolled
          ? "bg-white/70 backdrop-blur-md shadow-sm text-foreground"
          : "bg-primary/10 backdrop-blur-sm text-foreground" // Changed to be visible before scrolling
      )}
    >
      <div className="container max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className={cn("font-bold text-xl", 
              isScrolled ? "text-gradient" : "text-foreground")}>
              Asuman Sounds
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            item.isPage ? (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors relative group",
                  isScrolled ? "text-foreground/80 hover:text-primary" : "text-foreground/90 hover:text-primary"
                )}
              >
                {item.name}
                <span className={cn(
                  "absolute bottom-[-4px] left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full",
                  isScrolled ? "bg-primary" : "bg-primary"
                )}></span>
              </Link>
            ) : (
              <button
                key={item.name}
                onClick={() => scrollTo(item.href)}
                className={cn(
                  "text-sm font-medium transition-colors relative group",
                  isScrolled ? "text-foreground/80 hover:text-primary" : "text-foreground/90 hover:text-primary"
                )}
              >
                {item.name}
                <span className={cn(
                  "absolute bottom-[-4px] left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full",
                  isScrolled ? "bg-primary" : "bg-primary"
                )}></span>
              </button>
            )
          ))}
        </nav>

        {/* Authentication Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className={cn(
                  "flex items-center gap-1 transition-all duration-300",
                  isScrolled ? 
                    "hover:bg-primary/10" : 
                    "hover:bg-primary/10 bg-transparent"
                )}
                asChild
              >
                <Link to="/admin">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  <span className="font-medium">Add Product</span>
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={cn(
                      "relative rounded-full",
                      !isScrolled && "hover:bg-primary/10 bg-transparent"
                    )}
                  >
                    <User size={18} />
                    <span className="ml-2">Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* Log when rendering sign-in/sign-up buttons */}
              {console.log("Rendering sign-in/sign-up buttons")}
              <Button 
                variant="outline" 
                size="sm" 
                className={cn(
                  "flex items-center gap-1",
                  !isScrolled && "hover:bg-primary/10 bg-transparent"
                )} 
                asChild
              >
                <Link to="/login">
                  <LogIn className="h-4 w-4 mr-1" />
                  Sign In
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className={cn(
                  "flex items-center gap-1",
                  !isScrolled && "hover:bg-primary/10 bg-transparent"
                )} 
                asChild
              >
                <Link to="/signup">
                  <UserPlus className="h-4 w-4 mr-1" />
                  Sign Up
                </Link>
              </Button>
            </>
          )}
          
          {/* Cart button */}
          <button 
            className={cn(
              "relative p-2 rounded-full transition-all duration-300 hover:bg-primary/10",
              isScrolled ? "text-foreground" : "text-foreground"
            )}
            onClick={toggleCart}
            aria-label="Open cart"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium shadow-md transition-all duration-300 animate-scale-in">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>
          
          <Button 
            className={cn(
              "hidden md:flex items-center transition-all duration-300",
              isScrolled ? 
                "bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700" : 
                "bg-primary/80 text-white hover:bg-primary"
            )}
            asChild
          >
            <Link to="/products">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Shop Now
            </Link>
          </Button>
        </div>

        {/* Mobile Navigation Toggle & Cart Icon */}
        <div className="flex items-center gap-4 md:hidden">
          {/* Mobile Cart Button */}
          <button 
            className={cn(
              "relative p-1 transition-all duration-300",
              isScrolled ? "text-foreground" : "text-foreground"
            )}
            onClick={toggleCart}
            aria-label="Open cart"
          >
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium shadow-md">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>
          
          {/* Mobile Menu Toggle */}
          <button
            className={cn(
              "p-1",
              isScrolled ? "text-foreground" : "text-foreground"
            )}
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
            item.isPage ? (
              <Link
                key={item.name}
                to={item.href}
                className="text-xl font-medium py-2 border-b border-gray-100"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  document.body.style.overflow = "";
                }}
              >
                {item.name}
              </Link>
            ) : (
              <button
                key={item.name}
                onClick={() => scrollTo(item.href)}
                className="text-xl font-medium py-2 border-b border-gray-100"
              >
                {item.name}
              </button>
            )
          ))}
          
          {user ? (
            <>
              <Link
                to="/admin"
                className="text-xl font-medium py-2 border-b border-gray-100 flex items-center"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  document.body.style.overflow = "";
                }}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Add Product
              </Link>
              <button
                onClick={handleSignOut}
                className="text-xl font-medium py-2 border-b border-gray-100 flex items-center"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              {/* Log when rendering mobile sign-in/sign-up links */}
              {console.log("Rendering mobile sign-in/sign-up links")}
              <Link
                to="/login"
                className="text-xl font-medium py-2 border-b border-gray-100 flex items-center"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  document.body.style.overflow = "";
                }}
              >
                <LogIn className="mr-2 h-5 w-5" />
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-xl font-medium py-2 border-b border-gray-100 flex items-center"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  document.body.style.overflow = "";
                }}
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Sign Up
              </Link>
            </>
          )}
          
          <Link
            to="/products"
            className="btn-primary mt-auto mb-8 flex items-center justify-center gap-2"
            onClick={() => {
              setIsMobileMenuOpen(false);
              document.body.style.overflow = "";
            }}
          >
            <ShoppingBag className="h-5 w-5" />
            Shop Now
          </Link>
        </div>
      </div>
      
      {/* Cart Dropdown */}
      <CartDropdown isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Header;
