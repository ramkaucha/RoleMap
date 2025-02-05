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
        "total_applications": db.query(models.Application).filter(models.Application.id == current_user.id).count(),
        "active_applications": db.query(models.Application).filter(
            models.Application.user_id == current_user.id,
            models.Application.status.in_(["APPLIED", "INTERVIEWING", "ONLINE_ASSESSMENT"])
        ).count(),
        "success_rate": analytics.calculate_success_rate(db, current_user.id),
        "applications_this_month": analytics.applications_this_month(db, current_user.id),
        "most_applied_category": analytics.get_most_common(db, current_user.id, "category"),
        "most_applied_location": analytics.get_most_common(db, current_user.id, "location")
    }