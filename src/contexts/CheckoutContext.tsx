
import React, { createContext, useContext, useState } from "react";
import { useCart } from "./CartContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
}

interface CheckoutContextType {
  state: CheckoutState;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setAddress: (address: Address) => void;
  setPersonalDeliveryInfo: (info: PersonalDeliveryInfo) => void;
  processCheckout: () => Promise<void>;
  resetCheckout: () => void;
}

const initialState: CheckoutState = {
  deliveryMethod: null,
  paymentMethod: null,
  address: null,
  personalDeliveryInfo: null,
  isProcessing: false,
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CheckoutState>(initialState);
  const { clearCart, items, totalPrice } = useCart();
  const { toast } = useToast();

  const setDeliveryMethod = (method: DeliveryMethod) => {
    setState((prev) => ({ ...prev, deliveryMethod: method }));
    
    // If switching to personal delivery, set payment method to COD by default
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
        // Format order details
        const orderItems = items.map(item => 
          `${item.product.title} (${item.quantity}) - $${(item.product.price * item.quantity).toFixed(2)}`
        ).join('\n');
        
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
          items: orderItems,
          totalAmount: `$${totalPrice.toFixed(2)}`,
        };
        
        // Send the order details via Supabase edge function
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
      // Don't throw here - we want the checkout to complete even if notification fails
    }
  };

  const processCheckout = async () => {
    setState((prev) => ({ ...prev, isProcessing: true }));
    
    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // If personal delivery, send notification
      if (state.deliveryMethod === "personal") {
        await sendOrderNotification();
      }
      
      // In a real app, you would process the payment and order here
      // For now, just show a success message and clear the cart
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
