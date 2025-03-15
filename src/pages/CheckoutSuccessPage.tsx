
import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { CheckIcon, ShoppingBagIcon, ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AnimatedElement from "@/components/AnimatedElement";

const CheckoutSuccessPage = () => {
  const location = useLocation();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get the session_id from URL query parameters
    const params = new URLSearchParams(location.search);
    const session = params.get("session_id");
    
    if (session) {
      setSessionId(session);
      fetchOrderDetails(session);
    } else {
      setLoading(false);
    }
  }, [location]);

  const fetchOrderDetails = async (session_id: string) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("checkout_session_id", session_id)
        .single();

      if (error) {
        console.error("Error fetching order:", error);
        toast({
          title: "Error fetching order details",
          description: "We couldn't retrieve your order information. Please contact support.",
          variant: "destructive",
        });
      } else if (data) {
        setOrderDetails(data);
      }
    } catch (error) {
      console.error("Error in fetch order operation:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gradient-to-b from-background to-primary/5 pt-16">
        <div className="container max-w-4xl mx-auto px-4 py-12">
          <AnimatedElement animation="fade-in" className="text-center mb-8">
            {sessionId ? (
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <CheckIcon className="w-8 h-8 text-green-500" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">Payment Successful!</h1>
                <p className="text-muted-foreground">
                  Thank you for your purchase. Your order has been processed successfully.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBagIcon className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">Order Confirmation</h1>
                <p className="text-muted-foreground">
                  Your recent order status is shown below.
                </p>
              </div>
            )}
          </AnimatedElement>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : orderDetails ? (
            <AnimatedElement animation="fade-in" className="mt-8">
              <Card className="overflow-hidden border-0 ring-1 ring-black/5 dark:ring-white/10 shadow-lg">
                <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
                  <CardTitle className="font-medium">Order Details</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                      Items Purchased
                    </h3>
                    <div className="space-y-4">
                      {orderDetails.items.map((item: any, index: number) => (
                        <div key={index} className="flex space-x-3">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0 p-1 shadow-sm border border-gray-100 dark:border-gray-800">
                            {item.images && item.images.length > 0 ? (
                              <img 
                                src={item.images[0]} 
                                alt={item.title} 
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <ShoppingBagIcon className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium truncate">{item.title}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                            <div className="flex justify-between items-center mt-1">
                              <p className="text-xs text-gray-500">${item.price.toFixed(2)} each</p>
                              <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                      Order Summary
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Order ID</span>
                        <span className="font-mono">{orderDetails.id.substring(0, 8)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Date</span>
                        <span>{new Date(orderDetails.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Payment Status</span>
                        <span className="capitalize">{orderDetails.payment_status}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Delivery Method</span>
                        <span className="capitalize">{orderDetails.delivery_method}</span>
                      </div>
                      <div className="flex justify-between font-medium text-base pt-2 border-t border-gray-100 dark:border-gray-800">
                        <span>Total</span>
                        <span className="text-primary">${orderDetails.amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-center">
                  <Button 
                    className="bg-gradient-to-r from-primary to-blue-600"
                    asChild
                  >
                    <Link to="/products">
                      <ArrowLeftIcon className="mr-2 h-4 w-4" />
                      Continue Shopping
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </AnimatedElement>
          ) : (
            <AnimatedElement animation="fade-in" className="text-center py-12">
              <p className="text-muted-foreground mb-6">No order details found. If you just placed an order, it may take a moment to process.</p>
              <Button 
                className="bg-gradient-to-r from-primary to-blue-600"
                asChild
              >
                <Link to="/products">
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
            </AnimatedElement>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutSuccessPage;
