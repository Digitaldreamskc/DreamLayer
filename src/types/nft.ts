export interface NFTMetadata {
    name: string;
    description: string;
    image: string;
    attributes?: Array<{
        trait_type: string;
        value: string | number;
    }>;
    animation_url?: string;
    external_url?: string;
}

export interface MintRequest {
    name: string;
    description: string;
    imageUrl: string;
    ownerAddress: string;
    attributes?: Array<{
        trait_type: string;
        value: string | number;
    }>;
}

export interface RegisterIPRequest {
    name: string;
    description: string;
    mediaUrl: string;
    contentHash: string;
    ownerAddress: string;
}