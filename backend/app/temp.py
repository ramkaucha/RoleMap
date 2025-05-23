from app.schemas import ApplicationStatus
from sqlalchemy import func
from sqlalchemy.orm import Session
from app import models

def get_status_distribution(db: Session, user_id: int) -> list:
    status_distribution = []

    for status in ApplicationStatus:
        num_status = db.query(models.Application).filter(models.Application.user_id == user_id, models.Application.status == status).count()
        status_distribution.append({
            'name': status.value.title(),
            'value': num_status
        })

    print(status_distribution)
    return status_distribution

def main():
    get_status_distribution(1)


if __name__ == "__main__":
    main()
