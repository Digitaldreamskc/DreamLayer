import { StoryClient } from '@story-protocol/core-sdk'
import { http } from 'viem'
import { baseSepolia } from 'viem/chains'

// Configuration for creating StoryClient
export const STORY_PROTOCOL_CONFIG = {
  chainId: baseSepolia.id, // Using the numeric chain ID from viem
  transport: http(`https://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
  ipAssetRegistryAddress: process.env.NEXT_PUBLIC_IP_ASSET_REGISTRY_ADDRESS,
  ipAssetOrganizerAddress: process.env.NEXT_PUBLIC_IP_ASSET_ORGANIZER_ADDRESS,
  licensingModuleAddress: process.env.NEXT_PUBLIC_LICENSING_MODULE_ADDRESS,
}

// IP Asset Types enum
export enum IPAssetType {
  ORIGINAL = 'ORIGINAL',
  DERIVATIVE = 'DERIVATIVE',
  COLLECTION = 'COLLECTION'
}

// License Framework IDs
export const LICENSE_FRAMEWORKS = {
  BASIC_COMMERCIAL: '1', // Basic Commercial License Framework ID
  CREATIVE_COMMONS: '2', // Creative Commons License Framework ID
}

// Default license parameters
export const DEFAULT_LICENSE_PARAMS = {
  commercialUse: true,
  commercialAttribution: true,
  commercialRevShare: 0, // 0%
  derivativesAllowed: true,
  derivativesReciprocal: false,
  territories: ['*'], // All territories
  distributionChannels: ['*'], // All channels
  contentRestrictions: [], // No restrictions
  validFrom: Math.floor(Date.now() / 1000), // Current timestamp
  validTo: Math.floor(Date.now() / 1000) + (10 * 365 * 24 * 60 * 60), // 10 years from now
}