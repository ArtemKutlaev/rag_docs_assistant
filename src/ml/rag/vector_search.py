from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from pathlib import Path


def search_in_db(query:str, book_id: int, k: int = 3):
    """Ищет k самых похожих чанков в векторной базе данных ChromaDB по текстовому запросу.

    Args:
        query (str): Текстовый запрос пользователя.
        book_id(int): Уникальный ID созданной книги, используемый для формирования уникальной директории векторной базы.
        k (int): Количество наиболее похожих чанков для возврата.

    Returns:
        List[Tuple[Document, float]]: Список кортежей, где каждый элемент содержит 
        объект документа (Document) с текстом и метрику схожести/расстояния (float).
    """
    db_path = f"vector_db/book_{book_id}"
    embeddings = HuggingFaceEmbeddings(
        model_name= "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
        )
    
    vector_db = Chroma(
        persist_directory=db_path,
        embedding_function=embeddings
    )
    
    results = vector_db.similarity_search_with_score(query,k)
    
    return results