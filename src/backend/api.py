from fastapi import FastAPI
from src.backend.database import engine, Base
from src.backend.routers import register, login,all_books,my_books,chat,upload_book,book
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(register.router)
app.include_router(login.router)
app.include_router(all_books.router)
app.include_router(my_books.router)
app.include_router(chat.router)
app.include_router(upload_book.router)
app.include_router(book.router)
