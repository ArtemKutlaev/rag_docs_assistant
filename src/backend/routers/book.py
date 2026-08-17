from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse

from sqlalchemy.orm import Session

from src.backend.database import get_db
from src.backend.jwt import get_current_user
from src.backend.models.model_base import Book, User


router = APIRouter(prefix="/book", tags=["Books"])


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


@router.get("/{book_id}/read")
def read_book(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    book = get_accessible_book(book_id, current_user, db)

    file_path = Path(book.file_path)

    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Файл книги не найден.",
        )

    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename=file_path.name,
        content_disposition_type="inline",
    )


@router.get("/{book_id}/download")
def download_book(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    book = get_accessible_book(book_id, current_user, db)

    file_path = Path(book.file_path)

    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Файл книги не найден.",
        )

    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename=file_path.name,
        content_disposition_type="attachment",
    )