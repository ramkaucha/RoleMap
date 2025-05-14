from sqlalchemy import func
from sqlalchemy.orm import Session
from datetime import datetime, date, timedelta
from . import models
from app.schemas import ApplicationStatus


def calculate_success_rate(db: Session, user_id: int) -> float:
    total = db.query(models.Application).filter(
        models.Application.user_id == user_id
    ).count()

    if total == 0:
        return 0.0

    accepted = db.query(models.Application).filter(
        models.Application.user_id == user_id,
        models.Application.status == 'interviewing'
    ).count()

    return (accepted / total) * 100


def applications_this_month(db: Session, user_id: int) -> int:
    first_of_month = datetime.now().replace(
        day=1, hour=0, minute=0, second=0, microsecond=0)
    return db.query(models.Application).filter(
        models.Application.user_id == user_id,
        models.Application.date_applied >= first_of_month
    ).count()


def get_most_common(db: Session, user_id: int, field: str) -> str:
    result = db.query(getattr(models.Application, field),
                      func.count(models.Application.id).label('count')).filter(
        models.Application.user_id == user_id).group_by(getattr(
            models.Application, field)).order_by(func.count(
                models.Application.id).desc()).first()

    return result[0] if result else None


def get_total_applications(db: Session, user_id: int) -> int:
    result = db.query(models.Application).filter(
        models.Application.user_id == user_id).count()
    return result


def get_interview_rate(db: Session, user_id: int) -> int:
    result = db.query(models.Application
                      ).filter(models.Application.user_id == user_id,
                               models.Application.status ==
                               ApplicationStatus.INTERVIEWING).count()
    total = get_total_applications(db, user_id)

    if int(total) == 0:
        total = 1

    return result // total


def get_current_week_dates(db: Session, user_id: int) -> list:
    week_application_data = []

    today = date.today()
    start_of_week = today - timedelta(days=today.weekday())

    for i in range(7):
        current_date = start_of_week + timedelta(days=i)
        formatted_date = current_date.strftime("%B %d")

        num_applications = db.query(models.Application).filter(
            models.Application.user_id == user_id, func.date(
                models.Application.date_applied) == current_date
        ).count()

        week_application_data.append({
            'date': formatted_date,
            'applications': num_applications
        })

    return week_application_data
