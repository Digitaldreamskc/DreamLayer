<CardContent>
              <h2 className="text-2xl font-semibold mb-4import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Sparkles, 
  Shield, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  FileImage,
  Settings,
  Zap
} from 'lucide-react';

// Step indicators
const steps = [
  { id: 1, name: 'Upload Asset', icon: Upload },
  { id: 2, name: 'Configure NFT', icon: Settings },
  { id: 3, name: 'Mint Dynamic NFT', icon: Zap },
  { id: 4, name: 'Register as IP', icon: Shield }
];

const StepIndicator = ({ currentStep }) => (
  <div className="flex justify-center mb-8">
    <div className="flex items-center space-x-4">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
            currentStep >= step.id 
              ? 'bg-purple-500 border-purple-500 text-white' 
              : currentStep === step.id 
                ? 'border-purple-500 text-purple-500' 
                : 'border-gray-600 text-gray-600'
          }`}>
            {currentStep > step.id ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <step.icon className="w-5 h-5" />
            )}
          </div>
          <span className={`text-sm ${
            currentStep >= step.id ? 'text-white' : 'text-gray-500'
          }`}>
            {step.name}
          </span>
          {index < steps.length - 1 && (
            <ArrowRight className={`w-4 h-4 ${
              currentStep > step.id ? 'text-purple-500' : 'text-gray-600'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
);

// Step 1: Asset Upload
const AssetUploadStep = ({ onNext, formData, setFormData }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = (file) => {
    setFormData(prev => ({ ...prev, file, fileName: file.name }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  return (
    <Card className="backdrop-blur-md bg-black/30 border border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Your Asset
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver ? 'border-purple-500 bg-purple-500/10' : 'border-gray-600 hover:border-gray-500'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {formData.file ? (
            <div className="space-y-2">
              <FileImage className="w-12 h-12 mx-auto text-green-500" />
              <p className="text-green-400">{formData.fileName}</p>
              <Button variant="outline" onClick={() => handleFileUpload(null)}>
                Change File
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-12 h-12 mx-auto text-gray-400" />
              <p className="text-gray-300">Drag & drop your asset here or click to browse</p>
              <input 
                type="file" 
                className="hidden" 
                id="file-upload"
                onChange={(e) => handleFileUpload(e.target.files[0])}
              />
              <Button variant="outline" onClick={() => document.getElementById('file-upload').click()}>
                Choose File
              </Button>
            </div>
          )}
        </div>
        
        <Button 
          onClick={onNext} 
          disabled={!formData.file}
          className="w-full"
        >
          Next: Configure NFT
        </Button>
      </CardContent>
    </Card>
  );
};

// Step 2: NFT Configuration
const NFTConfigStep = ({ onNext, onBack, formData, setFormData }) => {
  return (
    <Card className="backdrop-blur-md bg-black/30 border border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configure Your NFT
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">NFT Name *</label>
          <Input
            value={formData.name || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter NFT name"
            className="bg-white/5 border-white/10"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <Textarea
            value={formData.description || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your NFT"
            className="bg-white/5 border-white/10"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Trait 1</label>
            <Input
              value={formData.trait1 || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, trait1: e.target.value }))}
              placeholder="e.g., Rarity"
              className="bg-white/5 border-white/10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Trait 2</label>
            <Input
              value={formData.trait2 || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, trait2: e.target.value }))}
              placeholder="e.g., Power"
              className="bg-white/5 border-white/10"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button 
            onClick={onNext} 
            disabled={!formData.name}
            className="flex-1"
          >
            Next: Mint NFT
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Step 3: Minting
const MintingStep = ({ onNext, onBack, formData, setFormData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [mintResult, setMintResult] = useState(null);

  const handleMint = async () => {
    setIsLoading(true);
    try {
      // Here you would integrate with your DynamicNFT contract
      // const contract = new DynamicNFT__factory(signer);
      // const tx = await contract.mint(address, tokenId);
      // await tx.wait();
      
      // Simulate minting process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResult = {
        tokenId: "12345",
        contractAddress: "0x1234567890123456789012345678901234567890",
        transactionHash: "0xabcdef1234567890abcdef1234567890abcdef12"
      };
      
      setMintResult(mockResult);
      setFormData(prev => ({ ...prev, ...mockResult }));
    } catch (error) {
      console.error('Minting failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="backdrop-blur-md bg-black/30 border border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Mint Dynamic NFT
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!mintResult ? (
          <div className="text-center space-y-4">
            <div className="p-6 border border-white/10 rounded-lg bg-white/5">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-500" />
              <h3 className="text-lg font-semibold mb-2">Ready to Mint</h3>
              <p className="text-gray-300 text-sm mb-4">
                Your dynamic NFT will be minted on Base with EIP-7160 standard
              </p>
              <div className="text-left space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Name:</span>
                  <span>{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Network:</span>
                  <Badge variant="outline">Base</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Standard:</span>
                  <Badge variant="outline">EIP-7160 Dynamic</Badge>
                </div>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                <p className="text-sm text-gray-400">Minting your NFT...</p>
              </div>
            ) : (
              <Button onClick={handleMint} className="w-full">
                <Sparkles className="w-4 h-4 mr-2" />
                Mint Dynamic NFT
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center p-6 bg-green-500/20 border border-green-500/30 rounded-lg">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-semibold mb-2 text-green-400">NFT Minted Successfully!</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Token ID:</span>
                  <span className="font-mono">{mintResult.tokenId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Contract:</span>
                  <span className="font-mono text-xs">{mintResult.contractAddress.slice(0, 10)}...</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button variant="outline" onClick={onBack} className="flex-1">
                Back
              </Button>
              <Button onClick={onNext} className="flex-1">
                Next: Register IP
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Step 4: IP Registration
const IPRegistrationStep = ({ onBack, formData }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [ipResult, setIPResult] = useState(null);

  const handleRegisterIP = async () => {
    setIsRegistering(true);
    try {
      // Here you would integrate with Story Protocol
      // const storyClient = new StoryClient(config);
      // const response = await storyClient.ipAsset.register({
      //   nftContract: formData.contractAddress,
      //   tokenId: formData.tokenId,
      //   metadata: { ... }
      // });
      
      // Simulate IP registration
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setIPResult({
        ipId: "0xip123456789",
        licenseTermsId: "1",
        txHash: "0xip_registration_hash"
      });
    } catch (error) {
      console.error('IP Registration failed:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Card className="backdrop-blur-md bg-black/30 border border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Register as Intellectual Property
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-400">Story Protocol Registration</h4>
              <p className="text-sm text-blue-300 mt-1">
                Register your NFT as intellectual property on Story Protocol to enable:
              </p>
              <ul className="text-sm text-blue-300 mt-2 ml-4 space-y-1">
                <li>• IP licensing and royalties</li>
                <li>• Derivative work permissions</li>
                <li>• Automated IP enforcement</li>
                <li>• Cross-chain IP recognition</li>
              </ul>
            </div>
          </div>
        </div>

        {formData.tokenId && (
          <div className="p-4 bg-white/5 rounded-lg">
            <h4 className="font-semibold mb-2">NFT Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Token ID:</span>
                <span className="font-mono">{formData.tokenId}</span>
              </div>
              <div className="flex justify-between">
                <span>Contract:</span>
                <span className="font-mono text-xs">{formData.contractAddress?.slice(0, 20)}...</span>
              </div>
              <div className="flex justify-between">
                <span>Name:</span>
                <span>{formData.name}</span>
              </div>
            </div>
          </div>
        )}

        {!ipResult ? (
          <div className="space-y-4">
            {isRegistering ? (
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
                <p className="text-sm text-gray-400">Registering your IP on Story Protocol...</p>
              </div>
            ) : (
              <div className="flex gap-4">
                <Button variant="outline" onClick={onBack} className="flex-1">
                  Skip for Now
                </Button>
                <Button onClick={handleRegisterIP} className="flex-1">
                  <Shield className="w-4 h-4 mr-2" />
                  Register IP
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center p-6 bg-green-500/20 border border-green-500/30 rounded-lg">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-semibold mb-2 text-green-400">IP Registered Successfully!</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>IP ID:</span>
                  <span className="font-mono text-xs">{ipResult.ipId}</span>
                </div>
                <div className="flex justify-between">
                  <span>License Terms:</span>
                  <span>PIL Commercial Use</span>
                </div>
              </div>
            </div>
            
            <Button onClick={() => window.location.href = '/nfts'} className="w-full">
              View in Collection
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Main Component
export default function CompleteMintingFlow() {
  // Mock wallet connection state - in real app this would come from your wallet provider
  const [isConnected, setIsConnected] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 p-4">
        <div className="container mx-auto max-w-2xl py-8">
          <Card className="backdrop-blur-md bg-black/30 border border-white/10 text-center p-8">
            <CardContent>
              <h2 className="text-2xl font-semibold mb-4">Connect Your Wallet</h2>
              <p className="text-gray-300 mb-6">
                Connect your wallet to start minting dynamic NFTs and registering IP.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 p-4">
      <div className="container mx-auto max-w-2xl py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          Create Dynamic IP-NFT
        </h1>
        
        <StepIndicator currentStep={currentStep} />
        
        {currentStep === 1 && (
          <AssetUploadStep 
            onNext={nextStep} 
            formData={formData} 
            setFormData={setFormData} 
          />
        )}
        
        {currentStep === 2 && (
          <NFTConfigStep 
            onNext={nextStep} 
            onBack={prevStep} 
            formData={formData} 
            setFormData={setFormData} 
          />
        )}
        
        {currentStep === 3 && (
          <MintingStep 
            onNext={nextStep} 
            onBack={prevStep} 
            formData={formData} 
            setFormData={setFormData} 
          />
        )}
        
        {currentStep === 4 && (
          <IPRegistrationStep 
            onBack={prevStep} 
            formData={formData} 
          />
        )}
      </div>
    </div>
  );
}