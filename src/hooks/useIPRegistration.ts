import { useState } from 'react'
import { Address } from 'viem'
import { IPRegistrationService, IPAssetType } from '../services/IPRegistrationService'
import { useStoryClient } from './useStoryClient'

interface UseIPRegistrationProps {
  provider: any;
  nftContract: Address;
}

interface RegistrationResult {
  tbaAddress: Address;
  ipId: string;
  contentUrl: string;
  metadataUrl: string;
}

export const useIPRegistration = ({ provider, nftContract }: UseIPRegistrationProps) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<RegistrationResult | null>(null)
  const { client: storyClient, isReady } = useStoryClient()

  const registerIP = async (
    tokenId: bigint,
    data: {
      name: string;
      description: string;
      file: File;
      assetType: IPAssetType;
    }
  ) => {
    if (!storyClient || !isReady) {
      setError('Story Protocol client not ready');
      return;
    }

    setLoading(true)
    setError(null)
    
    try {
      const service = new IPRegistrationService(provider, storyClient)
      const result = await service.registerIPWithTBA(
        nftContract,
        tokenId,
        data
      )
      
      setResult(result)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setLoading(false)
    setError(null)
    setResult(null)
  }

  return {
    registerIP,
    loading,
    error,
    result,
    reset,
    isReady
  }
}