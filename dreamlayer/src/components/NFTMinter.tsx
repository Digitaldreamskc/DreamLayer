"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ImageIcon, Upload } from "lucide-react";

export function NFTMinter() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [attributes, setAttributes] = useState(2);
    const [dynamic, setDynamic] = useState(true);
    const [chain, setChain] = useState("solana");
    const [step, setStep] = useState(1);

    return (
        <div className="space-y-6">
            <Tabs defaultValue="solana" onValueChange={(value) => setChain(value)}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="solana">Solana</TabsTrigger>
                    <TabsTrigger value="base">Base</TabsTrigger>
                </TabsList>
                <TabsContent value="solana" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="holographic-card col-span-1">
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    {step === 1 && (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Token Name</Label>
                                                <Input
                                                    id="name"
                                                    placeholder="Magical Token"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="description">Description</Label>
                                                <Textarea
                                                    id="description"
                                                    placeholder="Describe your Token.."
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    rows={4}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="category">Category</Label>
                                                <Select value={category} onValueChange={setCategory}>
                                                    <SelectTrigger id="category">
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="art">Art</SelectItem>
                                                        <SelectItem value="collectible">Collectible</SelectItem>
                                                        <SelectItem value="game">Game Asset</SelectItem>
                                                        <SelectItem value="music">Music</SelectItem>
                                                        <SelectItem value="photography">Photography</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="dynamic-switch">Make it Dynamic</Label>
                                                <Switch
                                                    id="dynamic-switch"
                                                    checked={dynamic}
                                                    onCheckedChange={setDynamic}
                                                />
                                            </div>
                                            {dynamic && (
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <Label>Attribute Levels ({attributes})</Label>
                                                    </div>
                                                    <Slider
                                                        value={[attributes]}
                                                        min={1}
                                                        max={5}
                                                        step={1}
                                                        onValueChange={(value) => setAttributes(value[0])}
                                                    />
                                                </div>
                                            )}
                                            <Button className="w-full gradient-button" onClick={() => setStep(2)}>
                                                Next: Upload Image
                                            </Button>
                                        </>
                                    )}

                                    {step === 2 && (
                                        <>
                                            <div className="flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg h-48 mb-4">
                                                <div className="flex flex-col items-center gap-2">
                                                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                                                    <span className="text-sm text-muted-foreground">Upload Token Image</span>
                                                    <Button size="sm" className="gap-1">
                                                        <Upload className="h-4 w-4" /> Choose File
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                                                    Back
                                                </Button>
                                                <Button className="flex-1 gradient-button" onClick={() => setStep(3)}>
                                                    Next: Review
                                                </Button>
                                            </div>
                                        </>
                                    )}

                                    {step === 3 && (
                                        <>
                                            <div className="space-y-3">
                                                <h3 className="font-medium">Review Token Details</h3>
                                                <div className="rounded-lg border bg-card p-3">
                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">{name || "Magical Token"}</div>
                                                        <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">{category || "Art"}</div>
                                                        <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">Solana</div>
                                                        <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">{dynamic ? "Yes" : "No"}</div>
                                                        {dynamic && (
                                                            <>
                                                                <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">Attributes:</div>
                                                                <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">{attributes}</div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="border p-3 rounded-lg bg-muted/30">
                                                    <p className="text-sm text-muted-foreground">
                                                        By minting this Token, you agree to the terms and conditions. This will use Irys for permanent storage.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                                                    Back
                                                </Button>
                                                <Button className="flex-1 gradient-button">
                                                    Mint NFT
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-4">
                            <Card className="holographic-card">
                                <CardContent className="pt-6">
                                    <h3 className="font-medium mb-3">Dynamic Token Preview</h3>
                                    <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center">
                                        <ImageIcon className="h-16 w-16 text-muted-foreground" />
                                    </div>
                                    <div className="mt-4 space-y-2">
                                        <p className="font-medium">{name || "Magical Token"}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {description || "This is a dynamic Token that evolves over time based on interactions."}
                                        </p>
                                        {dynamic && (
                                            <div className="mt-2 space-y-2">
                                                <p className="text-sm font-medium">Dynamic Attributes:</p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {Array.from({ length: attributes }).map((_, i) => (
                                                        <div key={i} className="flex items-center gap-2">
                                                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-primary rounded-full"
                                                                    style={{ width: `${Math.random() * 100}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs text-muted-foreground">
                                                                {["Better", "Faster", "Stronger", "More Productive"][i]}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <h3 className="font-medium mb-3">Mint on Solana</h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Your Token will be minted on the Solana blockchain using Irys for permanent storage, ensuring your creation lives forever.
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm">Estimated gas fee:</span>
                                            <span className="text-sm font-medium">~0.000005 SOL</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">Storage fee:</span>
                                            <span className="text-sm font-medium">~0.0001 SOL</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="base">
                    <Card className="holographic-card">
                        <CardContent className="pt-6">
                            <div className="text-center py-8">
                                <h3 className="text-xl font-medium mb-2">Base Chain Support Coming Soon</h3>
                                <p className="text-muted-foreground">
                                    We're currently working on integrating Base chain support for NFT minting. Stay tuned!
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
