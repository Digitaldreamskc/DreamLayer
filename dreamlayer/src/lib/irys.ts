import { WebIrys } from "@irys/sdk";
import { ethers } from "ethers";

// Initialize Irys with different providers based on chain
const getIrys = async (chain: 'solana' | 'base') => {
    const url = "https://node2.irys.xyz";
    
    if (chain === 'solana') {
        const provider = (window as any).solana;
        if (!provider) throw new Error("No Solana wallet found");
        
        const irys = new WebIrys({
            url,
            token: "solana",
            wallet: { provider }
        });
        
        await irys.ready();
        return irys;
    } else {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const wallet = await provider.getSigner();
        
        const irys = new WebIrys({
            url,
            token: "eth",
            wallet: { provider: wallet }
        });
        
        await irys.ready();
        return irys;
    }
};

export const uploadToIrys = async (
    data: any,
    chain: 'solana' | 'base',
    tags: Array<{ name: string; value: string }> = []
): Promise<string> => {
    try {
        const irys = await getIrys(chain);
        
        // Add default tags
        const defaultTags = [
            { name: "Content-Type", value: "application/json" },
            { name: "App-Name", value: "DreamLayer" },
            { name: "Chain", value: chain }
        ];
        
        const receipt = await irys.upload(
            JSON.stringify(data),
            { tags: [...defaultTags, ...tags] }
        );
        
        return receipt.id;
    } catch (error) {
        console.error("Failed to upload to Irys:", error);
        throw error;
    }
};