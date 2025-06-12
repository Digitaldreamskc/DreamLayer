from pydantic import BaseModel, Field, HttpUrl
from typing import Dict, List, Optional
from datetime import datetime
from enum import Enum

class MetadataVersion(str, Enum):
    V1 = "1.0.0"
    V2 = "2.0.0"

class NFTAttribute(BaseModel):
    trait_type: str
    value: str
    display_type: Optional[str] = None

class NFTMetadataBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1, max_length=1000)
    image_url: HttpUrl
    external_url: Optional[HttpUrl] = None
    attributes: List[NFTAttribute] = []
    version: MetadataVersion = MetadataVersion.V2

class NFTMetadataCreate(NFTMetadataBase):
    creator_address: str = Field(..., pattern="^0x[a-fA-F0-9]{40}$")
    
class NFTMetadataDB(NFTMetadataBase):
    token_id: str
    metadata_uri: str
    creator_address: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    transaction_hash: str
    
class NFTUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, min_length=1, max_length=1000)
    image_url: Optional[HttpUrl] = None
    attributes: Optional[List[NFTAttribute]] = None