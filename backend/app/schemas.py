# Defines Pydantic models for request/response validation

from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime
import re

class UserBase(BaseModel):
    email: EmailStr


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

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str