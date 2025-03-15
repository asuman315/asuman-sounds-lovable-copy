import React, { useState } from "react";
import { motion } from "framer-motion";
import { Truck, CreditCard, Check, ArrowRight, Home, MapPin, Clock, Phone, Mail, User, ShoppingBag } from "lucide-react";
import { useCheckout } from "@/contexts/CheckoutContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AnimatedElement from "@/components/AnimatedElement";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const addressSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "ZIP code is required"),
  country: z.string().min(1, "Country is required"),
});

const personalDeliverySchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  district: z.string().min(1, "District is required"),
  email: z.string().email("Invalid email address").optional(),
  cityOrTown: z.string().optional(),
  preferredTime: z.enum(["morning", "afternoon", "evening", "any"]),
});

type AddressForm = z.infer<typeof addressSchema>;
type PersonalDeliveryForm = z.infer<typeof personalDeliverySchema>;

const Checkout = () => {
  const { state, setDeliveryMethod, setPaymentMethod, setAddress, setPersonalDeliveryInfo, processCheckout } = useCheckout();
  const { items, totalPrice } = useCart();
  const [step, setStep] = useState<"options" | "address" | "personal" | "summary">("options");
  
  const addressForm = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
  });

  const personalDeliveryForm = useForm<PersonalDeliveryForm>({
    resolver: zodResolver(personalDeliverySchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      district: "",
      email: "",
      cityOrTown: "",
      preferredTime: "any",
    },
  });

  const handleDeliverySelect = (method: "personal" | "shipping") => {
    setDeliveryMethod(method);
    setStep(method === "personal" ? "personal" : "address");
  };

  const handlePaymentSelect = (method: "stripe" | "cod") => {
    setPaymentMethod(method);
    
    if (method === "stripe") {
      // In a real application, you would redirect to Stripe here
      // For now, just simulate a payment process
      setStep("summary");
    } else {
      setStep("summary");
    }
  };

  const onAddressSubmit = (data: AddressForm) => {
    // Now we're passing a complete address object that matches the required type
    setAddress({
      street: data.street,
      city: data.city,
      state: data.state,
      zip: data.zip,
      country: data.country
    });
    setStep("summary");
  };

  const onPersonalDeliverySubmit = (data: PersonalDeliveryForm) => {
    setPersonalDeliveryInfo({
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      district: data.district,
      email: data.email,
      cityOrTown: data.cityOrTown,
      preferredTime: data.preferredTime
    });
    setStep("summary");
  };

  const handleCheckout = () => {
    processCheckout();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2 
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const renderOptions = () => (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto mt-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <Card className="h-full backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Truck className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Personal Delivery</CardTitle>
            <CardDescription>Get your order delivered to your doorstep by our delivery personnel</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-primary" />
                <span>Fast local delivery</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-primary" />
                <span>Track your order in real-time</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-primary" />
                <span>Contact delivery personnel directly</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-primary" />
                <span>Pay on delivery</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-gradient-to-r from-primary to-blue-600"
              onClick={() => handleDeliverySelect("personal")}
            >
              Select Personal Delivery
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="h-full backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Pay with Stripe</CardTitle>
            <CardDescription>Secure payment processing with Stripe</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-primary" />
                <span>Fast and secure checkout</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-primary" />
                <span>Save your payment methods</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-primary" />
                <span>Encrypted transaction data</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-gradient-to-r from-primary to-blue-600"
              onClick={() => handlePaymentSelect("stripe")}
            >
              Proceed to Stripe Payment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );

  const renderAddressForm = () => (
    <AnimatedElement animation="fade-in" className="w-full max-w-2xl mx-auto mt-8">
      <Card className="backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-800 shadow-lg">
        <CardHeader>
          <div className="flex items-center mb-2">
            <MapPin className="w-5 h-5 mr-2 text-primary" />
            <CardTitle>Delivery Address</CardTitle>
          </div>
          <CardDescription>Enter your delivery details</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...addressForm}>
            <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-4">
              <FormField
                control={addressForm.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="1234 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addressForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addressForm.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addressForm.control}
                  name="zip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP Code</FormLabel>
                      <FormControl>
                        <Input placeholder="12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addressForm.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep("options")}
                  className="mr-2"
                >
                  Back
                </Button>
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-primary to-blue-600"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AnimatedElement>
  );

  const renderPersonalDeliveryForm = () => (
    <AnimatedElement animation="fade-in" className="w-full max-w-2xl mx-auto mt-8">
      <Card className="backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-800 shadow-lg">
        <CardHeader>
          <div className="flex items-center mb-2">
            <Truck className="w-5 h-5 mr-2 text-primary" />
            <CardTitle>Personal Delivery Information</CardTitle>
          </div>
          <CardDescription>Enter your contact information for personal delivery</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...personalDeliveryForm}>
            <form onSubmit={personalDeliveryForm.handleSubmit(onPersonalDeliverySubmit)} className="space-y-4">
              <FormField
                control={personalDeliveryForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name*</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="John Doe" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={personalDeliveryForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number*</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="+1 (555) 123-4567" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={personalDeliveryForm.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District*</FormLabel>
                    <FormControl>
                      <Input placeholder="Your district" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={personalDeliveryForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="example@email.com" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={personalDeliveryForm.control}
                  name="cityOrTown"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City/Town (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Your city or town" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={personalDeliveryForm.control}
                name="preferredTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Delivery Time*</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <SelectValue placeholder="Select preferred time" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                          <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                          <SelectItem value="evening">Evening (5PM - 9PM)</SelectItem>
                          <SelectItem value="any">Any Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep("options")}
                  className="mr-2"
                >
                  Back
                </Button>
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-primary to-blue-600"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AnimatedElement>
  );

  const renderSummary = () => (
    <AnimatedElement animation="fade-in" className="w-full max-w-3xl mx-auto mt-8">
      <Card glass className="overflow-hidden border-0 ring-1 ring-black/5 dark:ring-white/10 shadow-soft-lg">
        <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="font-medium text-2xl">Order Summary</CardTitle>
          </div>
          <CardDescription className="text-base text-gray-500 dark:text-gray-400">
            Review your order details before completing checkout
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="grid md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-800">
            {/* Order details section - 3/5 width on desktop */}
            <div className="p-6 md:col-span-3 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Order Details
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    {state.deliveryMethod === "personal" ? (
                      <>
                        <Truck className="w-5 h-5 mr-3 text-primary" />
                        <div>
                          <span className="font-medium">Personal Delivery</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            Direct delivery to your location
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Home className="w-5 h-5 mr-3 text-primary" />
                        <div>
                          <span className="font-medium">Shipping</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            Standard delivery service
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    {state.paymentMethod === "cod" ? (
                      <>
                        <ShoppingBag className="w-5 h-5 mr-3 text-primary" />
                        <div>
                          <span className="font-medium">Pay on Delivery</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            Pay when your order arrives
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-3 text-primary" />
                        <div>
                          <span className="font-medium">Stripe Payment</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            Secure online payment
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {state.personalDeliveryInfo && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Contact Information
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-2">
                    <div className="flex">
                      <User className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">
                          {state.personalDeliveryInfo.fullName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {state.personalDeliveryInfo.district}
                          {state.personalDeliveryInfo.cityOrTown && `, ${state.personalDeliveryInfo.cityOrTown}`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <Phone className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                      <p className="text-sm">{state.personalDeliveryInfo.phoneNumber}</p>
                    </div>
                    
                    {state.personalDeliveryInfo.email && (
                      <div className="flex">
                        <Mail className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                        <p className="text-sm">{state.personalDeliveryInfo.email}</p>
                      </div>
                    )}
                    
                    <div className="flex">
                      <Clock className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                      <p className="text-sm">
                        {state.personalDeliveryInfo.preferredTime === "morning" ? "Morning (8AM - 12PM)" :
                        state.personalDeliveryInfo.preferredTime === "afternoon" ? "Afternoon (12PM - 5PM)" :
                        state.personalDeliveryInfo.preferredTime === "evening" ? "Evening (5PM - 9PM)" : "Any Time"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {state.address && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Shipping Address
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                    <div className="flex">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm">{state.address.street}</p>
                        <p className="text-sm">{state.address.city}, {state.address.state} {state.address.zip}</p>
                        <p className="text-sm">{state.address.country}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Order items and price section - 2/5 width on desktop */}
            <div className="p-6 md:col-span-2 bg-gray-50/50 dark:bg-gray-900/30">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                Order Items
              </h3>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex space-x-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0 p-1 shadow-sm border border-gray-100 dark:border-gray-800">
                      {item.product.images && item.product.images.length > 0 && (
                        <img 
                          src={item.product.images[0].image_url} 
                          alt={item.product.title} 
                          className="w-full h-full object-cover rounded"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{item.product.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-gray-500">${item.product.price.toFixed(2)} each</p>
                        <p className="text-sm font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-medium text-base pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span>Total</span>
                  <span className="text-primary">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => setStep("options")}
            className="rounded-full px-4 border-gray-200 hover:bg-gray-50"
          >
            Change Options
          </Button>
          <Button 
            className="rounded-full px-6 bg-gradient-to-r from-primary to-blue-600 hover:shadow-md transition-all duration-300"
            onClick={handleCheckout}
            disabled={state.isProcessing}
          >
            {state.isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                Complete Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </AnimatedElement>
  );

  const renderContent = () => {
    switch (step) {
      case "options":
        return renderOptions();
      case "address":
        return renderAddressForm();
      case "personal":
        return renderPersonalDeliveryForm();
      case "summary":
        return renderSummary();
      default:
        return renderOptions();
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-12">
      <AnimatedElement animation="fade-in" className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">
          Complete Your Purchase
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose your preferred delivery and payment options to finalize your order.
        </p>
      </AnimatedElement>
      
      {renderContent()}
    </div>
  );
};

export default Checkout;
