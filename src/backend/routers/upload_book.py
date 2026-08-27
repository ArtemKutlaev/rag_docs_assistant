from fastapi import APIRouter,Depends,UploadFile,File, HTTPException,Form
from sqlalchemy.orm import Session
from src.backend.database import get_db
from src.backend.models.model_base import User
from src.backend.jwt import get_current_user
from pathlib import Path
import shutil
from src.backend.models.model_base import Book
from src.ml.auxiliary.all_processing import all_processing



router = APIRouter(prefix= "/book", tags=["Books"])

@router.post("/upload")
def upload_and_vectorize_books(title: str = Form(...),
                               is_public: bool = Form(...),
                               file: UploadFile = File(...),
                               db: Session = Depends(get_db),
                               current_user : User = Depends(get_current_user)):
    
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code = 400, detail="Поддерживаются только PDF-файлы")
    
    books_dir = Path("data/book")
    books_dir.mkdir(parents=True, exist_ok=True)
    file_path = books_dir / file.filename
    try:
        with open(file_path,"wb") as book:
            shutil.copyfileobj(file.file,book)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при сохранении файла на диск: {e}")
    
    new_book = Book(
        title = title,
        file_path = str(file_path),
        is_public = is_public,
        owner_id = current_user.id
    )
    db.add(new_book)
    db.flush()
    
    try: 
        tags = all_processing(path_book=str(file_path), book_id= new_book.id)
        new_book.tags = tags
        db.commit()
        db.refresh(new_book)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при создании векторной базы: {e}")
    return {
        "message": "Книга успешно загружена, сохранена и векторизована!",
        "book_id": new_book.id,
        "title": new_book.title,
        "vector_dir": f"vector_db/book_{new_book.id}"
    }