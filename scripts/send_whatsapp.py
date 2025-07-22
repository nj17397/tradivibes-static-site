from twilio.rest import Client
import os
import pandas as pd


# Load credentials from environment variables
account_sid = os.environ['ACCOUNT_SID']
auth_token = os.environ['AUTH_TOKEN']
from_whatsapp_number = os.environ['FROM_WHATSAPP_NO']
to_whatsapp_number = os.environ['TO_WHATSAPP_NO']


# Check if all required environment variables are set
missing_vars = [var for var in ["ACCOUNT_SID", "AUTH_TOKEN", "FROM_WHATSAPP_NO", "TO_WHATSAPP_NO"]
                if os.getenv(var) is None]

if missing_vars:
    print(f"❌ Missing environment variables: {', '.join(missing_vars)}")
    exit(1)


client = Client(account_sid, auth_token)

def read_csv(file_path):
    """Read a CSV file and return its content."""

    df = pd.read_csv(file_path)
    symbols = df['Symbol'].tolist()
    return_str = '\n'.join(symbols)
    print(return_str)
    return return_str


message = client.messages.create(
    body=read_csv("static/stock.csv"),
    from_=f'whatsapp:{from_whatsapp_number}',
    to=f'whatsapp:{to_whatsapp_number}'
)

print(f"✅ Message sent successfully! SID: {message.sid}")
print(f"Status: {message.status}")

except TwilioRestException as e:
    print(f"❌ Failed to send message: {e.msg}")
    print(f"More info: {e.code} - {e.more_info}")



print(f"Message sent! SID: {message.sid}")
