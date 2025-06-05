// types.ts
export interface NFTTag {
  name: string;
  value: string;
}

export interface NFTMetadata {
  name?: string;
  description?: string;
  image?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface NFT {
  id: string;
  tokenId: string;
  contractAddress: string;
  owner: string;
  metadata: NFTMetadata;
  tags: NFTTag[];
  contentType: 'image' | 'video' | 'audio' | 'other';
  createdAt: string;
  updatedAt: string;
  isDynamic: boolean;
}

export type NFTFilterType = 'all' | 'dynamic' | 'image';

export interface SearchNFTParams {
  limit?: number;
  offset?: number;
  owner?: string;
  contentType?: string;
}