from eth_account import Account
from web3 import Web3
from typing import Dict, Optional
import json
import aiohttp
from ..models.nft import NFTMetadataCreate, NFTMetadataDB
from ..utils.config import settings
import logging

logger = logging.getLogger(__name__)

# ERC-7160 ABI (simplified version)
ERC7160_ABI = [
    {
        "inputs": [
            {"internalType": "string", "name": "uri", "type": "string"},
            {"internalType": "address", "name": "creator", "type": "address"}
        ],
        "name": "mint",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

class NFTService:
    def __init__(self):
        self.w3 = Web3(Web3.HTTPProvider(settings.BASE_RPC_URL))
        self.contract = self.w3.eth.contract(
            address=settings.NFT_CONTRACT_ADDRESS,
            abi=ERC7160_ABI
        )
        
    async def upload_metadata_to_irys(self, metadata: NFTMetadataCreate) -> str:
        """Upload metadata to Irys and return the URI"""
        try:
            metadata_json = metadata.model_dump_json()
            
            async with aiohttp.ClientSession() as session:
                headers = {
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {settings.IRYS_TOKEN}"
                }
                
                async with session.post(
                    f"{settings.IRYS_NODE}/upload",
                    headers=headers,
                    data=metadata_json
                ) as response:
                    if response.status != 200:
                        raise Exception("Failed to upload metadata to Irys")
                    
                    result = await response.json()
                    return f"{settings.IRYS_NODE}/{result['id']}"
        except Exception as e:
            logger.error(f"Error uploading metadata to Irys: {str(e)}")
            raise
    
    async def mint_nft(self, metadata: NFTMetadataCreate) -> NFTMetadataDB:
        """Mint NFT using ERC-7160 and return the token data"""
        try:
            # 1. Upload metadata to Irys
            metadata_uri = await self.upload_metadata_to_irys(metadata)
            
            # 2. Prepare the mint transaction
            account = Account.from_key(settings.NFT_PRIVATE_KEY)
            nonce = self.w3.eth.get_transaction_count(account.address)
            
            mint_txn = self.contract.functions.mint(
                metadata_uri,
                metadata.creator_address
            ).build_transaction({
                'from': account.address,
                'gas': 500000,  # Adjust as needed
                'gasPrice': self.w3.eth.gas_price,
                'nonce': nonce,
            })
            
            # 3. Sign and send transaction
            signed_txn = self.w3.eth.account.sign_transaction(mint_txn, settings.NFT_PRIVATE_KEY)
            tx_hash = self.w3.eth.send_raw_transaction(signed_txn.rawTransaction)
            
            # 4. Wait for transaction receipt
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            # 5. Get token ID from events (adjust based on your contract events)
            token_id = receipt['logs'][0]['topics'][1].hex()
            
            # 6. Create and return NFT metadata record
            return NFTMetadataDB(
                **metadata.model_dump(),
                token_id=token_id,
                metadata_uri=metadata_uri,
                transaction_hash=receipt['transactionHash'].hex()
            )
            
        except Exception as e:
            logger.error(f"Error minting NFT: {str(e)}")
            raise
    
    async def get_nft(self, token_id: str) -> Optional[NFTMetadataDB]:
        """Fetch NFT metadata from Irys"""
        try:
            # 1. Get metadata URI from contract
            metadata_uri = await self.contract.functions.tokenURI(int(token_id, 16)).call()
            
            # 2. Fetch metadata from Irys
            async with aiohttp.ClientSession() as session:
                async with session.get(metadata_uri) as response:
                    if response.status != 200:
                        return None
                    
                    metadata = await response.json()
                    return NFTMetadataDB(**metadata)
                    
        except Exception as e:
            logger.error(f"Error fetching NFT {token_id}: {str(e)}")
            return None
            
    async def update_nft_metadata(self, token_id: str, metadata_uri: str) -> bool:
        """Update NFT metadata URI"""
        try:
            account = Account.from_key(settings.NFT_PRIVATE_KEY)
            nonce = self.w3.eth.get_transaction_count(account.address)
            
            # Assuming your contract has an updateTokenURI function
            update_txn = self.contract.functions.updateTokenURI(
                int(token_id, 16),
                metadata_uri
            ).build_transaction({
                'from': account.address,
                'gas': 200000,
                'gasPrice': self.w3.eth.gas_price,
                'nonce': nonce,
            })
            
            signed_txn = self.w3.eth.account.sign_transaction(update_txn, settings.NFT_PRIVATE_KEY)
            tx_hash = self.w3.eth.send_raw_transaction(signed_txn.rawTransaction)
            
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            return receipt['status'] == 1
            
        except Exception as e:
            logger.error(f"Error updating NFT {token_id}: {str(e)}")
            return False