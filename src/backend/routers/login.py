from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.backend.database import get_db
from src.backend.models.model import UserCreate
from src.backend.security import verify_password
from src.backend.models.model_base import User

router = APIRouter(prefix="/auth", tags=["Login"])

@router.post("/login")
def login(user_data: UserCreate, db: Session = Depends(get_db)):
    
    user = db.query(User).filter(User.username == user_data.username).first()
    
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверное имя пользователя или пароль"
        )
    return {"message":"Успешный вход!", "username":user.username}