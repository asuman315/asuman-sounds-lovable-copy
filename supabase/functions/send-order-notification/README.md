
# Send Order Notification Function

This Edge Function sends order notifications to a specified phone number when a customer completes a personal delivery checkout.

## Features
- Sends detailed order information including customer details and items ordered
- Formats the message in a readable way
- Logs all information for debugging purposes

## Payload Structure
```json
{
  "to": "phone number to send to",
  "customer": "customer name",
  "phoneNumber": "customer phone",
  "district": "delivery district",
  "cityOrTown": "city or town",
  "preferredTime": "preferred delivery time",
  "items": "formatted list of items",
  "totalAmount": "total order amount"
}
```

## Future Improvements
- Integrate with an SMS service (Twilio, etc.) to actually send the SMS
- Add authentication to secure the endpoint
- Add more detailed logging and error handling
```
