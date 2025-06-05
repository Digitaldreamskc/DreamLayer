"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useWallet } from "@/lib/wallet";
import { Connection, clusterApiUrl, PublicKey, SystemProgram, LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js';
import { ethers } from 'ethers';
import { uploadToIrys } from '@/lib/irys';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ImageIcon, Upload, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { processImage, DEFAULT_IMAGE_CONFIG, ProcessedImage, ImageValidationError } from "@/utils/imageUtils";

// NFT Contract configurations
const NFT_CONTRACT_ABI = [
    "function mint(string memory tokenURI) public returns (uint256)",
    "function balanceOf(address owner) view returns (uint256)",
    "function ownerOf(uint256 tokenId) view returns (address)"
];

const CONTRACT_ADDRESSES = {
    base: "0x..." // Replace with your Base contract address
};

const SOLANA_PROGRAM_ID = new PublicKey("..."); // Replace with your Solana program ID

// Form schema definition remains the same...

export function NFTMinter() {
    const { isConnected, address, chain, connect, signAndSendTransaction } = useWallet();
    const [step, setStep] = useState(1);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [mintingError, setMintingError] = useState<string | null>(null);
    const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
    const [mintingStatus, setMintingStatus] = useState<'idle' | 'uploading' | 'minting' | 'success'>('idle');

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting, isValid },
        setValue,
        getValues,
        trigger,
    } = useForm<NFTFormData>({
        resolver: zodResolver(nftFormSchema),
        defaultValues: {
            dynamic: true,
            attributes: 2,
            chain: "solana",
        },
        mode: "onChange",
    });

    // Existing form watching and validation logic remains the same...

    const mintNFTOnSolana = async (metadata: any, uri: string) => {
        try {
            // Create mint instruction
            const mintInstruction = SystemProgram.createAccount({
                fromPubkey: new PublicKey(address!),
                newAccountPubkey: SOLANA_PROGRAM_ID,
                lamports: LAMPORTS_PER_SOL * 0.001, // Adjust as needed
                space: 165, // Adjust based on your program's needs
                programId: SOLANA_PROGRAM_ID
            });

            // Create metadata instruction (you'll need to implement this based on your program)
            const createMetadataInstruction = {
                // Your program's instruction to create metadata
                // This will vary based on your specific Solana program
            };

            const transaction = new Transaction().add(
                mintInstruction,
                createMetadataInstruction
            );

            const signature = await signAndSendTransaction(transaction);
            return signature;
        } catch (error) {
            console.error('Error minting on Solana:', error);
            throw error;
        }
    };

    const mintNFTOnBase = async (metadata: any, uri: string) => {
        try {
            const provider = new ethers.BrowserProvider((window as any).ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(
                CONTRACT_ADDRESSES.base,
                NFT_CONTRACT_ABI,
                signer
            );

            const tx = await contract.mint(uri);
            await tx.wait();
            return tx.hash;
        } catch (error) {
            console.error('Error minting on Base:', error);
            throw error;
        }
    };

    const onSubmit = async (data: NFTFormData) => {
        if (!isConnected) {
            toast.error("Please connect your wallet first");
            return;
        }

        setMintingStatus('uploading');
        setMintingError(null);

        try {
            // Prepare metadata
            const metadata = {
                name: data.name,
                description: data.description,
                image: processedImage?.url,
                attributes: Array.from({ length: data.attributes }).map((_, i) => ({
                    trait_type: `Attribute ${i + 1}`,
                    value: Math.floor(Math.random() * 100)
                })),
                properties: {
                    category: data.category,
                    dynamic: data.dynamic,
                }
            };

            // Upload metadata to Irys
            const uri = await uploadToIrys(metadata, chain as 'solana' | 'base');

            // Start minting
            setMintingStatus('minting');
            let txHash;

            if (chain === 'solana') {
                txHash = await mintNFTOnSolana(metadata, uri);
            } else {
                txHash = await mintNFTOnBase(metadata, uri);
            }

            setMintingStatus('success');
            toast.success('NFT minted successfully!');
            
            // Reset form or redirect
            setStep(1);
            clearImageSelection();
        } catch (error) {
            console.error('Minting error:', error);
            setMintingError(error instanceof Error ? error.message : 'Failed to mint NFT');
            toast.error(error instanceof Error ? error.message : 'Failed to mint NFT');
            setMintingStatus('idle');
        }
    };

    // Existing utility functions (clearImageSelection, handleFileChange, etc.) remain the same...

    return (
        <div className="space-y-6">
            {!isConnected && (
                <Alert>
                    <AlertTitle>Wallet not connected</AlertTitle>
                    <AlertDescription>
                        Please connect your wallet to mint NFTs.
                        <Button 
                            variant="outline" 
                            className="ml-2"
                            onClick={() => connect()}
                        >
                            Connect Wallet
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            {/* Rest of your existing JSX remains the same... */}
            {/* Just update the submit button to show minting status */}
            {/* Example: */}
            <Button
                type="submit"
                className="w-full gradient-button"
                disabled={!isConnected || isSubmitting || mintingStatus !== 'idle'}
            >
                {mintingStatus === 'uploading' ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading to Irys...
                    </div>
                ) : mintingStatus === 'minting' ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Minting NFT...
                    </div>
                ) : mintingStatus === 'success' ? (
                    'Minted Successfully!'
                ) : (
                    'Mint NFT'
                )}
            </Button>
        </div>
    );
}