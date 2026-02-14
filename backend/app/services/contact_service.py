import logging
import resend
from fastapi import BackgroundTasks
from app.core.config import settings
from app.schemas import ContactSchema
from app.utils.contact_template import create_contact_email_html

logger = logging.getLogger(__name__)

# Initialize Resend with API key
resend.api_key = settings.RESEND_API_KEY.get_secret_value()


def _send_task(subject: str, recipients: list[str], html: str, reply_to: list[str] | None = None):
    """
    Internal helper to execute and log the background email task.
    Uses Resend's HTTP API (synchronous call, no SMTP needed).
    """
    try:
        params: resend.Emails.SendParams = {
            "from": settings.RESEND_FROM,
            "to": recipients,
            "subject": subject,
            "html": html,
        }
        if reply_to:
            params["reply_to"] = reply_to

        resend.Emails.send(params)
        logger.info(f"Background email task successfully sent to {recipients}")
    except Exception as e:
        logger.error(f"Background email task failed: {e}", exc_info=True)


async def send_contact_form_email(background_tasks: BackgroundTasks, subject: str, data: ContactSchema):
    """
    Queues the contact form email to be sent in the background.
    """
    html_content = create_contact_email_html(data)

    # Offload to background task for fast response
    background_tasks.add_task(
        _send_task,
        subject=subject,
        recipients=[settings.OWNER_EMAIL],
        html=html_content,
        reply_to=[data.email],
    )
    logger.info(f"Queued contact email from {data.email}")


def send_email_tool(recipient: str, subject: str, body: str):
    """
    Direct email sender for the AI Agent tools.
    """
    try:
        params: resend.Emails.SendParams = {
            "from": settings.RESEND_FROM,
            "to": [recipient],
            "subject": subject,
            "html": body,
        }
        resend.Emails.send(params)
        logger.info(f"Agent successfully sent email to {recipient}")
    except Exception as e:
        logger.error(f"Agent failed to send email to {recipient}: {e}")
        raise e
