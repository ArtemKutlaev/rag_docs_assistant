from src.config import api_key,folder_id
from src.services.templates.prompt import get_prompt
from yandex_ai_studio_sdk import AIStudio

def get_answer_yandex(context:str,query:str) -> str:
    """Функция, которая возвращает ответ от Yandex LLM

    Args:
        context (str): Контекст из книги
        query (str): Вопрос пользователя

    Returns:
        str: Текст ответа
    """
    
    try: 
        sdk = AIStudio(
            folder_id=folder_id,
            auth= api_key
        )
        
        model = (
            sdk.models.completions("yandexgpt").configure(
                temperature= 0.2,
                max_tokens=700
            )
        )
        result = model.run(get_prompt(context, query))
        if result and len(result) > 0:
            return result[0].text
        else:
            return 'Не удалось получить ответ от модели: пустой результат'
    except Exception as e:
        print(f"Ошибка при запросе к YandexGPT: {e}")
        return f"Произошла ошибка при вызове модели: {e}"