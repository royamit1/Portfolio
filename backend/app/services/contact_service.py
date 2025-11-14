import logging
from fastapi import BackgroundTasks
from fastapi_mail import FastMail, MessageSchema
from app.core.config import EMAIL_CONF, settings
from app.utils.contact_template import create_contact_email_html
from app.models.contact import ContactSchema
from app.models.tool import EmailToolInput  # <-- NEW IMPORT

logger = logging.getLogger(__name__)
fm = FastMail(EMAIL_CONF)


async def send_contact_form_email(background_tasks: BackgroundTasks, subject: str, data: ContactSchema):
    """
    Creates the email content from a template and queues it to be sent.
    """
    html_content = create_contact_email_html(data)

    email = MessageSchema(
        subject=subject,
        recipients=[settings.OWNER_EMAIL],
        body=html_content,
        subtype="html",
        reply_to=[data.email],
    )

    try:
        background_tasks.add_task(fm.send_message, email)
        logger.info(f"Contact form email for {data.email} has been queued.")
    except Exception as e:
        logger.error(f"Error sending contact form email: {e}")
        raise


# --- NEW TOOL FUNCTION ---
async def send_email_tool(recipient: str, subject: str, body: str) -> str:
    """
    A tool that can be used by the AI agent to send an email.
    It takes a recipient, subject, and body, and sends the email.
    Returns a confirmation message.
    """
    email = MessageSchema(
        subject=subject,
        recipients=[recipient],
        body=body,
        subtype="html",
    )
    try:
        await fm.send_message(email)
        logger.info(f"Email successfully sent by agent to {recipient}")
        return f"Successfully sent email to {recipient} with subject '{subject}'."
    except Exception as e:
        logger.error(f"Agent failed to send email to {recipient}: {e}")
        return f"Error: Failed to send email. Reason: {e}"
