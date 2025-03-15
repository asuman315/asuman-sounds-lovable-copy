
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customer, phoneNumber, district, cityOrTown, preferredTime, items, totalAmount } = await req.json();

    console.log(`Processing order notification for ${customer}`);
    console.log(`Order details: Customer: ${customer}, Phone: ${phoneNumber}, District: ${district}`);
    console.log(`Items: ${items}`);
    
    // Format the message for email
    const message = `
<h1>NEW ORDER NOTIFICATION</h1>
<hr />
<p><strong>Customer:</strong> ${customer}</p>
<p><strong>Phone:</strong> ${phoneNumber}</p>
<p><strong>District:</strong> ${district}</p>
<p><strong>City/Town:</strong> ${cityOrTown || "Not specified"}</p>
<p><strong>Preferred Time:</strong> ${preferredTime}</p>

<h2>ITEMS:</h2>
<pre>${items}</pre>

<p><strong>Total Amount:</strong> ${totalAmount}</p>
<hr />
    `;
    
    // Send email notification
    const emailData = await resend.emails.send({
      from: "Order Notification <onboarding@resend.dev>",
      to: "asumanssendegeya@gmail.com",
      subject: `New Order from ${customer}`,
      html: message,
    });
    
    console.log("Email notification sent:", emailData);
    
    // Success response
    return new Response(
      JSON.stringify({ success: true, message: "Order notification sent successfully", data: emailData }),
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
