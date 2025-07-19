from twilio.rest import Client
import os

# Load credentials from environment variables
account_sid = os.environ['ACCOUNT_SID']
auth_token = os.environ['AUTH_TOKEN']
from_whatsapp_number = os.environ['FROM_WHATSAPP_NO']
to_whatsapp_number = os.environ['TO_WHATSAPP_NO']

client = Client(account_sid, auth_token)

message = client.messages.create(
    body="Work in progress! you will get the updated information soon. Have a good day sir!",
    from_=f'whatsapp:{from_whatsapp_number}',
    to=f'whatsapp:{to_whatsapp_number}'
)

print(f"Message sent! SID: {message.sid}")
