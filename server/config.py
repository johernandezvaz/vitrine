import os
from dotenv import load_dotenv
from supabase import create_client, Client

class Config:
    load_dotenv()
    # Configuración básica de la aplicación Flask
    SECRET_KEY = os.environ.get("SECRET_KEY", os.getenv("SECRET_KEY"))
    
    # Configuración de Supabase
    SUPABASE_URL = os.environ.get("SUPABASE_URL", os.getenv("SUPABASE_URL"))
    SUPABASE_KEY = os.environ.get("SUPABASE_KEY", os.getenv("SUPABASE_KEY"))
    
    @staticmethod
    def get_supabase_client() -> Client:
        if not Config.SUPABASE_URL or not Config.SUPABASE_KEY:
            raise ValueError("Supabase URL y Key deben configurarse")
        return create_client(Config.SUPABASE_URL, Config.SUPABASE_KEY)

# Crea una instancia del cliente Supabase para que esté disponible globalmente
supabase = Config.get_supabase_client()
