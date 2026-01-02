from datetime import datetime
from app.schemas import ContactSchema


def create_contact_email_html(message: ContactSchema) -> str:
    """
    Generates a responsive, professional HTML email template for contact submissions.
    Uses table-based layout for maximum client compatibility.
    """
    timestamp = datetime.now().strftime("%B %d, %Y at %I:%M %p")

    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>New Contact Message</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Segoe UI', Roboto, Arial, sans-serif;">

      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="padding: 24px 0; background-color: #f4f4f5;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; overflow: hidden;">

              <tr>
                <td style="background-color: #111827; padding: 20px 32px;">
                  <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #ffffff;">New Portfolio Inquiry</h2>
                  <p style="margin: 4px 0 0; font-size: 13px; color: #d1d5db;">A new message has been submitted from your website.</p>
                </td>
              </tr>

              <tr>
                <td style="padding: 28px 32px;">

                  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 24px;">
                    <tr>
                      <td style="font-size: 14px; color: #374151;"><strong>Name:</strong> {message.name}</td>
                    </tr>
                    <tr>
                      <td style="padding-top: 6px; font-size: 14px; color: #374151;">
                        <strong>Email:</strong> <a href="mailto:{message.email}" style="color: #3b82f6; text-decoration: none;">{message.email}</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-top: 6px; font-size: 13px; color: #6b7280;">Received on {timestamp}</td>
                    </tr>
                  </table>

                  <div style="padding: 16px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px; color: #374151; line-height: 1.6;">
                    {message.message.replace("\n", "<br>")}
                  </div>

                  <div style="text-align: left; margin-top: 24px;">
                    <a href="mailto:{message.email}?subject=Re: Your Portfolio Message" 
                       style="display: inline-block; padding: 10px 24px; background-color: #3b82f6; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 6px;">
                       Reply to Sender
                    </a>
                  </div>

                </td>
              </tr>

              <tr>
                <td style="background-color: #f3f4f6; padding: 16px 32px; text-align: center; font-size: 12px; color: #6b7280;">
                  © {datetime.now().year} Portfolio Contact System — Automated Message.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    """
