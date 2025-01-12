from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from ...app import models, schemas, auth, analytics
from ..database import get_db
from ..utils.email import send_verification_email

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
  form_data: 
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