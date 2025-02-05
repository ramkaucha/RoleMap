from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from sqlalchemy.orm import Session
from .. import models, schemas, auth
from ..database import get_db
from ..utils.email import send_verification_email
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta

router = APIRouter(
  prefix="/auth",
  tags=["Authentication"]
)

@router.post("/register", response_model=schemas.User,
    summary="Registers a new user",
    description="Creates a new user account and sends verification email",
    responses={
      201: {
        "description": "Successfully created user",
        "model": schemas.User
      },
      400: {
        "description": "Email already registered"
      }
    }
)
async def register(
  user: schemas.UserCreate,
  background_tasks: BackgroundTasks,
  db: Session = Depends(get_db)
):
  """
  Register a new user with the following instruction

  - **email**: valid email address
  - **password**: strong password
  - **first_name**: user's first name
  - **last_name**: user's last name
  """
  db_user = db.query(models.User).filter(models.User.email == user.email).first()
  if db_user:
    raise HTTPException(status_code=400, detail="Email already registered")
  
  verification_token = models.User.generate_verification_token()

  hashed_password = models.User.get_password_hash(user.password)

  db_user = models.User(
    email=user.email,
    hashed_password=hashed_password,
    first_name=user.first_name,
    last_name=user.last_name,
    verification_token=verification_token,
    is_verified=False
  )

  db.add(db_user)
  db.commit()
  db.refresh(db_user)

  background_tasks.add_task(
    send_verification_email,
    email=user.email,
    token=verification_token
  )

  return {
    "description": "User successfully created"
  }

@router.post("/token", response_model=schemas.Token,
    summary="Login a user",
    description="Logging in a user",
    responses={
      201: {
        "access_token": "abcd123#",
        "token_type": "bearer"
      },
      400: {
        "description": "Please verify your email before logging in"
      },
      401: {
        "description": "Incorrect email or password"
      }
    }
)
def login(
  form_data: OAuth2PasswordRequestForm = Depends(),
  db: Session = Depends(get_db)
):
  """
  Logs in a user with the following instruction

  - **username**: valid username
  - **password**:  passwords
  """
  user = db.query(models.User).filter(models.User.email == form_data.username).first()
  if not user or not user.verify_password(form_data.password):
      raise HTTPException(
          status_code=status.HTTP_401_UNAUTHORIZED,
          detail="Incorrect email or password",
          headers={"WWW-Authenticate": "Bearer"},
      )
  
  if not user.is_verified:
      raise HTTPException(
          status_code=status.HTTP_400_BAD_REQUEST,
          detail="Please verify your email before logging in",
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

@router.post("/resend-verification")
def resend_verification (
   email: str,
   background_tasks: BackgroundTasks,
   db: Session = Depends(get_db)
):
   """Resent verification email"""
   user = db.query(models.User).filter(models.User.email == email).first()

   if not user:
      raise HTTPException(status_code=404, detail="User not found")
   
   new_token = models.User.generate_verification_token()

   user.verification_token = new_token
   db.commit()

   background_tasks.add_task(
      send_verification_email,
      email=user.email,
      token=new_token
   )

   return {
      'message': 'Verification email resent'
   }

@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
  """Verify user's email address"""
  
  user = db.query(models.User).filter(models.User.verification_token == token).first()

  if not user:
     raise HTTPException(status_code=404, detail="User not found")
  
  user.is_verified = True
  user.verification_token = None
  db.commit()

  return {
     "message": "Email verified successfully"
  }

