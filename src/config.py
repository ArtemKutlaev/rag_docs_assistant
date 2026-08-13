from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv('YANDEX_GPT_API')
folder_id = os.getenv('FOLDER_ID')
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))