
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.10.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.9";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2023-10-16",
});

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
const supabase = createClient(supabaseUrl, supabaseKey);

// This is your Stripe webhook endpoint secret
const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  
  if (!signature) {
    return new Response("No signature provided", { status: 400 });
  }

  try {
    const body = await req.text();
    let event;
    
    // Verify webhook signature
    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      console.error(`⚠️ Webhook signature verification failed.`, err.message);
      return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 });
    }

    console.log(`Event received: ${event.type}`);
    
    // Handle specific event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // Extract metadata
        const { user_id, delivery_method, shipping_address, personal_delivery_info } = session.metadata || {};
        
        // Fetch checkout session to get line items
        const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['line_items', 'line_items.data.price.product'],
        });
        
        // Format items from line items
        const items = expandedSession.line_items.data.map(item => {
          const product = item.price.product;
          return {
            title: product.name,
            quantity: item.quantity,
            price: item.price.unit_amount / 100, // Convert from cents
            description: product.description || '',
            images: product.images || [],
          };
        });
        
        // Parse address or personal delivery info
        const parsedShippingAddress = shipping_address ? JSON.parse(shipping_address) : null;
        const parsedPersonalDeliveryInfo = personal_delivery_info ? JSON.parse(personal_delivery_info) : null;
        
        // Insert order record in database
        const { data: order, error } = await supabase.from('orders').insert({
          user_id: user_id || null,
          customer_email: session.customer_details?.email || null,
          customer_name: session.customer_details?.name || null,
          amount: session.amount_total / 100, // Convert from cents
          currency: session.currency,
          payment_status: 'paid',
          delivery_method,
          shipping_address: parsedShippingAddress,
          personal_delivery_info: parsedPersonalDeliveryInfo,
          items,
          checkout_session_id: session.id,
        }).select().single();
        
        if (error) {
          console.error("Error inserting order:", error);
          throw error;
        }
        
        console.log(`Order ${order.id} created successfully.`);
        break;
      }
      
      case 'checkout.session.expired': {
        // Handle expired checkout sessions if needed
        console.log('Checkout session expired');
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return new Response(`Webhook error: ${error.message}`, { status: 500 });
  }
});
