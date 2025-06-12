from fastapi import APIRouter, UploadFile, HTTPException
from typing import Dict
import aiohttp
from ..utils.config import settings
import json

router = APIRouter()

async def upload_to_irys(file_data: bytes, content_type: str) -> Dict:
    try:
        # Initialize Irys upload
        headers = {
            "Content-Type": content_type,
            "Authorization": f"Bearer {settings.IRYS_TOKEN}"
        }
        
        async with aiohttp.ClientSession() as session:
            # Upload to Irys
            async with session.post(
                f"{settings.IRYS_NODE}/upload",
                headers=headers,
                data=file_data
            ) as response:
                if response.status != 200:
                    raise HTTPException(status_code=500, detail="Failed to upload to Irys")
                
                result = await response.json()
                return {
                    "transaction_id": result["id"],
                    "url": f"{settings.IRYS_NODE}/{result['id']}"
                }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload")
async def upload_file(file: UploadFile):
    """
    Upload a file to Irys and return the transaction ID and URL
    """
    if not file:
        raise HTTPException(status_code=400, detail="No file provided")
    
    # Read file content
    file_content = await file.read()
    
    # Upload to Irys
    result = await upload_to_irys(file_content, file.content_type)
    
    return {
        "status": "success",
        "transaction_id": result["transaction_id"],
        "url": result["url"],
        "filename": file.filename,
        "content_type": file.content_type
    }