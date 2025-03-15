
# Send Order Notification Function

This Edge Function sends order notifications via email when a customer completes a personal delivery checkout.

## Features
- Sends detailed order information including customer details and items ordered
- Displays product images for a more visual and informative email
- Formats the message in a beautiful, responsive HTML email
- Sends email to the store administrator at asumanssendegeya@gmail.com
- Includes customer contact information for follow-up
- Logs all information for debugging purposes

## Payload Structure
```json
{
  "customer": "customer name",
  "phoneNumber": "customer phone",
  "district": "delivery district",
  "cityOrTown": "city or town",
  "preferredTime": "preferred delivery time",
  "email": "customer email (optional)",
  "items": "formatted list of items as text",
  "itemsDetails": [
    {
      "title": "product title",
      "quantity": "quantity ordered",
      "price": "unit price",
      "imageUrl": "url to product image"
    }
  ],
  "totalAmount": "total order amount"
}
```

## Configuration
This function requires a Resend API key to be set as a secret in the Supabase project:
- `RESEND_API_KEY`: Your Resend API key

## Setup Instructions
1. Create an account at [Resend](https://resend.com) if you don't have one
2. Generate an API key at [Resend API Keys](https://resend.com/api-keys)
3. Add the API key as a secret to your Supabase project
4. Deploy the edge function

## Future Improvements
- Add more customizable email templates
- Send confirmation emails to customers as well
- Add support for multiple admin recipients
- Add authentication to secure the endpoint
- Integrate with order tracking system
- Add more detailed logging and error handling
