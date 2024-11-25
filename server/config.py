import os
from dotenv import load_dotenv


class Config:
    load_dotenv()
    
    MYSQL_HOST = os.getenv('MYSQL_HOST', os.getenv('MYSQL_HOST'))
    MYSQL_USER = os.getenv('MYSQL_USER', os.getenv('MYSQL_USER'))
    MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', os.getenv('MYSQL_PASSWORd'))  # Configurar como variable de entorno
    MYSQL_DB = os.getenv('MYSQL_DB', os.getenv('MYSQL_DB'))
    DEBUG = True
    SECRET_KEY = os.getenv('SECRET_KEY', os.getenv('SECRET_KEY'))  # Se recomienda cambiarla a algo único y seguro