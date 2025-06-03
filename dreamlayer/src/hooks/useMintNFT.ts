import { useCallback, useState } from 'react'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { StoryClient } from '@story-protocol/core-sdk'
import { createPublicClient, http } from 'viem'
import { showToast } from '@/utils/toast'

// Service for uploading to IPFS
import { uploadToIPFS } from '@/services/ipfsService'
// Supabase client for logging assets
import { supabase } from '@/lib/supabaseClient'

// Story Protocol Aeneid Testnet Chain ID
const STORY_CHAIN_ID = 1315

export function useMintNFT() {
    const { address, chain } = useAccount()
    const chainId = useChainId()
    const { switchChain } = useSwitchChain()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const mint = useCallback(async (file: File, metadata: { title: string; description: string }) => {
        if (!address) {
            showToast.error('Error', 'Please connect your wallet first')
            throw new Error('Wallet not connected')
        }

        // Check if we're on the correct network
        if (chain?.id !== STORY_CHAIN_ID) {
            showToast.info('Switching Network', 'Please switch to Story Protocol Aeneid Testnet')
            try {
                await switchChain({ chainId: STORY_CHAIN_ID })
            } catch (error) {
                showToast.error('Network Error', 'Failed to switch network. Please switch manually to Story Protocol Aeneid Testnet')
                throw new Error('Failed to switch network')
            }
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            // Step 1: Upload file to IPFS
            showToast.info('Uploading', 'Uploading file to IPFS...')
            const ipfsResult = await uploadToIPFS(file)
            const ipfsUrl = `ipfs://${ipfsResult.cid}`

            // Step 2: Configure Story Protocol client
            const client = StoryClient.newClient({
                chainId: STORY_CHAIN_ID,
                rpcUrl: 'https://aeneid.storyrpc.io',
            })

            // Step 3: Register IP Asset with Story Protocol
            showToast.info('Registering', 'Registering IP on Story Protocol...')
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
            showToast.info('Logging', 'Logging asset to database...')
            await logAssetToSupabase({
                assetId: String(result.tokenId || ''),
                title: metadata.title,
                description: metadata.description,
                ipfsUrl,
                ownerAddress: address,
                txHash: result.txHash || ''
            })

            setIsLoading(false)
            showToast.success('Success', 'IP registered successfully!')
            return {
                success: true,
                assetId: result.tokenId,
                ipfsUrl,
                txHash: result.txHash
            }
        } catch (error) {
            console.error('Registration failed:', error)
            const errorMessage = error instanceof Error ? error.message : 'Failed to register IP'
            setError(errorMessage)
            showToast.error('Registration Failed', errorMessage)
            setIsLoading(false)
            throw error
        }
    }, [address, chain?.id, switchChain])

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