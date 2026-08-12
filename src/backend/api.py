from fastapi import FastAPI
from src.backend.database import engine, Base
from src.backend.routers import register, login

Base.metadata.create_all(bind=engine)
app = FastAPI()

app.include_router(register.router)
app.include_router(login.router)

@app.get("/")
def read_root():
    return {"message": "Сервер работает!"}