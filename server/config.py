import os
from dotenv import load_dotenv
from supabase import create_client, Client

class Config:
    load_dotenv()
    # Basic Flask app configuration
    SECRET_KEY = os.environ.get("SECRET_KEY", os.getenv("SECRET_KEY"))
    
    # Supabase configuration
    SUPABASE_URL = os.environ.get("SUPABASE_URL", os.getenv("SUPABASE_URL"))
    SUPABASE_SERVICE_KEY = os.getenv("SECRET_KEY")  # Use service role key for admin access
    
    @staticmethod
    def get_supabase_client() -> Client:
        if not Config.SUPABASE_URL or not Config.SUPABASE_SERVICE_KEY:
            raise ValueError("Supabase URL and Service Key must be configured")
        return create_client(Config.SUPABASE_URL, Config.SUPABASE_SERVICE_KEY)

def create_bucket_if_not_exists(client: Client, bucket_name: str) -> bool:
    try:
        buckets = client.storage.list_buckets()
        if not any(bucket.name == bucket_name for bucket in buckets):
            client.storage.create_bucket(bucket_name, options={
                'public': True,
                'file_size_limit': 52428800,  # 50MB in bytes
                'allowed_mime_types': [
                    'image/jpeg',
                    'image/png',
                    'application/pdf'
                ]
            })
        return True
    except Exception as e:
        print(f"Error creating bucket: {str(e)}")
        return False

# Create a global Supabase client instance
supabase = Config.get_supabase_client()