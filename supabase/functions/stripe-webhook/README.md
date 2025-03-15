
# Stripe Webhook Handler

This Edge Function handles Stripe webhook events to process payments and update order status.

## Features
- Processes successful checkout sessions and creates order records in the database
- Verifies webhook signatures for secure event handling
- Updates payment status and records order details
- Handles session expiration events

## Configuration
This function requires the following secrets to be set in the Supabase project:
- `STRIPE_SECRET_KEY`: Your Stripe secret API key
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook signing secret
- `SUPABASE_URL`: Your Supabase project URL (set automatically)
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (set automatically)

## Webhook Setup Instructions
1. Deploy this function
2. In your Stripe Dashboard, go to Developers > Webhooks
3. Add an endpoint with the URL of this function (e.g., `https://<project-ref>.supabase.co/functions/v1/stripe-webhook`)
4. Select the following events to listen for:
   - `checkout.session.completed`
   - `checkout.session.expired`
5. Copy the signing secret and set it as `STRIPE_WEBHOOK_SECRET` in your Supabase secrets

## Testing
- You can use the Stripe CLI to test webhooks locally
- Or create test checkout sessions in Stripe test mode

## Security
- All webhook events are verified using the webhook signature
- The function uses your Supabase service role key to write to the database
