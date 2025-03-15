
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
    const { customer, phoneNumber, district, cityOrTown, preferredTime, items, totalAmount, email } = await req.json();

    console.log(`Processing order notification for ${customer}`);
    console.log(`Order details: Customer: ${customer}, Phone: ${phoneNumber}, District: ${district}`);
    console.log(`Items: ${items}`);
    
    // Format the message for email with improved styling
    const message = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(to right, #4F46E5, #3B82F6);
      color: white;
      padding: 20px;
      border-radius: 8px 8px 0 0;
      text-align: center;
    }
    .content {
      background: #fff;
      padding: 20px;
      border: 1px solid #eaeaea;
      border-top: none;
      border-radius: 0 0 8px 8px;
    }
    .section {
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #eaeaea;
    }
    .section:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    .label {
      font-weight: bold;
      display: inline-block;
      width: 150px;
    }
    .item {
      padding: 8px 0;
      border-bottom: 1px solid #f5f5f5;
    }
    .item:last-child {
      border-bottom: none;
    }
    .total {
      font-size: 18px;
      font-weight: bold;
      margin-top: 15px;
      text-align: right;
    }
    .footer {
      margin-top: 20px;
      font-size: 12px;
      color: #777;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>New Order Notification</h1>
  </div>
  <div class="content">
    <div class="section">
      <h2>Customer Information</h2>
      <p><span class="label">Name:</span> ${customer}</p>
      <p><span class="label">Phone:</span> ${phoneNumber}</p>
      ${email ? `<p><span class="label">Email:</span> ${email}</p>` : ''}
      <p><span class="label">District:</span> ${district}</p>
      ${cityOrTown ? `<p><span class="label">City/Town:</span> ${cityOrTown}</p>` : ''}
      <p><span class="label">Preferred Time:</span> ${preferredTime}</p>
    </div>
    
    <div class="section">
      <h2>Order Items</h2>
      <div>
        ${items.split('\n').map(item => `<div class="item">${item}</div>`).join('')}
      </div>
      <div class="total">Total Amount: ${totalAmount}</div>
    </div>
  </div>
  <div class="footer">
    <p>This is an automated notification sent from your eCommerce system.</p>
    <p>&copy; ${new Date().getFullYear()} Your Store Name. All rights reserved.</p>
  </div>
</body>
</html>
    `;
    
    // Send email notification with improved formatting
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
