import { StoryClient, StoryConfig } from '@story-protocol/core-sdk';
import { ethers } from 'ethers';

let storyClient: StoryClient | null = null;

export async function getStoryClient() {
    if (storyClient) return storyClient;

    if (!process.env.STORY_PROTOCOL_PRIVATE_KEY) {
        throw new Error('STORY_PROTOCOL_PRIVATE_KEY not found');
    }

    const wallet = new ethers.Wallet(
        process.env.STORY_PROTOCOL_PRIVATE_KEY
    );

    const config: StoryConfig = {
        chainId: 11155111, // Sepolia testnet
        privateKey: process.env.STORY_PROTOCOL_PRIVATE_KEY,
    };

    storyClient = new StoryClient(config);
    return storyClient;
}

export async function registerIPAsset(
    name: string,
    description: string,
    mediaUrl: string,
    contentHash: string,
    ownerAddress: string
) {
    const client = await getStoryClient();

    try {
        const registration = await client.ipAsset.register({
            name,
            description,
            mediaUrl,
            contentHash,
            transferable: true,
            txOptions: {
                waitForTransaction: true,
            },
        });

        // Transfer to the actual owner
        if (registration.ipId && ownerAddress) {
            await client.ipAsset.transfer({
                ipId: registration.ipId,
                to: ownerAddress,
                txOptions: {
                    waitForTransaction: true,
                },
            });
        }

        return registration;
    } catch (error) {
        console.error('Story Protocol registration error:', error);
        throw new Error('Failed to register IP asset');
    }
}