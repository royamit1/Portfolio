import logging
from fastapi import APIRouter, BackgroundTasks, HTTPException, Request
from app.schemas import ContactSchema
from app.services.contact_service import send_contact_form_email
from app.core.limiter import limiter

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/contact", status_code=202)
@limiter.limit("3/day")
async def submit_contact_form(
        payload: ContactSchema,
        request: Request,
        background_tasks: BackgroundTasks
):
    """
    Handles contact form submissions asynchronously.
    Queues the email sending task to ensure a fast response time.
    """
    try:
        logger.info(f"Contact submission received from: {payload.email}")

        subject = f"Portfolio Contact: {payload.name}"

        # Offload email sending to background task
        await send_contact_form_email(background_tasks, subject, payload)

        return {
            "status": "success",
            "message": "Message received and queued for delivery."
        }

    except Exception as e:
        logger.error(f"Failed to process contact form: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error processing contact request.")
