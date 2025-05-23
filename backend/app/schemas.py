# Defines Pydantic models for request/response validation

from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime
import re
from enum import Enum

class EmailVerification(BaseModel):
    token: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = None

class ApplicationStatus(str, Enum):
    APPLIED = 'applied'
    ONLINE_ASSESSMENT = "online assessment"
    INTERVIEWING = "interviewing"
    REJECTED = "rejected"
    GHOSTED = "ghosted"
    TO_APPLY = 'to apply'

class ProfilePictureType(str, Enum):
    LOCAL = 'local',
    URL = 'url',
    S3 = 's3'

class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    profile_picture: Optional[str] = None
    profile_picture_type: Optional[ProfilePictureType] = None

    @field_validator('profile_picture')
    @classmethod
    def validate_profile_picture(cls, v: Optional[str], values: dict) -> Optional[str]:
        if v is None:
            return v
        
        pic_type = values.get('profile_picture_type')
        if pic_type == ProfilePictureType.URL:
            if not v.startswith('http://', 'https://'):
                raise ValueError('URL must start with http:// or https://')
        
        allowed_extensions = { '.jpg', '.jpeg', '.png', '.gif' }
        file_ext = v.lower().split('.')[-1]
        if not any(v.lower().endswith(ext) for ext in allowed_extensions):
            raise ValueError(f'File must be one of: {", ".join(allowed_extensions)}')

        return v

class ApplicationBase(BaseModel):
    company: str
    role: str
    status: str
    location: str
    link: str
    comments: Optional[str] = None
    category: str
    date_applied: datetime

class ApplicationCreate(ApplicationBase):
    pass

class UserCreate(UserBase):
    password: str

    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError('Password must be more than 8 characters long')
        
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one number')
        
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain at least one special character')
        

        return v

class Application(ApplicationBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    applications: list[Application] = []
    is_verified: bool
    verification_token: Optional[str] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class ApplicationList(BaseModel):
    items: list[Application]
    total: int
    has_more: bool

    class Config:
        from_attributes = True
