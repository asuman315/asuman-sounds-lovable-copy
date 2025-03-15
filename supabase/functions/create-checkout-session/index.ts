
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.10.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2023-10-16",
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { items, deliveryMethod, address, personalDeliveryInfo, customerId, customerEmail } = await req.json();
    
    console.log(`Creating checkout session for ${customerEmail || "guest"}`);
    console.log(`Items: ${JSON.stringify(items)}`);
    
    // Calculate order total
    const amount = items.reduce((total, item) => total + item.price * item.quantity, 0);
    
    // Format line items for Stripe
    const lineItems = items.map(item => ({
      quantity: item.quantity,
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(item.price * 100), // Convert to cents
        product_data: {
          name: item.title,
          description: item.description || '',
          images: item.imageUrl ? [item.imageUrl] : [],
        },
      },
    }));

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.get("origin")}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/checkout?canceled=true`,
      customer_email: customerEmail,
      metadata: {
        user_id: customerId || '',
        delivery_method: deliveryMethod,
        shipping_address: address ? JSON.stringify(address) : '',
        personal_delivery_info: personalDeliveryInfo ? JSON.stringify(personalDeliveryInfo) : '',
      },
    });

    return new Response(
      JSON.stringify({ 
        sessionId: session.id,
        url: session.url 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
