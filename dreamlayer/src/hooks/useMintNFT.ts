import { useCallback, useState } from 'react'
import { useAccount } from 'wagmi'
import { StoryClient } from '@story-protocol/core-sdk'
import { createPublicClient, http } from 'viem'

// Service for uploading to IPFS
import { uploadToIPFS } from '@/services/ipfsService'
// Supabase client for logging assets
import { supabase } from '@/lib/supabaseClient'

export function useMintNFT() {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mint = useCallback(async (file: File, metadata: { title: string; description: string }) => {
    if (!address) {
      throw new Error('Wallet not connected')
    }

    setIsLoading(true)
    setError(null)

    try {
      // Step 1: Upload file to IPFS
      const ipfsResult = await uploadToIPFS(file)
      const ipfsUrl = `ipfs://${ipfsResult.cid}`
      
      // Step 2: Configure Story Protocol client with correct Aeneid testnet details
      const client = StoryClient.newClient({
        chainId: 1315, // Correct Chain ID for Story Aeneid Testnet
        rpcUrl: 'https://aeneid.storyrpc.io',
      })

      // Step 3: Register IP Asset with Story Protocol
      const result = await client.ipAsset.register({
        txOptions: {
          from: address,
        },
        metadata: {
          name: metadata.title,
          description: metadata.description,
          mediaUrl: ipfsUrl,
        },
      })

      // Step 4: Log asset to Supabase
      await logAssetToSupabase({
        assetId: String(result.tokenId || ''),
        title: metadata.title,
        description: metadata.description,
        ipfsUrl,
        ownerAddress: address,
        txHash: result.txHash || ''
      })
      
      setIsLoading(false)
      return {
        success: true,
        assetId: result.tokenId,
        ipfsUrl,
        txHash: result.txHash
      }
    } catch (error) {
      console.error('Registration failed:', error)
      setError(error instanceof Error ? error.message : 'Failed to register IP')
      setIsLoading(false)
      throw error
    }
  }, [address])

  return { mint, isLoading, error }
}

// Function to log the asset to Supabase
async function logAssetToSupabase(data: {
  assetId: string;
  title: string;
  description: string;
  ipfsUrl: string;
  ownerAddress: string;
  txHash: string;
}) {
  try {
    const { error } = await supabase
      .from('ip_assets')
      .insert([
        {
          asset_id: data.assetId,
          title: data.title,
          description: data.description,
          ipfs_url: data.ipfsUrl,
          owner_address: data.ownerAddress,
          tx_hash: data.txHash,
          created_at: new Date().toISOString()
        }
      ])

    if (error) throw error
    return true
  } catch (error) {
    console.error('Failed to log asset to Supabase:', error)
    return false
  }
}
