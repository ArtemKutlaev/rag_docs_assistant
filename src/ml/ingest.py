from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

def create_vector_db(path_book:str) -> None:
    """
    Функция загружает PDF-документ, нарезает его на чанки, создает эмбеддинги
    и сохраняет их в локальную векторную базу данных ChromaDB.
    """
    pdf_path = Path(path_book)
    db_path = Path("vector_db")
    if not pdf_path.exists():
        raise FileNotFoundError(f"Файл не найден по пути: {pdf_path}")
    
    loader_pdf = PyPDFLoader(str(pdf_path))
    documents = loader_pdf.load()
    
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    chunks = text_splitter.split_documents(documents)
    
    embeddings = HuggingFaceEmbeddings(
        model_name="all-MiniLM-L6-v2"
    )
    vector_db = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=str(db_path)
    )

if __name__ == "__main__":
    create_vector_db("data/Rashka_book.pdf")