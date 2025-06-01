import { Uploader } from "@irys/upload"
import { Ethereum } from "@irys/upload-ethereum"
import { showToast } from '@/utils/toast'
import { encryptData, decryptData } from './litService'
import { updateTokenDataWithProgrammableData, readTokenData } from './programmableDataService'

// Initialize Irys client with proper token support
const getIrysUploader = async () => {
  const privateKey = process.env.NEXT_PUBLIC_IRYS_PRIVATE_KEY
  if (!privateKey) {
    throw new Error('IRYS_PRIVATE_KEY is not configured. Please add it to your .env.local file')
  }

  const irysUploader = await Uploader(Ethereum).withWallet(privateKey)
  return irysUploader
}

interface DynamicNFTMetadata {
  name: string
  description: string
  image: string
  attributes: {
    trait_type: string
    value: string | number
  }[]
  properties: {
    files: {
      uri: string
      type: string
    }[]
    category: string
  }
  encryptedData?: {
    ciphertext: string
    dataToEncryptHash: string
  }
}

// Define standard tags for our application
const APP_TAGS = {
  APPLICATION_ID: { name: 'application-id', value: 'DreamLayer-DynamicNFT' },
  VERSION: { name: 'version', value: '1.0.0' },
  TYPE: { name: 'type', value: 'nft' }
}

// Define search criteria types
interface NFTSearchCriteria {
  applicationId?: string
  nftType?: 'primary' | 'metadata' | 'content'
  assetType?: 'image' | 'metadata' | 'programmable-data'
  storageType?: 'programmable'
  startDate?: Date
  endDate?: Date
  mutable?: boolean
  rootTxId?: string
  limit?: number
  offset?: number
}

interface NFTSearchResult {
  id: string
  tags: Array<{ name: string; value: string }>
  timestamp: number
  url: string
}

/**
 * Creates a dynamic NFT with metadata stored on Irys and optional encrypted data
 * @param metadata NFT metadata
 * @param imageFile Image file for the NFT
 * @param encryptedContent Optional content to encrypt and store
 * @param nftContractAddress Optional NFT contract address for access control
 * @param useProgrammableData Whether to use Programmable Data for storage
 * @returns Object containing the transaction ID and metadata URL
 */
export async function createDynamicNFT(
  metadata: DynamicNFTMetadata,
  imageFile: File,
  encryptedContent?: string,
  nftContractAddress?: string,
  useProgrammableData: boolean = false
) {
  try {
    showToast.info('Creating', 'Preparing dynamic NFT...')
    const irys = await getIrysUploader()

    // Step 1: Upload image to Irys with enhanced tags
    showToast.info('Uploading', 'Uploading image to Irys...')
    const imageReceipt = await irys.uploadFile(imageFile, {
      tags: [
        APP_TAGS.APPLICATION_ID,
        APP_TAGS.VERSION,
        { name: 'Content-Type', value: imageFile.type },
        { name: 'File-Name', value: imageFile.name },
        { name: 'Asset-Type', value: 'image' },
        { name: 'NFT-Type', value: 'primary' }
      ]
    })

    // Step 2: Update metadata with image URL
    const updatedMetadata = {
      ...metadata,
      image: `https://gateway.irys.xyz/${imageReceipt.id}`,
      properties: {
        ...metadata.properties,
        files: [
          {
            uri: `https://gateway.irys.xyz/${imageReceipt.id}`,
            type: imageFile.type
          }
        ]
      }
    }

    // Step 3: Handle content based on storage method
    if (encryptedContent) {
      if (useProgrammableData) {
        // Upload content to Irys for Programmable Data with enhanced tags
        const contentReceipt = await irys.uploadFile(
          new File([encryptedContent], 'content.txt', { type: 'text/plain' }),
          {
            tags: [
              APP_TAGS.APPLICATION_ID,
              APP_TAGS.VERSION,
              { name: 'Content-Type', value: 'text/plain' },
              { name: 'Asset-Type', value: 'programmable-data' },
              { name: 'Storage-Type', value: 'programmable' },
              { name: 'NFT-Type', value: 'content' }
            ]
          }
        )
        updatedMetadata.properties.files.push({
          uri: `https://gateway.irys.xyz/${contentReceipt.id}`,
          type: 'text/plain'
        })
      } else {
        // Use Lit Protocol for encryption
        const { ciphertext, dataToEncryptHash } = await encryptData(encryptedContent, nftContractAddress)
        updatedMetadata.encryptedData = { ciphertext, dataToEncryptHash }
      }
    }

    // Step 4: Upload metadata to Irys with enhanced tags and mutable reference
    showToast.info('Uploading', 'Uploading metadata to Irys...')
    const metadataString = JSON.stringify(updatedMetadata)
    const metadataFile = new File([metadataString], 'metadata.json', { type: 'application/json' })
    
    const metadataReceipt = await irys.uploadFile(metadataFile, {
      tags: [
        APP_TAGS.APPLICATION_ID,
        APP_TAGS.VERSION,
        { name: 'Content-Type', value: 'application/json' },
        { name: 'File-Name', value: 'metadata.json' },
        { name: 'Asset-Type', value: 'metadata' },
        { name: 'NFT-Type', value: 'metadata' },
        { name: 'Mutable', value: 'true' },
        { name: 'Created-At', value: new Date().toISOString() }
      ]
    })

    showToast.success('Success', 'Dynamic NFT created successfully!')
    return {
      txId: metadataReceipt.id,
      metadataUrl: `https://gateway.irys.xyz/mutable/${metadataReceipt.id}`,
      imageUrl: `https://gateway.irys.xyz/${imageReceipt.id}`
    }
  } catch (error) {
    console.error('Failed to create dynamic NFT:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create dynamic NFT'
    showToast.error('Creation Failed', errorMessage)
    throw new Error(errorMessage)
  }
}

/**
 * Updates an existing dynamic NFT's metadata using transaction chaining
 * @param rootTxId Original transaction ID
 * @param newMetadata New metadata to update
 * @param encryptedContent Optional new encrypted content
 * @param nftContractAddress Optional NFT contract address for access control
 * @param useProgrammableData Whether to use Programmable Data for storage
 * @returns Object containing the new transaction ID and metadata URL
 */
export async function updateDynamicNFT(
  rootTxId: string,
  newMetadata: Partial<DynamicNFTMetadata>,
  encryptedContent?: string,
  nftContractAddress?: string,
  useProgrammableData: boolean = false
) {
  try {
    showToast.info('Updating', 'Preparing NFT update...')
    const irys = await getIrysUploader()

    // Step 1: Fetch existing metadata
    const response = await fetch(`https://gateway.irys.xyz/${rootTxId}`)
    const existingMetadata = await response.json()

    // Step 2: Handle content based on storage method
    if (encryptedContent) {
      if (useProgrammableData) {
        // Upload content to Irys for Programmable Data with enhanced tags
        const contentReceipt = await irys.uploadFile(
          new File([encryptedContent], 'content.txt', { type: 'text/plain' }),
          {
            tags: [
              APP_TAGS.APPLICATION_ID,
              APP_TAGS.VERSION,
              { name: 'Content-Type', value: 'text/plain' },
              { name: 'Asset-Type', value: 'programmable-data' },
              { name: 'Storage-Type', value: 'programmable' },
              { name: 'NFT-Type', value: 'content' },
              { name: 'Update-Of', value: rootTxId }
            ]
          }
        )
        newMetadata.properties = {
          ...newMetadata.properties,
          files: [
            ...(newMetadata.properties?.files || []),
            {
              uri: `https://gateway.irys.xyz/${contentReceipt.id}`,
              type: 'text/plain'
            }
          ]
        }
      } else {
        // Use Lit Protocol for encryption
        const { ciphertext, dataToEncryptHash } = await encryptData(encryptedContent, nftContractAddress)
        newMetadata.encryptedData = { ciphertext, dataToEncryptHash }
      }
    }

    // Step 3: Merge with new metadata
    const updatedMetadata = {
      ...existingMetadata,
      ...newMetadata,
      properties: {
        ...existingMetadata.properties,
        ...newMetadata.properties
      }
    }

    // Step 4: Upload updated metadata with enhanced tags and transaction chaining
    showToast.info('Uploading', 'Uploading updated metadata...')
    const metadataString = JSON.stringify(updatedMetadata)
    const metadataFile = new File([metadataString], 'metadata.json', { type: 'application/json' })
    
    const receipt = await irys.uploadFile(metadataFile, {
      tags: [
        APP_TAGS.APPLICATION_ID,
        APP_TAGS.VERSION,
        { name: 'Content-Type', value: 'application/json' },
        { name: 'File-Name', value: 'metadata.json' },
        { name: 'Asset-Type', value: 'metadata' },
        { name: 'NFT-Type', value: 'metadata' },
        { name: 'Mutable', value: 'true' },
        { name: 'Root-TX', value: rootTxId },
        { name: 'Updated-At', value: new Date().toISOString() },
        { name: 'Update-Type', value: 'metadata' }
      ]
    })

    showToast.success('Success', 'Dynamic NFT updated successfully!')
    return {
      txId: receipt.id,
      metadataUrl: `https://gateway.irys.xyz/mutable/${rootTxId}`
    }
  } catch (error) {
    console.error('Failed to update dynamic NFT:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to update dynamic NFT'
    showToast.error('Update Failed', errorMessage)
    throw new Error(errorMessage)
  }
}

/**
 * Fetches and decrypts metadata for a dynamic NFT
 * @param txId Transaction ID of the NFT
 * @param nftContractAddress Optional NFT contract address for access control
 * @param useProgrammableData Whether to use Programmable Data for storage
 * @returns The decrypted NFT metadata and content
 */
export async function fetchDynamicNFTMetadata(
  txId: string,
  nftContractAddress?: string,
  useProgrammableData: boolean = false
) {
  try {
    const response = await fetch(`https://gateway.irys.xyz/${txId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch NFT metadata')
    }
    const metadata = await response.json()

    // Handle content based on storage method
    let decryptedContent: string | undefined
    if (useProgrammableData && metadata.properties?.files) {
      // Find the programmable data file
      const programmableDataFile = metadata.properties.files.find(
        (file: any) => file.type === 'text/plain' && file.uri.includes('programmable-data')
      )
      if (programmableDataFile) {
        const contentResponse = await fetch(programmableDataFile.uri)
        decryptedContent = await contentResponse.text()
      }
    } else if (metadata.encryptedData) {
      decryptedContent = await decryptData(
        metadata.encryptedData.ciphertext,
        metadata.encryptedData.dataToEncryptHash,
        nftContractAddress
      )
    }

    return {
      metadata,
      decryptedContent
    }
  } catch (error) {
    console.error('Failed to fetch NFT metadata:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch NFT metadata'
    showToast.error('Fetch Failed', errorMessage)
    throw new Error(errorMessage)
  }
}

/**
 * Search for NFTs using various criteria
 * @param criteria Search criteria for filtering NFTs
 * @returns Array of NFT search results
 */
export async function searchNFTs(criteria: NFTSearchCriteria): Promise<NFTSearchResult[]> {
  try {
    showToast.info('Searching', 'Searching for NFTs...')
    const irys = await getIrysUploader()

    // Build tag filters
    const tagFilters = []
    
    // Add application ID filter
    if (criteria.applicationId) {
      tagFilters.push({ name: 'application-id', values: [criteria.applicationId] })
    } else {
      // Default to our application
      tagFilters.push({ name: 'application-id', values: [APP_TAGS.APPLICATION_ID.value] })
    }

    // Add NFT type filter
    if (criteria.nftType) {
      tagFilters.push({ name: 'NFT-Type', values: [criteria.nftType] })
    }

    // Add asset type filter
    if (criteria.assetType) {
      tagFilters.push({ name: 'Asset-Type', values: [criteria.assetType] })
    }

    // Add storage type filter
    if (criteria.storageType) {
      tagFilters.push({ name: 'Storage-Type', values: [criteria.storageType] })
    }

    // Add mutable filter
    if (criteria.mutable !== undefined) {
      tagFilters.push({ name: 'Mutable', values: [criteria.mutable.toString()] })
    }

    // Add root transaction filter
    if (criteria.rootTxId) {
      tagFilters.push({ name: 'Root-TX', values: [criteria.rootTxId] })
    }

    // Build date range filter if provided
    const dateFilters = []
    if (criteria.startDate) {
      dateFilters.push({ operator: '>=', value: criteria.startDate.toISOString() })
    }
    if (criteria.endDate) {
      dateFilters.push({ operator: '<=', value: criteria.endDate.toISOString() })
    }

    // Execute search query
    const results = await irys.search({
      tags: tagFilters,
      from: criteria.startDate?.toISOString(),
      to: criteria.endDate?.toISOString(),
      limit: criteria.limit || 50,
      offset: criteria.offset || 0
    })

    // Transform results
    const searchResults: NFTSearchResult[] = results.map(tx => ({
      id: tx.id,
      tags: tx.tags,
      timestamp: tx.timestamp,
      url: `https://gateway.irys.xyz/${tx.id}`
    }))

    showToast.success('Success', `Found ${searchResults.length} NFTs`)
    return searchResults
  } catch (error) {
    console.error('Failed to search NFTs:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to search NFTs'
    showToast.error('Search Failed', errorMessage)
    throw new Error(errorMessage)
  }
}

/**
 * Helper function to search for NFTs by content type
 * @param contentType The content type to search for
 * @param limit Maximum number of results to return
 * @returns Array of NFT search results
 */
export async function searchNFTsByContentType(contentType: string, limit: number = 50): Promise<NFTSearchResult[]> {
  return searchNFTs({
    assetType: contentType as any,
    limit
  })
}

/**
 * Helper function to search for mutable NFTs
 * @param limit Maximum number of results to return
 * @returns Array of NFT search results
 */
export async function searchMutableNFTs(limit: number = 50): Promise<NFTSearchResult[]> {
  return searchNFTs({
    mutable: true,
    limit
  })
}

/**
 * Helper function to search for NFTs by date range
 * @param startDate Start date for search
 * @param endDate End date for search
 * @param limit Maximum number of results to return
 * @returns Array of NFT search results
 */
export async function searchNFTsByDateRange(
  startDate: Date,
  endDate: Date,
  limit: number = 50
): Promise<NFTSearchResult[]> {
  return searchNFTs({
    startDate,
    endDate,
    limit
  })
} 