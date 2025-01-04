from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from typing import List
import os

conf = ConnectionConfig(
  MAIL_USERNAME = os.getenv('MAIL_USERNAME'),
  MAIL_PASSWORD = os.getenv('MAIL_PASSWORD'),
  MAIL_FROM = os.getenv('MAIL_FROM'),
  MAIL_PORT = int(os.getenv('MAIL_PORT', 587)),
  MAIL_SERVER = os.getenv('MAIL_SERVER'),
  MAIL_STARTTLS = True,
  MAIL_SSL_TLS = False,
  USE_CREDENTIALS = True
)

async def send_verification_email(email: str, token: str):
  verification_url = f"http://localhost:8000/verify-email?token={token}"

  html = f"""
  <h1>Welcome to our platform!</h1>
  <br />
  <p>Please click the link below to verify your email address:</p>
  <a href="{verification_url}">Verify Email</a>
  <br />
  <p>If you did not create an account, please ignore this email.</p>
  """

  message = MessageSchema(
    subject="JobTrackr Email Verification",
    recipients=[email],
    body=html,
    subtype="html"
  )

  fm = FastMail(conf)
  await fm.send_message(message)