from fastapi import APIRouter, Depends
from src.backend.jwt import get_current_user
from src.backend.models.model_base import User

router = APIRouter(prefix="/books", tags=["Books"])

@router.get("/my")
def my_books(current_user: User = Depends(get_current_user)):
    """Возвращает список книг, которые загрузил только текущий авторизованный пользователь."""
    
    result = []
    for book in current_user.books:
        result.append(
            {
                "id" : book.id,
                "title" : book.title,
                "file_path" : book.file_path,
                "is_public" : book.is_public
            }
        )
    return result