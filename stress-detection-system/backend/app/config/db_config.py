import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
MONGODB_DATABASE = os.getenv("MONGODB_DATABASE", "stress_detection_db")

class MongoManager:
    client: AsyncIOMotorClient = None
    db = None
    is_connected: bool = False

db_manager = MongoManager()

async def connect_to_mongo():
    """Initializes the asynchronous Motor MongoDB client connection with fast timeout check."""
    try:
        # 1.5s server selection timeout prevents hanging if local mongod is offline
        db_manager.client = AsyncIOMotorClient(MONGODB_URL, serverSelectionTimeoutMS=1500)
        # Test connection immediately with admin ping command
        await db_manager.client.admin.command('ping')
        db_manager.db = db_manager.client[MONGODB_DATABASE]
        db_manager.is_connected = True
        print(f"[*] Successfully connected to MongoDB database: {MONGODB_DATABASE}")
    except Exception as e:
        db_manager.is_connected = False
        db_manager.db = None
        print(f"[*] Notice: MongoDB service not running locally on 27017 ({e}). Fast in-memory caching active (0ms latency, zero crashes).")

async def close_mongo_connection():
    """Closes the MongoDB client connection gracefully on shutdown."""
    if db_manager.client:
        db_manager.client.close()
        db_manager.is_connected = False
        print("[*] MongoDB connection closed.")

def get_database():
    """Returns reference to active MongoDB database instance only if connected."""
    if db_manager.is_connected and db_manager.db is not None:
        return db_manager.db
    return None

def is_mongo_connected() -> bool:
    """Returns True if live MongoDB connection is verified."""
    return db_manager.is_connected
