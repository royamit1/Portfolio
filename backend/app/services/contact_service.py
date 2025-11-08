import logging
from fastapi import BackgroundTasks
from fastapi_mail import FastMail, MessageSchema
from app.core.config import EMAIL_CONF, settings
from app.utils.contact_template import create_contact_email_html
from app.models.contact import ContactSchema

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
