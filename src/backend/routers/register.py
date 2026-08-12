from fastapi import Depends, HTTPException, status,APIRouter
from sqlalchemy.orm import Session
from src.backend.database import get_db
from src.backend.models.model import UserCreate
from src.backend.security import get_password_hash
from src.backend.models.model_base import User

router = APIRouter(prefix="/auth", tags=["Register"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь с таким именем уже существует"
        )
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        username = user_data.username,
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Пользователь успешно зарегистрирован", "username": new_user.username}