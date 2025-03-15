
import React from "react";
import { Navigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { CheckoutProvider, useCheckout } from "@/contexts/CheckoutContext";
import Checkout from "@/components/Checkout";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";

const CheckoutPageContent = () => {
  const { state, closeAuthModal, handleAuthSuccess } = useCheckout();
  
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gradient-to-b from-background to-primary/5 pt-16">
          <Checkout />
        </main>
        <Footer />
      </div>
      <AuthModal 
        isOpen={state.showAuthModal} 
        onClose={closeAuthModal}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
};

const CheckoutPage = () => {
  const { items } = useCart();

  // Redirect to products page if cart is empty
  if (items.length === 0) {
    return <Navigate to="/products" />;
  }

  return (
    <CheckoutProvider>
      <CheckoutPageContent />
    </CheckoutProvider>
  );
};

export default CheckoutPage;
