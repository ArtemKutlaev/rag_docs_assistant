from fastapi import APIRouter,Depends
from src.backend.models.model_base import User
from src.backend.jwt import get_current_user
from src.backend.models.model import ChatRequest
from src.ml import vector_search
from src.services.llm import get_answer_yandex


router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/ask")
def get_answer_on_query(body: ChatRequest, current_user: User = Depends(get_current_user)):
    context = vector_search(body.query,body.book_id)
    result = get_answer_yandex(context, body.query)
    return {"result": result}
    
    
    