# Defines Pydantic models for request/response validation

from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime
import re
from enum import Enum

class ApplicationStatus(str, Enum):
    APPLIED = 'applied'
    ONLINE_ASSESSMENT = "online assessment"
    INTERVIEWING = "interviewing"
    REJECTED = "rejected"
    GHOSTED = "ghosted"

class UserBase(BaseModel):
    email: EmailStr

class ApplicationBase(BaseModel):
    company: str
    role: str
    status: str
    location: str
    link: str
    comments: Optional[str] = None
    category: str
    date_applied: datetime

    # @field_validator('date_applied')
    # @classmethod
    # def validate_date(cls, v):
    #     now = datetime.now(pytz.UTC)
    #     if v >= now:
    #         raise ValueError('Applications data cannot be in the future')
        
    #     return v

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