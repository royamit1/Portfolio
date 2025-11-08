from fastapi import APIRouter, BackgroundTasks, HTTPException
from app.models.contact import ContactSchema
import logging

from app.services.contact_service import send_contact_form_email

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/contact", status_code=202)
async def contact(message: ContactSchema, background_tasks: BackgroundTasks):
    """
    Handles incoming contact form submissions.
    Queues the email to be sent in the background and returns an accepted status.
    """
    try:
        logger.info(f"Contact form submission received from: {message.email}")
        subject = f"New Portfolio Contact from {message.name}"
        await send_contact_form_email(background_tasks, subject, message)
        return {"status": "success", "message": "Your message has been successfully queued for sending."}
    except Exception as e:
        logger.error(f"Error processing contact form: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="There was an error processing your request.")
