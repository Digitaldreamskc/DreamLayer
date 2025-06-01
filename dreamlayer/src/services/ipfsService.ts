import { Irys } from '@irys/sdk'

// Initialize Irys client
const irys = new Irys({
  url: 'https://node2.irys.xyz',
  token: 'solana',
  key: process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEVGN0IzRENDNTFiYkZGNjI5N2UxOWVDMUZGRkVDMUMyNDg2QzZmMjkiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2MjY5Njk3OTQ0MzgsIm5hbWUiOiJoYWNrYXRob24tZGVtbyJ9.YuXek1hDmHYfVwKJCYOALkVKe3xH6VjqwY6ifaL4YYU'
})

/**
 * Uploads a file to IPFS using Irys
 * @param file File to upload
 * @returns Object containing CID and URL of the uploaded file
 */
export async function uploadToIPFS(file: File) {
  try {
    // Upload file to Irys
    const receipt = await irys.uploadFile(file, {
      tags: [
        { name: 'Content-Type', value: file.type },
        { name: 'File-Name', value: file.name }
      ]
    })

    return {
      cid: receipt.id,
      url: `https://gateway.irys.xyz/${receipt.id}`,
    }
  } catch (error) {
    console.error('Failed to upload to IPFS:', error)
    throw new Error('Failed to upload to IPFS. Please try again.')
  }
}

/**
 * Uploads JSON metadata to IPFS
 * @param metadata Object containing metadata
 * @returns CID of the uploaded metadata
 */
export async function uploadMetadataToIPFS(metadata: object) {
  try {
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
    throw new Error('Failed to upload metadata to IPFS. Please try again.')
  }
}
