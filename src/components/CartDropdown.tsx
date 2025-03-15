
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDropdown = ({ isOpen, onClose }: CartDropdownProps) => {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Cart dropdown */}
          <motion.div
            className="fixed top-16 right-4 w-[90vw] max-w-md z-50 rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-800 shadow-lg rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold flex items-center">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Your Cart ({totalItems})
                </h3>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Close cart"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="max-h-[60vh] overflow-y-auto">
                {items.length === 0 ? (
                  <div className="p-6 text-center">
                    <ShoppingBag className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Your cart is empty</p>
                    <Button 
                      className="bg-gradient-to-r from-primary to-blue-600"
                      onClick={onClose}
                      asChild
                    >
                      <Link to="/products">
                        Start Shopping
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                    {items.map((item) => (
                      <motion.li
                        key={item.product.id}
                        className="p-4 flex gap-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Product image */}
                        <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                          <img
                            src={item.product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'}
                            alt={item.product.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        
                        {/* Product details */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.product.title}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency', 
                              currency: item.product.currency || 'USD'
                            }).format(item.product.price)} x {item.quantity}
                          </p>
                          
                          {/* Quantity controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors ml-auto"
                              aria-label="Remove item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>
              
              {items.length > 0 && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium">Total</span>
                    <span className="text-lg font-semibold">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(totalPrice)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 transition-colors"
                      onClick={handleCheckout}
                    >
                      Checkout
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDropdown;
