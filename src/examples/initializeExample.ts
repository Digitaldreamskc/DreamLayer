/* eslint-disable no-console */
import { DynamicNFTInitializer } from '../services/DynamicNFTInitializer';

async function initializeNFTService() {
    try {
        // Create initializer instance (use true for testnet)
        const initializer = new DynamicNFTInitializer(true);

        // Connect with your private key
        const { provider, signer, irys } = await initializer.connect(process.env.PRIVATE_KEY!);

        // Check balances
        const ethBalance = await initializer.getBalance();
        console.log('ETH Balance:', ethers.utils.formatEther(ethBalance));

        const irysBalance = await initializer.getIrysBalance();
        console.log('Irys Balance:', irysBalance);

        // Fund Irys if needed (amount in base units)
        if (irysBalance.eq(0)) {
            await initializer.fundIrys('100000000000000000'); // 0.1 MATIC
        }

        return { provider, signer, irys };
    } catch (error) {
        console.error('Failed to initialize NFT service:', error);
        throw error;
    }
}

// Usage example
async function main() {
    try {
        const { provider, signer, irys } = await initializeNFTService();
        console.log('NFT service initialized successfully!');
        
        // Now you can use these initialized services for deploying and managing your NFTs
        
    } catch (error) {
        console.error('Error in main:', error);
    }
}

export { initializeNFTService, main };