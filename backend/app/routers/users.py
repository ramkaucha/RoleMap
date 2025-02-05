from fastapi import APIRouter, Depends, HTTPException, UploadFile
from sqlalchemy.orm import Session
from .. import models, schemas, auth
from ..database import get_db
from werkzeug.utils import secure_filename
import os

router = APIRouter(
  prefix="/users",
  tags=["Users"]
)

@router.get("/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
  return current_user

@router.patch("/me/profile")
async def update_user_profile(
  user_update: schemas.UserUpdate,
  current_user: models.User = Depends(auth.get_current_user),
  db: Session = Depends(get_db)
):
  updates = {}

  if user_update.first_name:
    updates["first_name"] = user_update.first_name
  if user_update.last_name:
    updates["last_name"] = user_update.last_name

  if user_update.new_password:
    if not user_update.current_password:
      raise HTTPException(
        status_code=400,
        detail="Current password is required to set the new password"
      )
    
    if current_user and not current_user.verify_password(user_update.current_password):
      raise HTTPException(
        status_code=400,
        detail="Incorrect current password"
      )
    
    updates["hashed_password"] = current_user.get_password_hash(user_update.new_password)

  
  if not updates:
    raise HTTPException(
      status_code=400,
      detail="No Updates available"
    )
  
  try:
    for key, value in updates.items():
      setattr(current_user, key, value)

      db.commit()

      return {
        "message": "Profile updated successfully",
        "user": {
          "email": current_user.email,
          "first_name": current_user.first_name,
          "last_name": current_user.last_name
        }
      }
  except Exception as e:
    db.rollback()
    raise HTTPException(
      status_code=500,
      detail=f"Could not update profile: {e}"
    )

@router.patch("/me/profile-picture")
async def update_user_profile_picture(
    profile_picture: UploadFile,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    updates = {}    

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
            "message": "Profile update successfully",
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