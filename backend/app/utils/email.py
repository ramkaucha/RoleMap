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
  verification_url = f"http://localhost:3000/auth/email-verify?token={token}"

  html = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: Arial, sans-serif;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <tr>
          <td style="padding: 40px 30px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center">
                    <h1 style="color: #333333; font-size: 24px; margin: 0; margin-bottom: 20px;">Welcome to JobTrackr by Ram!</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px 0;">
                  <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0; margin-bottom: 20px; text-align: center;">
                    Please verify your email address to get started
                  </p>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 20px 0;">
                  <a href="{verification_url}" style="background-color: #4F46E5; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">
                    Verify Email
                  </a>
                </td>
              </tr>
              <tr>
                <td style="padding-top: 20px;">
                  <p style="color: #999999; font-size: 14px; line-height: 21px; margin: 0; text-align: center;">
                    If you didn't create an account with JobTrackr, you can safely ignore this email.
                  </p>
                </td>
              </tr>
                </table>
                </td>
            </tr>
        </table>
    </body>
  </html>
  """

  message = MessageSchema(
    subject="JobTrackr Email Verification",
    recipients=[email],
    body=html,
    subtype="html"
  )

  fm = FastMail(conf)
  await fm.send_message(message)