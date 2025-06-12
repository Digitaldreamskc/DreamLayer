"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useAccount, useWalletClient } from 'wagmi';
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

// Form schema for NFT creation
const nftFormSchema = z.object({
    name: z.string()
        .min(3, 'Name must be at least 3 characters')
        .max(50, 'Name cannot exceed 50 characters'),
    description: z.string()
        .min(10, 'Description must be at least 10 characters')
        .max(1000, 'Description cannot exceed 1000 characters'),
    category: z.enum(['art', 'music', 'video', 'collectible', 'gaming']),
    dynamic: z.boolean(),
    attributes: z.number().int().min(0).max(10),
    chain: z.enum(['solana', 'base']),
});

type NFTFormData = z.infer<typeof nftFormSchema>;

// NFT Contract configurations
const NFT_CONTRACT_ABI = [
    "function mint(string memory tokenURI) public returns (uint256)",
    "function balanceOf(address owner) view returns (uint256)",
    "function ownerOf(uint256 tokenId) view returns (address)"
];

const CONTRACT_ADDRESSES = {
    base: "0x..." // Replace with your Base contract address
};

const SOLANA_PROGRAM_ID = process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID 
    ? new PublicKey(process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID)
    : null;

export function NFTMinter() {
    const { isConnected, address } = useAccount();
    const { data: walletClient } = useWalletClient();
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
            category: "art"
        },
        mode: "onChange",
    });

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            setUploadError(null);

            // Create preview
            const preview = URL.createObjectURL(file);
            setImagePreview(preview);

            // Process image
            const processed = await processImage(file, DEFAULT_IMAGE_CONFIG);
            setProcessedImage(processed);

            await trigger(); // Trigger form validation
        } catch (error) {
            console.error('Error processing image:', error);
            if (error instanceof ImageValidationError) {
                setUploadError(error.message);
            } else {
                setUploadError('Failed to process image');
            }
            setImagePreview(null);
            setProcessedImage(null);
        } finally {
            setIsUploading(false);
        }
    };

    const clearImageSelection = () => {
        setImagePreview(null);
        setProcessedImage(null);
        setUploadError(null);
    };

    const mintNFTOnSolana = async (metadata: any, uri: string) => {
        try {
            const mintInstruction = SystemProgram.createAccount({
                fromPubkey: new PublicKey(address!),
                newAccountPubkey: SOLANA_PROGRAM_ID,
                lamports: LAMPORTS_PER_SOL * 0.001,
                space: 165,
                programId: SOLANA_PROGRAM_ID
            });

            const createMetadataInstruction = {
                // Your program's instruction to create metadata
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
            const provider = new ethers.providers.Web3Provider((window as any).ethereum);
            const signer = provider.getSigner();
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

        if (!processedImage) {
            toast.error("Please upload an image first");
            return;
        }

        setMintingStatus('uploading');
        setMintingError(null);

        try {
            const metadata = {
                name: data.name,
                description: data.description,
                image: processedImage.url,
                attributes: Array.from({ length: data.attributes }).map((_, i) => ({
                    trait_type: `Attribute ${i + 1}`,
                    value: Math.floor(Math.random() * 100)
                })),
                properties: {
                    category: data.category,
                    dynamic: data.dynamic,
                }
            };

            const uri = await uploadToIrys(metadata, chain as 'solana' | 'base');

            setMintingStatus('minting');
            let txHash;

            if (chain === 'solana') {
                txHash = await mintNFTOnSolana(metadata, uri);
            } else {
                txHash = await mintNFTOnBase(metadata, uri);
            }

            setMintingStatus('success');
            toast.success('NFT minted successfully!');
            
            setStep(1);
            clearImageSelection();
        } catch (error) {
            console.error('Minting error:', error);
            setMintingError(error instanceof Error ? error.message : 'Failed to mint NFT');
            toast.error(error instanceof Error ? error.message : 'Failed to mint NFT');
            setMintingStatus('idle');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {!isConnected && (
                <Alert>
                    <AlertTitle>Wallet not connected</AlertTitle>
                    <AlertDescription className="flex items-center justify-between">
                        Please connect your wallet to mint NFTs.
                        <ConnectButton />
                    </AlertDescription>
                </Alert>
            )}

            <Tabs value={String(step)} onValueChange={(value) => setStep(Number(value))}>
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="1">Details</TabsTrigger>
                    <TabsTrigger value="2">Image</TabsTrigger>
                    <TabsTrigger value="3">Properties</TabsTrigger>
                    <TabsTrigger value="4">Review</TabsTrigger>
                </TabsList>

                <TabsContent value="1" className="space-y-4">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">NFT Name</Label>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Enter NFT name" />
                                )}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <Textarea 
                                        {...field} 
                                        placeholder="Describe your NFT"
                                        className="min-h-[100px]"
                                    />
                                )}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                            )}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="2" className="space-y-4">
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="image-upload"
                        />
                        
                        {!imagePreview ? (
                            <Label
                                htmlFor="image-upload"
                                className="flex flex-col items-center gap-2 cursor-pointer"
                            >
                                <Upload className="h-8 w-8" />
                                <span>Upload Image</span>
                                <span className="text-sm text-white/50">
                                    PNG, JPG up to 10MB
                                </span>
                            </Label>
                        ) : (
                            <div className="relative">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="max-w-full h-auto rounded-lg"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2"
                                    onClick={clearImageSelection}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}

                        {uploadError && (
                            <p className="text-red-500 text-sm mt-2">{uploadError}</p>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="3" className="space-y-4">
                    <div className="space-y-4">
                        <div>
                            <Label>Category</Label>
                            <Controller
                                name="category"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="art">Art</SelectItem>
                                            <SelectItem value="music">Music</SelectItem>
                                            <SelectItem value="video">Video</SelectItem>
                                            <SelectItem value="collectible">Collectible</SelectItem>
                                            <SelectItem value="gaming">Gaming</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div>
                            <Label>Dynamic NFT</Label>
                            <div className="flex items-center space-x-2">
                                <Controller
                                    name="dynamic"
                                    control={control}
                                    render={({ field }) => (
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    )}
                                />
                                <span className="text-sm text-white/70">
                                    Enable dynamic properties
                                </span>
                            </div>
                        </div>

                        <div>
                            <Label>Number of Attributes</Label>
                            <Controller
                                name="attributes"
                                control={control}
                                render={({ field }) => (
                                    <Slider
                                        value={[field.value]}
                                        onValueChange={(value) => field.onChange(value[0])}
                                        max={10}
                                        step={1}
                                        className="mt-2"
                                    />
                                )}
                            />
                            <div className="text-sm text-white/50 mt-1">
                                {watch('attributes')} attributes
                            </div>
                        </div>

                        <div>
                            <Label>Blockchain</Label>
                            <Controller
                                name="chain"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select blockchain" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="solana">Solana</SelectItem>
                                            <SelectItem value="base">Base</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="4" className="space-y-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-white/70">Name:</span>
                                    <span>{watch('name')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/70">Category:</span>
                                    <span>{watch('category')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/70">Dynamic:</span>
                                    <span>{watch('dynamic') ? 'Yes' : 'No'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/70">Attributes:</span>
                                    <span>{watch('attributes')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/70">Blockchain:</span>
                                    <span>{watch('chain')}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Button
                        type="submit"
                        className="w-full gradient-button"
                        disabled={!isConnected || isSubmitting || mintingStatus !== 'idle' || !isValid || !processedImage}
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

                    {mintingError && (
                        <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{mintingError}</AlertDescription>
                        </Alert>
                    )}
                </TabsContent>
            </Tabs>
        </form>
    );
}