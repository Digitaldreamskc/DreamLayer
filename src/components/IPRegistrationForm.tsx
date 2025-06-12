'use client'

import React, { useState, useEffect } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { Address } from 'viem';
import { useIPRegistration } from '../hooks/useIPRegistration';
import { IPAssetType } from '../services/IPRegistrationService';
import { useIPRegistrationContext } from '../contexts/IPRegistrationContext';
import { useStoryClient } from '../hooks/useStoryClient';
import { toast } from 'sonner';

const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as Address;

interface FormData {
  name: string;
  description: string;
  assetType: IPAssetType;
}

export const IPRegistrationForm: React.FC = () => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { client: storyClient, isLoading: clientLoading, error: clientError } = useStoryClient();
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    assetType: IPAssetType.ORIGINAL
  });

  const {
    currentTokenId,
    startRegistration,
    completeRegistration,
    failRegistration
  } = useIPRegistrationContext();

  const {
    registerIP,
    loading,
    error,
    result,
    reset
  } = useIPRegistration({
    provider: walletClient,
    nftContract: NFT_CONTRACT_ADDRESS
  });

  // Handle successful registration
  useEffect(() => {
    if (result) {
      toast.success('IP Registration successful!');
      completeRegistration(currentTokenId, result);
    }
  }, [result, currentTokenId, completeRegistration]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      if (currentTokenId) {
        failRegistration(currentTokenId, error);
      }
    }
  }, [error, currentTokenId, failRegistration]);

  // Handle client errors
  useEffect(() => {
    if (clientError) {
      toast.error(clientError.message);
    }
  }, [clientError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !address || !walletClient || !storyClient) {
      toast.error('Please ensure all requirements are met');
      return;
    }

    try {
      startRegistration(currentTokenId);
      
      await registerIP(
        currentTokenId,
        {
          name: formData.name,
          description: formData.description,
          file,
          assetType: formData.assetType
        }
      );

      // Reset form on success
      setFormData({
        name: '',
        description: '',
        assetType: IPAssetType.ORIGINAL
      });
      setFile(null);
      
    } catch (err) {
      console.error('Registration failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      failRegistration(currentTokenId, errorMessage);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  if (!address) {
    return (
      <div className="text-center p-6">
        Please connect your wallet to register IP
      </div>
    );
  }

  if (clientLoading) {
    return (
      <div className="text-center p-6">
        Initializing Story Protocol client...
      </div>
    );
  }

  if (clientError) {
    return (
      <div className="text-center p-6 text-red-600">
        Failed to initialize Story Protocol: {clientError.message}
      </div>
    );
  }

  if (!storyClient) {
    return (
      <div className="text-center p-6">
        Story Protocol client not available
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Register IP with Story Protocol</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... rest of the form remains the same ... */}
      </form>

      {result && (
        <div className="mt-6 p-4 bg-green-50 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Registration Successful!</h3>
          <div className="space-y-2 text-sm">
            <p><strong>TBA Address:</strong> {result.tbaAddress}</p>
            <p><strong>IP ID:</strong> {result.ipId}</p>
            <p><strong>Content URL:</strong> <a href={result.contentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{result.contentUrl}</a></p>
            <p><strong>Metadata URL:</strong> <a href={result.metadataUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{result.metadataUrl}</a></p>
          </div>
          <button
            onClick={reset}
            className="mt-4 text-blue-600 hover:underline"
          >
            Register Another Asset
          </button>
        </div>
      )}
    </div>
  );
}