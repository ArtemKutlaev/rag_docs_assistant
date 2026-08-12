from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv('YANDEX_GPT_API')
folder_id = os.getenv('FOLDER_ID')