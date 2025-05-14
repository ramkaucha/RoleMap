from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, auth, analytics
from ..database import get_db

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/summary")
def get_analytics_summary(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    return {
        "total_applications": analytics.get_total_applications(db, current_user.id),
        "active_applications": db.query(models.Application).filter(
            models.Application.user_id == current_user.id,
            models.Application.status.in_(
                ["applied", "interviewing", "online assessment"])
        ).count(),
        "response_rate": analytics.calculate_success_rate(db, current_user.id),
        "applications_this_month": analytics.applications_this_month(db, current_user.id),
        "interview_rate": analytics.get_interview_rate(db, current_user.id),
        # "offer_rate": analytics.get_offer_rate(db, current_user.id),
    }


@router.get("/week")
def get_analytics_week(current_user: models.User = Depends(
        auth.get_current_user), db: Session = Depends(get_db)):
    return analytics.get_current_week_dates(db, current_user.id)
