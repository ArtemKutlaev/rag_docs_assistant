from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter


def prepare_chunks(path_book:str):
    """Функция делит книгу на чанки"""
    pdf_path = Path(path_book)
    if not pdf_path.exists():
        raise FileNotFoundError(f"Файл не найден по пути: {pdf_path}")
            
    loader_pdf = PyPDFLoader(str(pdf_path))
    documents = loader_pdf.load()
            
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=600,
        chunk_overlap=50
    )
    chunks = text_splitter.split_documents(documents)
    return chunks