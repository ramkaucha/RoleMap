from sqlalchemy import func
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from . import models

def calculate_success_rate(db: Session, user_id: int) -> float:
    total = db.query(models.Application).filter(
        models.Application.user_id == user_id
    ).count()

    if total == 0:
        return 0.0
    
    accepted = db.query(models.Application).filter(
        models.Application.user_id == user_id,
        models.Application.status == 'INTERVIEWING'
    ).count()

    return ( accepted / total ) * 100

def applications_this_month(db: Session, user_id: int) -> int:
    first_of_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    return db.query(models.Application).filter(
        models.Application.user_id == user_id,
        models.Application.date_applied >= first_of_month
    ).count()

def get_most_common(db: Session, user_id: int, field: str) -> str:
    result = db.query(getattr(models.Application, field), func.count(models.Application.id).label('count')).filter(models.Application.user_id == user_id).group_by(getattr(models.Application, field)).order_by(func.count(models.Application.id).desc()).first()

    return result[0] if result else None

