from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.backend.database import get_db
from src.backend.models.model_base import Book,User
from src.backend.jwt import get_current_user


router = APIRouter(prefix="/books", tags=["Books"])


@router.get("/all")
def all_books(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Публичная страница: Возвращает список всех книг в системе, у которых стоит флаг is_public=True, доступна всем"""
    books = db.query(Book).filter(Book.is_public == True).all()
    
    result = []
    for book in books:
        result.append(
            {
                "id" : book.id,
                "title" : book.title,
                "file_path" : book.file_path,
                "owner_username" : book.owner.username if book.owner else "Неизвестен"
            }
        )
    return result