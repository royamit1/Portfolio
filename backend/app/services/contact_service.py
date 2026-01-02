import logging
from fastapi import BackgroundTasks
from fastapi_mail import FastMail, MessageSchema, MessageType
from app.core.config import EMAIL_CONF, settings
from app.schemas import ContactSchema
from app.utils.contact_template import create_contact_email_html

logger = logging.getLogger(__name__)
fm = FastMail(EMAIL_CONF)


async def send_contact_form_email(background_tasks: BackgroundTasks, subject: str, data: ContactSchema):
    """
    Queues the contact form email to be sent in the background.
    """
    html_content = create_contact_email_html(data)

    # We use MessageType.html to satisfy strict typing
    message = MessageSchema(
        subject=subject,
        recipients=[settings.OWNER_EMAIL],  # type: ignore
        body=html_content,  # type: ignore
        subtype=MessageType.html,
        reply_to=[data.email],  # type: ignore
    )

    try:
        background_tasks.add_task(fm.send_message, message)
        logger.info(f"Queued contact email from {data.email}")
    except Exception as e:
        logger.error(f"Failed to queue contact email: {e}")
        raise


async def send_email_tool(recipient: str, subject: str, body: str):
    """
    Direct email sender for the AI Agent tools.
    """
    message = MessageSchema(
        subject=subject,
        recipients=[recipient],  # type: ignore
        body=body,  # type: ignore
        subtype=MessageType.html,
    )

    try:
        await fm.send_message(message)
        logger.info(f"Agent successfully sent email to {recipient}")
    except Exception as e:
        logger.error(f"Agent failed to send email to {recipient}: {e}")
        raise e
