from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form, Body
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
from . import models, schemas, auth, analytics
from .database import engine, get_db
from fastapi import Query
from typing import List, Optional
import os
from werkzeug.utils import secure_filename
1
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # frontend url
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = models.User.get_password_hash(user.password)

    db_user = models.User(email=user.email, hashed_password=hashed_password, first_name=user.first_name, last_name=user.last_name)

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user

@app.post('/token', response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not user.verify_password(form_data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={'sub': user.email}, expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.patch("/users/me")
async def update_user_profile(
    user_update: Optional[schemas.UserUpdate] = Body(..., embed=True), 
    profile_picture: Optional[UploadFile] = File(None),
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    
    print(f'{user_update.current_password}')
    print(f'{user_update.new_password}')
    
    updates = {}
    
    if user_update:
        if user_update.first_name:
            updates["first_name"] = user_update.first_name
        if user_update.last_name:
            updates['last_name'] = user_update.last_name

        if user_update.new_password:
            if not user_update.current_password:
                raise HTTPException(
                    status_code=400,
                    detail="Current password is required to set a new password"
                )

            if current_user and not current_user.verify_password(user_update.current_password):
                raise HTTPException(
                    status_code=400,
                    detail="Incorrect current password"
                )
            
            updates['hashed_password'] = current_user.get_password_hash(user_update.new_password)
    
    if profile_picture:
        if not profile_picture.content_type.startswith('image/'):
            raise HTTPException(
                status_code=400,
                detail='File must be an image'
            )
        
        upload_dir = f"uploads/profile_pictures/{current_user.id}"
        os.makedirs(upload_dir, exist_ok=True)

        filename = secure_filename(profile_picture.filename)
        file_path = f"{upload_dir}/{filename}"

        try:
            contents = await profile_picture.read()
            with open(file_path, "wb") as f:
                f.write(contents)

            updates["profile_picture"] = file_path
            updates["profile_picture_type"] = "local"
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail="Could not upload file"
            )
    
    if not updates:
        raise HTTPException(
            status_code=400,
            detail="No updates provided"
        )
    
    # updating to database
    try:
        for key, value in updates.items():
            setattr(current_user, key, value)
        db.commit()

        return {
            "message": "Profile update sucessfully",
            "user": {
                "email": current_user.email,
                "first_name": current_user.first_name,
                "last_name": current_user.last_name,
                "profile_picture": current_user.profile_picture
            }
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Could not update profile"
        )

@app.post("/applications", response_model=schemas.Application)
def create_application(
    application: schemas.ApplicationCreate, 
    current_user: schemas.User,
    db: Session = Depends(get_db)
):
    existing_application = db.query(models.Application).filter(
        models.Application.user_id == current_user.id,
        models.Application.company == application.company,
        models.Application.role == application.role
    ).first()

    if existing_application:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Warning: You may have already applied for this role at this company"
        )
    
    db_application = models.Application(
        **application.dict(),
        user_id=current_user.id
    )

    db.add(db_application)
    db.commit()
    db.refresh(db_application)

    return db_application

@app.get("/applications", response_model=schemas.ApplicationList)
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

@app.get("/applications/{id}", response_model=schemas.Application)
def get_application(id: int, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    application = db.query(models.Application)\
        .filter(
            models.Application.user_id == current_user.id,
            models.Application.id == id
        ).first()
    
    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    
    return application

@app.put('/applications/{id}', response_model=schemas.Application)
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

@app.delete('/applications/{id}', status_code=status.HTTP_204_NO_CONTENT)
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

@app.get("/analytics/summary")
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

