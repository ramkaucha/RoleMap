# Database models/tables

from sqlalchemy import Boolean, Column, Integer, String, DateTime, ForeignKey, Enum as SQLAlchemyEnum
from sqlalchemy import func
from sqlalchemy.orm import relationship
from .database import Base
from passlib.context import CryptContext
from . import schemas

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    applications = relationship("Application", back_populates="user")

    @classmethod
    def get_password_hash(cls, password):
        return pwd_context.hash(password)

    def verify_password(self, plain_password):
        return pwd_context.verify(plain_password, self.hashed_password)

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String, index=True)
    role = Column(String, index=True)
    status = Column(SQLAlchemyEnum(schemas.ApplicationStatus))
    location = Column(String)
    link = Column(String)
    comments = Column(String, nullable=True)
    category = Column(String)
    date_applied = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="applications")
    