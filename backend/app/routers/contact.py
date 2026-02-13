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
        request: Request
):
    """
    Handles contact form submissions.
    Temporarily made synchronous to diagnose delivery issues.
    """
    try:
        with open("contact_debug.log", "a") as f:
            f.write(f"Submission received from {payload.email} at {request.client.host}\n")
        logger.info(f"Contact submission received (Sync Debug Mode) from: {payload.email}")

        subject = f"Portfolio Contact: {payload.name}"

        # We manually create the message and await the sender helper (ignoring background_tasks for now)
        from app.services.contact_service import _send_task, create_contact_email_html, fm, settings
        from fastapi_mail import MessageSchema, MessageType

        html_content = create_contact_email_html(payload)
        message = MessageSchema(
            subject=subject,
            recipients=[settings.OWNER_EMAIL],
            body=html_content,
            subtype=MessageType.html,
            reply_to=[payload.email],
        )

        # Directly await for diagnostic purposes
        await fm.send_message(message)
        logger.info(f"Sync email send successful for {payload.email}")

        return {
            "status": "success",
            "message": "Message sent successfully."
        }

    except Exception as e:
        logger.error(f"Failed to process contact form: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error processing contact request.")
