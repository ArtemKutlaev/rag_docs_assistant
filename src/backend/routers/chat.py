from fastapi import APIRouter,Depends,HTTPException,status
from src.backend.models.model_base import User,Book
from src.backend.jwt import get_current_user
from src.backend.models.model import ChatRequest
from src.ml.vector_search import search_in_db
from src.services.llm import get_answer_yandex
from sqlalchemy.orm import Session
from src.backend.database import get_db

router = APIRouter(prefix="/chat", tags=["Chat"])



def get_accessible_book(
    book_id: int,
    current_user: User,
    db: Session,
) -> Book:
    book = db.query(Book).filter(Book.id == book_id).first()

    if book is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Книга не найдена.",
        )

    if not book.is_public and book.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="У вас нет доступа к этой книге.",
        )

    return book

@router.post("/ask")
def get_answer_on_query(body: ChatRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    get_accessible_book(
        book_id=body.book_id,
        current_user=current_user,
        db=db,
    )
    context = search_in_db(body.query,body.book_id)
    result = get_answer_yandex(context, body.query)
    return {"result": result}
    
    
    