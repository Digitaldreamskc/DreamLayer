from fastapi import APIRouter, HTTPException, Depends
from typing import Dict
from ..models.nft import NFTMetadataCreate, NFTMetadataDB, NFTUpdate
from ..services.nft import NFTService
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

async def get_nft_service():
    return NFTService()

@router.post("/nft/mint", response_model=NFTMetadataDB)
async def mint_nft(
    metadata: NFTMetadataCreate,
    nft_service: NFTService = Depends(get_nft_service)
):
    """
    Mint a new NFT with the provided metadata
    """
    try:
        return await nft_service.mint_nft(metadata)
    except Exception as e:
        logger.error(f"Error in mint_nft endpoint: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to mint NFT. Please try again later."
        )

@router.get("/nft/{token_id}", response_model=NFTMetadataDB)
async def get_nft(
    token_id: str,
    nft_service: NFTService = Depends(get_nft_service)
):
    """
    Get NFT information by token ID
    """
    try:
        nft = await nft_service.get_nft(token_id)
        if not nft:
            raise HTTPException(
                status_code=404,
                detail=f"NFT with token ID {token_id} not found"
            )
        return nft
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in get_nft endpoint: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch NFT data. Please try again later."
        )

@router.put("/nft/{token_id}", response_model=NFTMetadataDB)
async def update_nft(
    token_id: str,
    update_data: NFTUpdate,
    nft_service: NFTService = Depends(get_nft_service)
):
    """
    Update NFT metadata
    """
    try:
        # 1. Get current NFT data
        current_nft = await nft_service.get_nft(token_id)
        if not current_nft:
            raise HTTPException(
                status_code=404,
                detail=f"NFT with token ID {token_id} not found"
            )
        
        # 2. Update metadata with new values
        updated_metadata = current_nft.model_copy(update=update_data.model_dump(exclude_unset=True))
        
        # 3. Upload updated metadata to Irys
        metadata_uri = await nft_service.upload_metadata_to_irys(updated_metadata)
        
        # 4. Update metadata URI in contract
        success = await nft_service.update_nft_metadata(token_id, metadata_uri)
        if not success:
            raise HTTPException(
                status_code=500,
                detail="Failed to update NFT metadata on-chain"
            )
        
        # 5. Return updated NFT data
        return await nft_service.get_nft(token_id)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in update_nft endpoint: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to update NFT metadata. Please try again later."
        )