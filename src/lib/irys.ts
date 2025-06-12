import { WebIrys } from '@irys/sdk';
import { ethers } from 'ethers';

// Singleton pattern for Irys instance
let irysInstance: WebIrys | null = null;

export async function getIrysInstance() {
    if (irysInstance) return irysInstance;

    if (!process.env.IRYS_PRIVATE_KEY) {
        throw new Error('IRYS_PRIVATE_KEY not found in environment variables');
    }

    // Create a wallet from the private key
    const wallet = new ethers.Wallet(process.env.IRYS_PRIVATE_KEY);

    const webIrys = new WebIrys({
        url: 'https://node1.irys.xyz',
        token: 'matic',
        wallet,
    });

    await webIrys.ready();
    irysInstance = webIrys;
    return irysInstance;
}

export async function uploadToIrys(data: Buffer | string, contentType: string) {
    const irys = await getIrysInstance();
    
    try {
        const receipt = await irys.upload(data, {
            tags: [{ name: 'Content-Type', value: contentType }],
        });
        
        return {
            id: receipt.id,
            url: `https://gateway.irys.xyz/${receipt.id}`,
        };
    } catch (error) {
        console.error('Error uploading to Irys:', error);
        throw new Error('Failed to upload to Irys');
    }
}