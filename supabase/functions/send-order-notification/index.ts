
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { to, customer, phoneNumber, district, cityOrTown, preferredTime, items, totalAmount } = await req.json();

    console.log(`Sending order notification to ${to}`);
    console.log(`Order details: Customer: ${customer}, Phone: ${phoneNumber}, District: ${district}`);
    console.log(`Items: ${items}`);
    
    // In a real implementation, you would integrate with an SMS service like Twilio here
    // For now, we're just logging the information that would be sent
    
    const message = `
NEW ORDER NOTIFICATION:
-----------------------
Customer: ${customer}
Phone: ${phoneNumber}
District: ${district}
City/Town: ${cityOrTown}
Preferred Time: ${preferredTime}

ITEMS:
${items}

Total Amount: ${totalAmount}
-----------------------
    `;
    
    console.log("Message that would be sent:");
    console.log(message);
    
    // Success response
    return new Response(
      JSON.stringify({ success: true, message: "Order notification sent successfully" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in send-order-notification function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
