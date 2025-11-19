from fastapi import APIRouter, BackgroundTasks, HTTPException, Request
from app.models.contact import ContactSchema
import logging
from app.services.contact_service import send_contact_form_email
from app.core.limiter import limiter

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/contact", status_code=202)
@limiter.limit("5/minute")
async def contact(request: Request, background_tasks: BackgroundTasks):
    """
    Handles incoming contact form submissions.
    The 'request' argument is required by the rate limiter.
    """
    try:
        body = await request.json()
        message = ContactSchema(**body)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid request body.")

    try:
        logger.info(f"Contact form submission received from: {message.email}")
        subject = f"New Portfolio Contact from {message.name}"
        await send_contact_form_email(background_tasks, subject, message)
        return {"status": "success", "message": "Your message has been successfully queued for sending."}
    except Exception as e:
        logger.error(f"Error processing contact form: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="There was an error processing your request.")
