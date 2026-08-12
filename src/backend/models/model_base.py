from sqlalchemy import Column,Integer,String, Boolean,ForeignKey
from sqlalchemy.orm import relationship
from src.backend.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    books = relationship("Book",back_populates="owner")


class Book(Base):
    __tablename__ = "books"
    id = Column(Integer, primary_key=True,index=True)
    title = Column(String,index=True)
    file_path = Column(String)
    is_public = Column(Boolean,default=True)
    owner_id = Column(Integer,ForeignKey("users.id"))
    owner = relationship("User", back_populates="books")