from src.ml.rag.ingest import create_vector_db
from src.ml.auxiliary.loader import prepare_chunks
from src.ml.NER.ner import extract_tags

def all_processing(path_book:str, book_id: int):
    """ Главная функция предобработки книги,делит на чанки, находит теги,сохраняет векторную базу"""
    chunks = prepare_chunks(path_book)
    if not chunks:
        raise ValueError("Не удалось извлечь текст из PDF")

    combined_text = "\n".join(
        chunk.page_content
        for chunk in chunks[:5]
        if chunk.page_content
    )
    tags = extract_tags(combined_text)
    create_vector_db(book_id, chunks)
    return tags
    
    