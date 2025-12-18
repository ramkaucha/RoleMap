from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
from .. import schemas, models, auth
from ..database import get_db

router = APIRouter(
  prefix="/notifications",
  tags=["Notifications"]
)

@router.get("", response_class=schemas.Notification)
def get_notifications(
  current_user: models.User = Depends(auth.get_current_user),
  db: Session = Depends(get_db)
):
  """Get all notifications for a particular user

  Args:
      current_user (models.User, optional): The current user. Defaults to Depends(auth.get_current_user).
      db (Session, optional): Database. Defaults to Depends(get_db).

  Returns:
      list: returns list of notification, else returns None
  """
  return db.query(models.Notification).filter(models.Application.user_id == current_user.id)