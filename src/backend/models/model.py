from pydantic import BaseModel

class QueryRequest(BaseModel):
    """Валидация запроса пользователя"""
    user_query:str
    
class UserCreate(BaseModel):
    """Валидация пользователя"""
    username: str
    password: str
    password_confirm:str
    
class ChatRequest(BaseModel):
    """Валидация запроса пользователя в чате"""
    query: str
    book_id: int
    
    
