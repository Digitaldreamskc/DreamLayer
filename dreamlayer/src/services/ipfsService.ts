"use client";

import { WebIrys } from '@irys/sdk'
import { ethers } from 'ethers'
import { showToast } from '@/utils/toast'

// Initialize Irys client
const getIrysClient = async () => {
  await window.ethereum.request({ method: 'eth_requestAccounts' })
  const provider = new ethers.providers.Web3Provider(window.ethereum)

  const webIrys = new WebIrys({
    network: 'devnet', // or 'mainnet'
    token: 'ethereum',
    wallet: { provider }
  })

  await webIrys.ready()
  return webIrys
}

/**
 * Uploads a file to IPFS using Irys
 * @param file File to upload
 * @returns Object containing CID and URL of the uploaded file
 */
export const uploadToIrys = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload-to-irys', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload to Irys');
    }

    const { url } = await response.json();
    return url;

  } catch (error) {
    console.error('Irys upload error:', error);
    throw error;
  }
};

/**
 * Uploads JSON metadata to IPFS
 * @param metadata Object containing metadata
 * @returns CID of the uploaded metadata
 */
export async function uploadMetadataToIPFS(metadata: object) {
  try {
    showToast.info('Uploading', 'Preparing metadata for upload...')
    
    // Convert metadata to JSON string
    const jsonString = JSON.stringify(metadata)
    
    // Create a File object from the JSON string
    const metadataFile = new File(
      [jsonString], 
      'metadata.json', 
      { type: 'application/json' }
    )
    
    // Upload to IPFS
    const result = await uploadToIPFS(metadataFile)
    return result
  } catch (error) {
    console.error('Failed to upload metadata to IPFS:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload metadata to IPFS'
    showToast.error('Upload Failed', errorMessage)
    throw new Error(errorMessage)
  }
}
