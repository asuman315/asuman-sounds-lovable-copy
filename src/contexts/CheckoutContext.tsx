import React, { createContext, useContext, useState } from "react";
import { useCart } from "./CartContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

type DeliveryMethod = "personal" | "shipping";
type PaymentMethod = "stripe" | "cod";
type DeliveryTime = "morning" | "afternoon" | "evening" | "any";

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface PersonalDeliveryInfo {
  fullName: string;
  phoneNumber: string;
  district: string;
  email?: string;
  cityOrTown?: string;
  preferredTime: DeliveryTime;
}

interface CheckoutState {
  deliveryMethod: DeliveryMethod | null;
  paymentMethod: PaymentMethod | null;
  address: Address | null;
  personalDeliveryInfo: PersonalDeliveryInfo | null;
  isProcessing: boolean;
  showAuthModal: boolean;
}

interface CheckoutContextType {
  state: CheckoutState;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setAddress: (address: Address) => void;
  setPersonalDeliveryInfo: (info: PersonalDeliveryInfo) => void;
  processCheckout: () => Promise<void>;
  resetCheckout: () => void;
  closeAuthModal: () => void;
  handleAuthSuccess: () => void;
}

const initialState: CheckoutState = {
  deliveryMethod: null,
  paymentMethod: null,
  address: null,
  personalDeliveryInfo: null,
  isProcessing: false,
  showAuthModal: false,
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CheckoutState>(initialState);
  const { clearCart, items, totalPrice } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();

  const setDeliveryMethod = (method: DeliveryMethod) => {
    setState((prev) => ({ ...prev, deliveryMethod: method }));
    
    if (method === "personal") {
      setState((prev) => ({ ...prev, deliveryMethod: method, paymentMethod: "cod" }));
    } else {
      setState((prev) => ({ ...prev, deliveryMethod: method }));
    }
  };

  const setPaymentMethod = (method: PaymentMethod) => {
    setState((prev) => ({ ...prev, paymentMethod: method }));
  };

  const setAddress = (address: Address) => {
    setState((prev) => ({ ...prev, address }));
  };

  const setPersonalDeliveryInfo = (personalDeliveryInfo: PersonalDeliveryInfo) => {
    setState((prev) => ({ ...prev, personalDeliveryInfo }));
  };

  const sendOrderNotification = async () => {
    try {
      if (state.deliveryMethod === "personal" && state.personalDeliveryInfo) {
        const orderItems = items.map(item => 
          `${item.product.title} (${item.quantity}) - $${(item.product.price * item.quantity).toFixed(2)}`
        ).join('\n');
        
        const itemsDetails = items.map(item => ({
          title: item.product.title,
          quantity: item.quantity,
          price: item.product.price,
          imageUrl: item.product.images && item.product.images.length > 0 
            ? item.product.images[0].image_url 
            : null
        }));
        
        const preferredTimeString = 
          state.personalDeliveryInfo.preferredTime === "morning" ? "Morning (8AM - 12PM)" :
          state.personalDeliveryInfo.preferredTime === "afternoon" ? "Afternoon (12PM - 5PM)" :
          state.personalDeliveryInfo.preferredTime === "evening" ? "Evening (5PM - 9PM)" : "Any Time";
        
        const messageDetails = {
          customer: state.personalDeliveryInfo.fullName,
          phoneNumber: state.personalDeliveryInfo.phoneNumber,
          district: state.personalDeliveryInfo.district,
          cityOrTown: state.personalDeliveryInfo.cityOrTown || "Not specified",
          preferredTime: preferredTimeString,
          email: state.personalDeliveryInfo.email || "",
          items: orderItems,
          itemsDetails: itemsDetails,
          totalAmount: `$${totalPrice.toFixed(2)}`,
        };
        
        const { data, error } = await supabase.functions.invoke('send-order-notification', {
          body: messageDetails
        });
        
        if (error) {
          console.error("Error sending order notification:", error);
          throw new Error(error.message);
        }
        
        console.log("Order notification sent successfully:", data);
      }
    } catch (error) {
      console.error("Error sending order notification:", error);
    }
  };

  const closeAuthModal = () => {
    setState(prev => ({ ...prev, showAuthModal: false }));
  };

  const handleAuthSuccess = () => {
    closeAuthModal();
    processCheckoutAfterAuth();
  };

  const createStripeCheckoutSession = async () => {
    try {
      const formattedItems = items.map(item => ({
        title: item.product.title,
        quantity: item.quantity,
        price: item.product.price,
        description: item.product.description,
        imageUrl: item.product.images && item.product.images.length > 0 
          ? item.product.images[0].image_url 
          : null
      }));
      
      const checkoutData = {
        items: formattedItems,
        deliveryMethod: state.deliveryMethod,
        address: state.address,
        personalDeliveryInfo: state.personalDeliveryInfo,
        customerId: user?.id || null,
        customerEmail: user?.email || state.personalDeliveryInfo?.email || null,
      };
      
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: checkoutData
      });
      
      if (error) {
        console.error("Error creating Stripe checkout session:", error);
        throw new Error(error.message);
      }
      
      console.log("Checkout session created:", data);
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned from Stripe");
      }
    } catch (error) {
      console.error("Error creating Stripe checkout session:", error);
      throw error;
    }
  };

  const processCheckoutAfterAuth = async () => {
    setState((prev) => ({ ...prev, isProcessing: true }));
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (state.paymentMethod === "stripe") {
        await createStripeCheckoutSession();
        return;
      }
      
      if (state.deliveryMethod === "personal" && state.paymentMethod === "cod") {
        await sendOrderNotification();
      }
      
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase. Your order has been placed.",
        variant: "default",
      });
      
      clearCart();
      resetCheckout();
    } catch (error) {
      console.error("Error processing checkout:", error);
      toast({
        title: "Checkout failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setState((prev) => ({ ...prev, isProcessing: false }));
    }
  };

  const processCheckout = async () => {
    if (state.paymentMethod === "stripe" && !user) {
      setState(prev => ({ ...prev, showAuthModal: true }));
      return;
    }
    
    processCheckoutAfterAuth();
  };

  const resetCheckout = () => {
    setState(initialState);
  };

  return (
    <CheckoutContext.Provider
      value={{
        state,
        setDeliveryMethod,
        setPaymentMethod,
        setAddress,
        setPersonalDeliveryInfo,
        processCheckout,
        resetCheckout,
        closeAuthModal,
        handleAuthSuccess,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
};
