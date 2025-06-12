from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "DreamLayer"
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    CORS_ORIGINS: List[str] = ["*"]  # Update with specific origins in production
    
    # Irys Configuration
    IRYS_NODE: str = "https://node1.irys.xyz"
    IRYS_TOKEN: str
    
    # NFT Configuration
    NFT_NETWORK: str = "base-goerli"  # or "base-mainnet"
    NFT_PRIVATE_KEY: str
    NFT_CONTRACT_ADDRESS: str
    
    # Base Network Configuration
    BASE_RPC_URL: str = "https://goerli.base.org"  # Update for mainnet
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()