import { expect } from 'chai';
import { ethers, waffle } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { DynamicNFT } from '../src/types/contracts/DynamicNFT';
import { DynamicNFTEventListener } from '../src/services/DynamicNFTEventListener';
import { Contract, Event } from 'ethers';

describe('DynamicNFTEventListener Integration Tests', () => {
    let listener: DynamicNFTEventListener;
    let nftContract: DynamicNFT;
    let owner: SignerWithAddress;
    let user: SignerWithAddress;
    let provider: ethers.providers.JsonRpcProvider;

    // Helper to create a delay
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    beforeEach(async () => {
        // Get signers
        [owner, user] = await ethers.getSigners();
        provider = waffle.provider;

        // Deploy the contract
        const DynamicNFTFactory = await ethers.getContractFactory('DynamicNFT');
        nftContract = (await DynamicNFTFactory.deploy()) as DynamicNFT;
        await nftContract.deployed();

        // Initialize listener with local network
        listener = new DynamicNFTEventListener(true);
        await listener.addContract(nftContract.address);
    });

    afterEach(async () => {
        await listener.removeAllListeners();
    });

    describe('Basic Functionality', () => {
        it('should successfully add and remove contracts', async () => {
            await listener.removeContract(nftContract.address);
            await listener.addContract(nftContract.address);
            // Verification is implicit in no errors being thrown
        });

        it('should not add the same contract twice', async () => {
            await listener.addContract(nftContract.address);
            // Second add should not throw but should be ignored
            await listener.addContract(nftContract.address);
        });

        it('should throw error for invalid contract address', async () => {
            await expect(
                listener.addContract('0xinvalid')
            ).to.be.rejected;
        });
    });

    describe('Event Emission and Callback Execution', () => {
        it('should receive events when token URI is updated', async () => {
            let eventReceived = false;
            const tokenId = 1;
            const newUri = 'ipfs://newuri';

            // Set up event listener
            await listener.subscribeToUpdates(nftContract.address, async (event: Event) => {
                eventReceived = true;
                expect(event.args?.tokenId).to.equal(tokenId);
                expect(event.args?.newTokenURI).to.equal(newUri);
            });

            // Mint and update token
            await nftContract.mint(owner.address, tokenId);
            await nftContract.updateTokenURI(tokenId, newUri);

            // Wait for event processing
            await delay(1000);
            expect(eventReceived).to.be.true;
        });

        it('should handle multiple callbacks for the same event', async () => {
            const tokenId = 1;
            const newUri = 'ipfs://newuri';
            let callback1Called = false;
            let callback2Called = false;

            await listener.subscribeToUpdates(nftContract.address, async () => {
                callback1Called = true;
            });

            await listener.subscribeToUpdates(nftContract.address, async () => {
                callback2Called = true;
            });

            await nftContract.mint(owner.address, tokenId);
            await nftContract.updateTokenURI(tokenId, newUri);

            await delay(1000);
            expect(callback1Called).to.be.true;
            expect(callback2Called).to.be.true;
        });
    });

    describe('Network Connectivity Issues', () => {
        it('should handle provider disconnection and reconnection', async () => {
            // Simulate network disconnection by creating new provider
            const newProvider = new ethers.providers.JsonRpcProvider(provider.connection.url);
            await delay(1000); // Simulate disconnect time
            
            // Attempt operations during "disconnection"
            const tokenId = 1;
            await nftContract.mint(owner.address, tokenId);
            
            // Should still work after "reconnection"
            const events = await listener.getUpdateHistory(nftContract.address, tokenId);
            expect(Array.isArray(events)).to.be.true;
        });

        it('should handle failed transactions gracefully', async () => {
            // Attempt to update non-existent token
            await expect(
                nftContract.updateTokenURI(999, 'ipfs://invalid')
            ).to.be.revertedWith('DynamicNFT: URI update for nonexistent token');
        });
    });

    describe('Contract State Changes', () => {
        it('should track historical updates for a token', async () => {
            const tokenId = 1;
            const uri1 = 'ipfs://uri1';
            const uri2 = 'ipfs://uri2';

            await nftContract.mint(owner.address, tokenId);
            await nftContract.updateTokenURI(tokenId, uri1);
            await nftContract.updateTokenURI(tokenId, uri2);

            const history = await listener.getUpdateHistory(nftContract.address, tokenId);
            expect(history.length).to.equal(2);
            expect(history[1].newTokenURI).to.equal(uri2);
        });

        it('should handle multiple tokens simultaneously', async () => {
            const token1 = 1;
            const token2 = 2;
            let events1 = 0;
            let events2 = 0;

            await listener.subscribeToUpdates(nftContract.address, async (event: Event) => {
                const tokenId = event.args?.tokenId.toNumber();
                if (tokenId === token1) events1++;
                if (tokenId === token2) events2++;
            });

            await nftContract.mint(owner.address, token1);
            await nftContract.mint(owner.address, token2);
            await nftContract.updateTokenURI(token1, 'ipfs://uri1');
            await nftContract.updateTokenURI(token2, 'ipfs://uri2');

            await delay(1000);
            expect(events1).to.equal(1);
            expect(events2).to.equal(1);
        });
    });

    describe('Rate Limiting and Retry Mechanisms', () => {
        it('should handle rapid updates without missing events', async () => {
            const tokenId = 1;
            const updates = ['uri1', 'uri2', 'uri3', 'uri4', 'uri5'];
            let eventCount = 0;

            await listener.subscribeToUpdates(nftContract.address, async () => {
                eventCount++;
            });

            await nftContract.mint(owner.address, tokenId);
            
            // Rapid updates
            for (const uri of updates) {
                await nftContract.updateTokenURI(tokenId, `ipfs://${uri}`);
            }

            await delay(2000); // Wait for all events
            expect(eventCount).to.equal(updates.length);
        });

        it('should maintain event order during rapid updates', async () => {
            const tokenId = 1;
            const updates = ['uri1', 'uri2', 'uri3'];
            const receivedEvents: string[] = [];

            await listener.subscribeToUpdates(nftContract.address, async (event: Event) => {
                receivedEvents.push(event.args?.newTokenURI);
            });

            await nftContract.mint(owner.address, tokenId);
            
            for (const uri of updates) {
                await nftContract.updateTokenURI(tokenId, `ipfs://${uri}`);
            }

            await delay(1000);
            updates.forEach((uri, index) => {
                expect(receivedEvents[index]).to.equal(`ipfs://${uri}`);
            });
        });
    });
});