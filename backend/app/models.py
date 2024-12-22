# Database models/tables

from sqlalchemy import Boolean, Column, Integer, String, DateTime
from sqlalchemy import func
from .database import Base
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    @classmethod
    def get_password_hash(cls, password):
        return pwd_context.hash(password)

    def verify_password(self, plain_password):
        return pwd_context.verify(plain_password, self.hashed_password)
