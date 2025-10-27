import openai
from app.core.config import OPENAI_API_KEY

openai.api_key = OPENAI_API_KEY

def get_embedding(text: str, model="text-embedding-3-small") -> list[float]:
   text = text.replace("\n", " ")
   return openai.embeddings.create(input = [text], model=model).data[0].embedding
