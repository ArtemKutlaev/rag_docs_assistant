from datetime import datetime, timedelta,timezone
from typing import Optional
from jose import jwt
from src.config import SECRET_KEY,ALGORITHM,ACCESS_TOKEN_EXPIRE_MINUTES
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from fastapi import HTTPException, status,Depends
from sqlalchemy.orm import Session
from src.backend.database import get_db
from src.backend.models.model_base import User


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def create_access_token(data:dict, expires_delta: Optional[timedelta] = None):
    """Создает и подписывает JWT-токен доступа.
    Args:
        data (dict): Словарь с полезной нагрузкой (например, {"sub": username}).
        expires_delta (Optional[timedelta]): Кастомное время жизни токена.
            Если не указано, используется значение по умолчанию (ACCESS_TOKEN_EXPIRE_MINUTES).

    Returns:
        str: Зашифрованная строка JWT-токена.
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY,algorithm=ALGORITHM)
    return encoded_jwt

def verify_access_token(token:str):
    """Декодирует и проверяет валидность JWT-токена.

    Args:
        token (str): Строка JWT-токена, полученная от клиента.

    Returns:
        Optional[str]: Имя пользователя (username / sub), если токен подлинный
            и не просрочен. Возвращает None в случае ошибки или истечения срока.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username : str = payload.get("sub")
        if username is None:
            return None
        return username
    except JWTError:
        return None
    

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Зависимость (Dependency) для FastAPI: проверяет токен авторизации
    и возвращает объект текущего активного пользователя из базы данных.
    Args:
        token (str): Токен из заголовка Authorization (извлекается автоматически).
        db (Session): Сессия базы данных.

    Returns:
        User: Объект модели User из базы данных.

    Raises:
        HTTPException(401): Если токен недействителен, просрочен
            или пользователь не найден в базе.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Не удалось проверить учетные данные",
        headers={"Authorization": "Bearer"},
    )
    
    username = verify_access_token(token)
    if username is None:
        raise credentials_exception
    
    user = db.query(User).filter(User.username == username).first()
    
    if user is None:
        raise credentials_exception
    return user