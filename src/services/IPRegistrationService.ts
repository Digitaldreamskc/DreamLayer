import { Address } from 'viem'
import { WebIrys } from "@irys/sdk"
import { StoryClient } from '@story-protocol/core-sdk'
import { ERC6551_REGISTRY, ERC6551_IMPLEMENTATION, ERC6551_REGISTRY_ABI } from '../config/erc6551Config'

export enum IPAssetType {
  ORIGINAL = 'ORIGINAL',
  DERIVATIVE = 'DERIVATIVE',
  COLLECTION = 'COLLECTION'
}

export const LICENSE_FRAMEWORKS = {
  BASIC_COMMERCIAL: '1',
  CREATIVE_COMMONS: '2',
}

export const DEFAULT_LICENSE_PARAMS = {
  commercialUse: true,
  commercialAttribution: true,
  commercialRevShare: 0,
  derivativesAllowed: true,
  derivativesReciprocal: false,
  territories: ['*'],
  distributionChannels: ['*'],
  contentRestrictions: [],
  validFrom: Math.floor(Date.now() / 1000),
  validTo: Math.floor(Date.now() / 1000) + (10 * 365 * 24 * 60 * 60), // 10 years
}

export class IPRegistrationService {
  constructor(
    private provider: any,
    private storyClient: StoryClient,
    private isClientReady: boolean = false
  ) {
    if (!storyClient || !isClientReady) {
      throw new Error('Story Protocol client is not ready');
    }
  }

  async getIrys() {
    const webIrys = new WebIrys({
      url: "https://node1.irys.xyz",
      token: "base",
      provider: this.provider
    })
    await webIrys.ready()
    return webIrys
  }

  async uploadToIrys(file: File, metadata: any) {
    try {
      const irys = await this.getIrys()
      
      const fileTag = { name: "Content-Type", value: file.type }
      const fileUpload = await irys.uploadFile(file, { tags: [fileTag] })
      
      const metadataWithFile = {
        ...metadata,
        content: `https://arweave.net/${fileUpload.id}`
      }
      const metadataUpload = await irys.upload(JSON.stringify(metadataWithFile))
      
      return {
        contentId: fileUpload.id,
        metadataId: metadataUpload.id,
        contentUrl: `https://arweave.net/${fileUpload.id}`,
        metadataUrl: `https://arweave.net/${metadataUpload.id}`
      }
    } catch (error) {
      console.error('Failed to upload to Irys:', error)
      throw error
    }
  }

  async createTBA(
    tokenContract: Address,
    tokenId: bigint,
    salt: bigint = 0n
  ): Promise<Address> {
    try {
      const tx = await this.provider.writeContract({
        address: ERC6551_REGISTRY,
        abi: ERC6551_REGISTRY_ABI,
        functionName: 'createAccount',
        args: [
          ERC6551_IMPLEMENTATION,
          8453n, // Base chainId
          tokenContract,
          tokenId,
          salt
        ]
      })

      const receipt = await tx.wait()
      
      const tbaAddress = await this.provider.readContract({
        address: ERC6551_REGISTRY,
        abi: ERC6551_REGISTRY_ABI,
        functionName: 'account',
        args: [
          ERC6551_IMPLEMENTATION,
          8453n,
          tokenContract,
          tokenId,
          salt
        ]
      })

      return tbaAddress as Address
    } catch (error) {
      console.error('Failed to create TBA:', error)
      throw error
    }
  }

  async registerWithStoryProtocol(
    name: string,
    description: string,
    mediaUrl: string,
    assetType: IPAssetType,
    registrantAddress: Address
  ) {
    try {
      if (!this.isClientReady) {
        throw new Error('Story Protocol client is not ready');
      }

      const registration = await this.storyClient.ipAsset.register({
        name,
        description,
        mediaUrl,
        type: assetType,
        registrantAddress
      })

      await this.storyClient.licensing.createPolicy({
        ipId: registration.ipId,
        policyFrameworkId: LICENSE_FRAMEWORKS.BASIC_COMMERCIAL,
        params: DEFAULT_LICENSE_PARAMS
      })

      return registration
    } catch (error) {
      console.error('Story Protocol registration failed:', error)
      throw error
    }
  }

  async registerIPWithTBA(
    nftContract: Address,
    tokenId: bigint,
    ipMetadata: {
      name: string,
      description: string,
      file: File,
      assetType: IPAssetType
    }
  ) {
    try {
      const uploadResult = await this.uploadToIrys(ipMetadata.file, {
        name: ipMetadata.name,
        description: ipMetadata.description,
        type: ipMetadata.assetType
      })

      const tbaAddress = await this.createTBA(nftContract, tokenId)

      const registration = await this.registerWithStoryProtocol(
        ipMetadata.name,
        ipMetadata.description,
        uploadResult.contentUrl,
        ipMetadata.assetType,
        tbaAddress
      )

      return {
        tbaAddress,
        ipId: registration.ipId,
        contentUrl: uploadResult.contentUrl,
        metadataUrl: uploadResult.metadataUrl
      }
    } catch (error) {
      console.error('Failed to register IP with TBA:', error)
      throw error
    }
  }
}