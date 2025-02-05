from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(
  prefix="/applications",
  tags=["Application"]
)

@router.post("", response_model=schemas.Application)
def create_application(
   application: schemas.ApplicationCreate,
   current_user: schemas.User,
   db: Session = Depends(get_db)
):
  """Upload a new application"""
  existing_application = db.query(models.Application).filter(
    models.Application.user_id == current_user.id,
    models.Application.company == application.company,
    models.Application.role == application.role
  ).first()

  if existing_application:
    raise HTTPException(
      status_code=status.HTTP_409_CONFLICT,
      detail="Warning: You may have already applied for this role at this company previously"
    )
  
  db_application = models.Application(
    **application.model_dump(),
    user_id = current_user.id
  )

  db.add(db_application)
  db.commit()
  db.refresh(db_application)

  return db_application

@router.get("", response_model=schemas.ApplicationList)
def get_application_list(
  skip: int = Query(default=0, ge=0),
  limit: int = Query(default=50, ge=0),
  current_user: models.User = Depends(auth.get_current_user),
  db: Session = Depends(get_db)
):
  applications = db.query(models.Application)\
    .filter(models.Application.user_id == current_user.id)\
    .order_by(models.Application.date_applied.desc())\
    .offset(skip)\
    .limit(limit)\
    .all()
  
  total_count = db.query(models.Application)\
    .filter(models.Application.user_id == current_user.id)\
    .count()
  
  return {
    "items": applications,
    "total": total_count,
    "has_more": total_count > (skip + limit)
  }

@router.get("/{id}", response_model=schemas.Application)
def get_application(id: int, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    application = db.query(models.Application)\
        .filter(
            models.Application.user_id == current_user.id,
            models.Application.id == id
        ).first()
    
    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    
    return application

@router.put("/{id}", response_model=schemas.Application)
def update_application(
    id: int,
    application: schemas.ApplicationCreate,
    current_user: models.User = Depends(auth.get_current_user), 
    db: Session = Depends(get_db)
):
    db_application = db.query(models.Application)\
        .filter(
            models.Application.user_id == current_user.id,
            models.Application.id == id
        ).first()

    if db_application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    
    for key, value in application.model_dump().items():
        setattr(db_application, key, value)
    
    db.commit()
    db.refresh(db_application)

    return db_application

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(
    id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    db_application = db.query(models.Application)\
        .filter(
            models.Application.user_id == current_user.id,
            models.Application.id == id
        ).first()

    if db_application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    
    db.delete(db_application)
    db.commit()

    return None