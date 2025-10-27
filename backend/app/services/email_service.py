import logging
from fastapi import BackgroundTasks
from fastapi_mail import FastMail, MessageSchema
from app.core.config import EMAIL_CONF, OWNER_EMAIL
from app.utils.email_template import create_contact_email_html

logger = logging.getLogger(__name__)
fm = FastMail(EMAIL_CONF)


async def send_contact_email(background_tasks: BackgroundTasks, subject: str, data):
    html_content = create_contact_email_html(data)

    email = MessageSchema(
        subject=subject,
        recipients=[OWNER_EMAIL],
        body=html_content,
        subtype="html",
        reply_to=[data.email],
    )

    try:
        background_tasks.add_task(fm.send_message, email)
        logger.info("Email queued successfully.")
    except Exception as e:
        logger.error(f"Error sending email: {e}")
        raise
