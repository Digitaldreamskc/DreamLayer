"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Eye, Filter, Calendar, Tag, Database, Lock, Globe, Image, FileText, Layers } from 'lucide-react';
import { searchNFTs, createDynamicNFT, updateDynamicNFT, fetchDynamicNFTMetadata } from '@/services/dynamicNFTService';
import { showToast } from '@/utils/toast';
import { useAccount } from 'wagmi';

interface NFTSearchCriteria {
  applicationId?: string;
  nftType?: 'primary' | 'metadata' | 'content';
  assetType?: 'image' | 'metadata' | 'programmable-data';
  storageType?: 'programmable';
  startDate?: Date;
  endDate?: Date;
  mutable?: boolean;
  rootTxId?: string;
  limit?: number;
  offset?: number;
}

interface NFTData {
  id: string;
  name: string;
  description: string;
  image: string;
  assetType: string;
  nftType: string;
  mutable: boolean;
  encrypted: boolean;
  createdAt: string;
  txId: string;
  owner: string;
  tags: string[];
}

const DynamicNFTDashboard = () => {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState('search');
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState<NFTSearchCriteria>({
    applicationId: '',
    nftType: '',
    assetType: '',
    storageType: '',
    startDate: undefined,
    endDate: undefined,
    mutable: undefined,
    rootTxId: '',
    limit: 20,
    offset: 0
  });
  
  const [newNFT, setNewNFT] = useState({
    name: '',
    description: '',
    image: null as File | null,
    assetType: 'image',
    nftType: 'primary',
    mutable: true,
    encryptContent: false,
    programmableData: '',
    tags: [] as string[]
  });

  const [selectedNFT, setSelectedNFT] = useState<NFTData | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = async () => {
    if (!address) {
      showToast.error('Error', 'Please connect your wallet first');
      return;
    }

    setLoading(true);
    try {
      const results = await searchNFTs(searchCriteria);
      setNfts(results.map(result => ({
        id: result.id,
        name: result.tags.find(tag => tag.name === 'name')?.value || 'Unnamed NFT',
        description: result.tags.find(tag => tag.name === 'description')?.value || '',
        image: result.tags.find(tag => tag.name === 'image')?.value || '',
        assetType: result.tags.find(tag => tag.name === 'Asset-Type')?.value || 'image',
        nftType: result.tags.find(tag => tag.name === 'NFT-Type')?.value || 'primary',
        mutable: result.tags.find(tag => tag.name === 'Mutable')?.value === 'true',
        encrypted: result.tags.find(tag => tag.name === 'Encrypted')?.value === 'true',
        createdAt: new Date(result.timestamp).toISOString(),
        txId: result.id,
        owner: address,
        tags: result.tags.map(tag => tag.value)
      })));
    } catch (error) {
      console.error('Search failed:', error);
      showToast.error('Search Failed', 'Failed to search NFTs');
    }
    setLoading(false);
  };

  const handleCreateNFT = async () => {
    if (!address) {
      showToast.error('Error', 'Please connect your wallet first');
      return;
    }

    if (!newNFT.image) {
      showToast.error('Error', 'Please select an image');
      return;
    }

    setLoading(true);
    try {
      const metadata = {
        name: newNFT.name,
        description: newNFT.description,
        image: '', // Will be updated with the uploaded image URL
        attributes: [],
        properties: {
          files: [],
          category: newNFT.assetType
        }
      };

      const result = await createDynamicNFT(
        metadata,
        newNFT.image,
        newNFT.programmableData || undefined,
        undefined,
        newNFT.assetType === 'programmable-data'
      );

      showToast.success('Success', 'NFT created successfully!');
      setActiveTab('search');
      handleSearch(); // Refresh the list
    } catch (error) {
      console.error('NFT creation failed:', error);
      showToast.error('Creation Failed', 'Failed to create NFT');
    }
    setLoading(false);
  };

  const handleUpdateNFT = async (nftId: string, updates: Partial<NFTData>) => {
    if (!address) {
      showToast.error('Error', 'Please connect your wallet first');
      return;
    }

    setLoading(true);
    try {
      const result = await updateDynamicNFT(
        nftId,
        {
          name: updates.name,
          description: updates.description,
          properties: {
            files: updates.image ? [{ uri: updates.image, type: 'image' }] : undefined,
            category: updates.assetType
          }
        },
        updates.encrypted ? 'Updated content' : undefined,
        undefined,
        updates.assetType === 'programmable-data'
      );

      showToast.success('Success', 'NFT updated successfully!');
      handleSearch(); // Refresh the list
    } catch (error) {
      console.error('NFT update failed:', error);
      showToast.error('Update Failed', 'Failed to update NFT');
    }
    setLoading(false);
  };

  const getAssetTypeIcon = (assetType: string) => {
    switch (assetType) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'metadata': return <FileText className="w-4 h-4" />;
      case 'programmable-data': return <Database className="w-4 h-4" />;
      default: return <Layers className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-foreground">Dynamic NFT Platform</h1>
            
            <div className="flex items-center space-x-8">
              <button
                onClick={() => setActiveTab('search')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'search' 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Search className="w-4 h-4" />
                Search & Manage
              </button>
              
              <button
                onClick={() => setActiveTab('create')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'create' 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Plus className="w-4 h-4" />
                Create NFT
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            {/* Search Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">NFT Search & Management</h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="bg-card p-6 rounded-lg space-y-4 border">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Application ID</label>
                    <input
                      type="text"
                      value={searchCriteria.applicationId}
                      onChange={(e) => setSearchCriteria({...searchCriteria, applicationId: e.target.value})}
                      className="w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter application ID"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">NFT Type</label>
                    <select
                      value={searchCriteria.nftType}
                      onChange={(e) => setSearchCriteria({...searchCriteria, nftType: e.target.value as any})}
                      className="w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">All Types</option>
                      <option value="primary">Primary</option>
                      <option value="metadata">Metadata</option>
                      <option value="content">Content</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Asset Type</label>
                    <select
                      value={searchCriteria.assetType}
                      onChange={(e) => setSearchCriteria({...searchCriteria, assetType: e.target.value as any})}
                      className="w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">All Assets</option>
                      <option value="image">Image</option>
                      <option value="metadata">Metadata</option>
                      <option value="programmable-data">Programmable Data</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Start Date</label>
                    <input
                      type="date"
                      value={searchCriteria.startDate?.toISOString().split('T')[0] || ''}
                      onChange={(e) => setSearchCriteria({
                        ...searchCriteria,
                        startDate: e.target.value ? new Date(e.target.value) : undefined
                      })}
                      className="w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">End Date</label>
                    <input
                      type="date"
                      value={searchCriteria.endDate?.toISOString().split('T')[0] || ''}
                      onChange={(e) => setSearchCriteria({
                        ...searchCriteria,
                        endDate: e.target.value ? new Date(e.target.value) : undefined
                      })}
                      className="w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={searchCriteria.mutable === true}
                        onChange={(e) => setSearchCriteria({
                          ...searchCriteria,
                          mutable: e.target.checked ? true : undefined
                        })}
                        className="rounded border-input text-primary focus:ring-primary"
                      />
                      <span className="ml-2 text-sm text-foreground">Mutable Only</span>
                    </label>
                  </div>
                  
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                  >
                    <Search className="w-4 h-4" />
                    {loading ? 'Searching...' : 'Search NFTs'}
                  </button>
                </div>
              </div>
            )}

            {/* NFT Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nfts.map((nft) => (
                <div key={nft.id} className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{nft.name}</h3>
                      <div className="flex items-center gap-1">
                        {getAssetTypeIcon(nft.assetType)}
                        {nft.encrypted && <Lock className="w-4 h-4 text-yellow-500" />}
                        {nft.mutable && <Edit className="w-4 h-4 text-green-500" />}
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{nft.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {nft.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span>Type: {nft.nftType}</span>
                      <span>{new Date(nft.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedNFT(nft)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      
                      {nft.mutable && (
                        <button
                          onClick={() => {
                            setSelectedNFT(nft);
                            setActiveTab('update');
                          }}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          Update
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Tab */}
        {activeTab === 'create' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6">Create Dynamic NFT</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                  <input
                    type="text"
                    value={newNFT.name}
                    onChange={(e) => setNewNFT({...newNFT, name: e.target.value})}
                    className="w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter NFT name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Asset Type</label>
                  <select
                    value={newNFT.assetType}
                    onChange={(e) => setNewNFT({...newNFT, assetType: e.target.value})}
                    className="w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="image">Image</option>
                    <option value="metadata">Metadata</option>
                    <option value="programmable-data">Programmable Data</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <textarea
                  value={newNFT.description}
                  onChange={(e) => setNewNFT({...newNFT, description: e.target.value})}
                  className="w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Describe your NFT"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNewNFT({...newNFT, image: file});
                    }
                  }}
                  className="w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">NFT Type</label>
                  <select
                    value={newNFT.nftType}
                    onChange={(e) => setNewNFT({...newNFT, nftType: e.target.value})}
                    className="w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="primary">Primary</option>
                    <option value="metadata">Metadata</option>
                    <option value="content">Content</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-6 pt-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newNFT.mutable}
                      onChange={(e) => setNewNFT({...newNFT, mutable: e.target.checked})}
                      className="rounded border-input text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-foreground">Mutable</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newNFT.encryptContent}
                      onChange={(e) => setNewNFT({...newNFT, encryptContent: e.target.checked})}
                      className="rounded border-input text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-foreground">Encrypt Content</span>
                  </label>
                </div>
              </div>
              
              {newNFT.assetType === 'programmable-data' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Programmable Data (JSON)</label>
                  <textarea
                    value={newNFT.programmableData}
                    onChange={(e) => setNewNFT({...newNFT, programmableData: e.target.value})}
                    className="w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                    placeholder='{"key": "value", "data": "example"}'
                    rows={4}
                  />
                </div>
              )}
              
              <div className="flex items-center justify-between pt-6">
                <button
                  onClick={() => setActiveTab('search')}
                  className="px-6 py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleCreateNFT}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {loading ? 'Creating...' : 'Create NFT'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Update Tab */}
        {activeTab === 'update' && selectedNFT && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6">Update Dynamic NFT</h2>
            
            <div className="bg-card p-4 rounded-lg mb-6 border">
              <div className="flex items-center gap-4">
                <img
                  src={selectedNFT.image}
                  alt={selectedNFT.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-foreground">{selectedNFT.name}</h3>
                  <p className="text-sm text-muted-foreground">ID: {selectedNFT.id}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => handleUpdateNFT(selectedNFT.id, { 
                  description: selectedNFT.description + ' [Updated]' 
                })}
                disabled={loading}
                className="w-full p-4 text-left bg-card border rounded-lg hover:bg-card/80 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">Update Metadata</h4>
                    <p className="text-sm text-muted-foreground">Modify description, image, or other metadata</p>
                  </div>
                  <Edit className="w-5 h-5 text-muted-foreground" />
                </div>
              </button>
              
              <button
                onClick={() => handleUpdateNFT(selectedNFT.id, { 
                  programmableData: '{"updated": true, "timestamp": "' + new Date().toISOString() + '"}' 
                })}
                disabled={loading}
                className="w-full p-4 text-left bg-card border rounded-lg hover:bg-card/80 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">Update Programmable Data</h4>
                    <p className="text-sm text-muted-foreground">Modify on-chain programmable data</p>
                  </div>
                  <Database className="w-5 h-5 text-muted-foreground" />
                </div>
              </button>
              
              <button
                onClick={() => handleUpdateNFT(selectedNFT.id, { 
                  encrypted: !selectedNFT.encrypted 
                })}
                disabled={loading}
                className="w-full p-4 text-left bg-card border rounded-lg hover:bg-card/80 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">Toggle Encryption</h4>
                    <p className="text-sm text-muted-foreground">Change encryption status with Lit Protocol</p>
                  </div>
                  <Lock className="w-5 h-5 text-muted-foreground" />
                </div>
              </button>
            </div>
            
            <div className="flex items-center justify-between pt-6">
              <button
                onClick={() => setActiveTab('search')}
                className="px-6 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Back to Search
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg border">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-foreground">Processing...</p>
          </div>
        </div>
      )}

      {/* NFT Detail Modal */}
      {selectedNFT && activeTab === 'search' && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-foreground">{selectedNFT.name}</h3>
                <button
                  onClick={() => setSelectedNFT(null)}
                  className="text-muted-foreground hover:text-foreground text-2xl"
                >
                  ×
                </button>
              </div>
              
              <img
                src={selectedNFT.image}
                alt={selectedNFT.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Description</h4>
                  <p className="text-muted-foreground">{selectedNFT.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Type</h4>
                    <p className="text-muted-foreground">{selectedNFT.nftType}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Asset Type</h4>
                    <p className="text-muted-foreground">{selectedNFT.assetType}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Properties</h4>
                  <div className="flex gap-2">
                    {selectedNFT.mutable && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Mutable
                      </span>
                    )}
                    {selectedNFT.encrypted && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        Encrypted
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Transaction ID</h4>
                  <p className="text-muted-foreground font-mono text-sm">{selectedNFT.txId}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Owner</h4>
                  <p className="text-muted-foreground font-mono text-sm">{selectedNFT.owner}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicNFTDashboard; 