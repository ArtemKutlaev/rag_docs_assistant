from src.ml.vector_search import search_in_db
from src.services.templates.prompt import get_prompt
from src.services.llm import get_answer_yandex

if __name__ == "__main__":
    user_query = input("Введите ваш вопрос: ")
    
    print("Ищем информацию в книге...")
    
    docs = search_in_db(user_query,k=5)
    
    context_text = "\n\n".join([doc.page_content for doc, score in docs])
    
    print("Генерируем ответ с помощью YandexGPT")
    
    answer = get_answer_yandex(context_text,user_query)
    print("Ответ:")
    print(answer)