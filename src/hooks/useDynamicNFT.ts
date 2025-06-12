import { useState, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { createDynamicNFT, updateDynamicNFT, fetchDynamicNFTMetadata } from '@/services/dynamicNFTService'
import type { DynamicNFTMetadata } from '@/services/dynamicNFTService'

export function useDynamicNFT() {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = useCallback(async (metadata: DynamicNFTMetadata, imageFile: File) => {
    if (!address) {
      throw new Error('Wallet not connected')
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await createDynamicNFT(metadata, imageFile)
      setIsLoading(false)
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create dynamic NFT'
      setError(errorMessage)
      setIsLoading(false)
      throw error
    }
  }, [address])

  const update = useCallback(async (txId: string, newMetadata: Partial<DynamicNFTMetadata>) => {
    if (!address) {
      throw new Error('Wallet not connected')
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await updateDynamicNFT(txId, newMetadata)
      setIsLoading(false)
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update dynamic NFT'
      setError(errorMessage)
      setIsLoading(false)
      throw error
    }
  }, [address])

  const fetchMetadata = useCallback(async (txId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const metadata = await fetchDynamicNFTMetadata(txId)
      setIsLoading(false)
      return metadata
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch NFT metadata'
      setError(errorMessage)
      setIsLoading(false)
      throw error
    }
  }, [])

  return {
    create,
    update,
    fetchMetadata,
    isLoading,
    error
  }
} 