"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useAccount } from "wagmi";
import { searchNFTs, searchMutableNFTs, searchNFTsByContentType } from "@/services/dynamicNFTService";
import DynamicNFTDashboard from "@/components/DynamicNFTDashboard";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useDebounce } from "@/hooks/useDebounce";
import { NFT, NFTFilterType } from "@/types/nft";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { RateLimiter, RateLimitError, APIError, NetworkError, ValidationError } from "@/utils/rateLimiter";

// Initialize rate limiter (50 requests per minute)
const rateLimiter = new RateLimiter(50, 60000);

interface SearchState {
  isSearching: boolean;
  isLoading: boolean;
  error: string | null;
  retryAfter?: number;
}

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRefresh: () => void;
  searchState: SearchState;
}

const SearchInput: React.FC<SearchInputProps> = ({ 
  value, 
  onChange, 
  onRefresh,
  searchState: { isSearching, error, retryAfter }
}) => (
  <div className="flex gap-4 w-full md:w-auto">
    <div className="relative w-full md:w-[240px]">
      <Input
        placeholder="Search NFTs..."
        value={value}
        onChange={onChange}
        className={`pl-10 ${error ? 'border-red-500' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        disabled={retryAfter !== undefined}
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        {isSearching ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : error ? (
          <AlertCircle className="h-4 w-4 text-red-500" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </div>
      {error && (
        <div className="absolute -bottom-6 left-0 text-sm text-red-500">
          {error}
          {retryAfter && ` (Retry in ${retryAfter}s)`}
        </div>
      )}
    </div>
    <Button 
      onClick={onRefresh} 
      variant="outline"
      disabled={isSearching || retryAfter !== undefined}
    >
      {isSearching ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : null}
      Refresh
    </Button>
  </div>
);

interface FilterTabsProps {
  onValueChange: (value: NFTFilterType) => void;
  disabled: boolean;
}

const FilterTabs: React.FC<FilterTabsProps> = ({ onValueChange, disabled }) => (
  <Tabs 
    defaultValue="all" 
    className="w-full md:w-auto" 
    onValueChange={onValueChange}
  >
    <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
      <TabsTrigger value="all" disabled={disabled}>All NFTs</TabsTrigger>
      <TabsTrigger value="dynamic" disabled={disabled}>Dynamic</TabsTrigger>
      <TabsTrigger value="image" disabled={disabled}>Images</TabsTrigger>
    </TabsList>
  </Tabs>
);

export default function NFTsPage() {
  const { isConnected } = useAccount();
  const [filter, setFilter] = useState<NFTFilterType>("all");
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [searchState, setSearchState] = useState<SearchState>({
    isSearching: false,
    isLoading: false,
    error: null,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Debounce the search term with a 500ms delay
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 500);

  const handleError = useCallback((error: unknown) => {
    let errorMessage = "An unexpected error occurred";
    let retryAfter: number | undefined;

    if (error instanceof RateLimitError) {
      errorMessage = `Rate limit exceeded. Please wait ${error.retryAfter} seconds.`;
      retryAfter = error.retryAfter;
      toast.error("Rate Limit Exceeded", {
        description: `Too many requests. Please wait ${error.retryAfter} seconds.`,
      });
    } else if (error instanceof APIError) {
      errorMessage = `API Error: ${error.message}`;
      toast.error("API Error", {
        description: error.message,
      });
    } else if (error instanceof NetworkError) {
      errorMessage = `Network Error: ${error.message}`;
      toast.error("Network Error", {
        description: error.message,
      });
    } else if (error instanceof ValidationError) {
      errorMessage = `Validation Error: ${error.message}`;
      toast.error("Validation Error", {
        description: error.message,
      });
    } else if (error instanceof Error) {
      errorMessage = error.message;
      toast.error("Error", {
        description: error.message,
      });
    }

    setSearchState(prev => ({ 
      ...prev, 
      error: errorMessage,
      retryAfter,
    }));

    // If rate limited, set up auto-retry
    if (retryAfter) {
      setTimeout(() => {
        setSearchState(prev => ({ ...prev, retryAfter: undefined, error: null }));
      }, retryAfter * 1000);
    }
  }, []);

  // Memoized search function
  const performSearch = useCallback(async (term: string, filterType: NFTFilterType) => {
    setSearchState(prev => ({ ...prev, isSearching: true, error: null }));
    try {
      // Check rate limit before performing search
      await rateLimiter.checkLimit();

      let results: NFT[] = [];
      switch (filterType) {
        case "all":
          results = await searchNFTs({ 
            limit: 50, 
            searchTerm: term 
          });
          break;
        case "dynamic":
          results = await searchMutableNFTs(50, term);
          break;
        case "image":
          results = await searchNFTsByContentType("image", 50, term);
          break;
      }
      setNfts(results);
    } catch (error) {
      handleError(error);
    } finally {
      setSearchState(prev => ({ ...prev, isSearching: false }));
    }
  }, [handleError]);

  // Handle initial load and filter changes
  const loadNFTs = useCallback(async () => {
    setSearchState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      // Check rate limit before loading
      await rateLimiter.checkLimit();

      let results: NFT[] = [];
      switch (filter) {
        case "all":
          results = await searchNFTs({ limit: 50 });
          break;
        case "dynamic":
          results = await searchMutableNFTs(50);
          break;
        case "image":
          results = await searchNFTsByContentType("image", 50);
          break;
      }
      setNfts(results);
    } catch (error) {
      handleError(error);
    } finally {
      setSearchState(prev => ({ ...prev, isLoading: false }));
    }
  }, [filter, handleError]);

  // Load NFTs when connected or filter changes
  useEffect(() => {
    if (isConnected) {
      loadNFTs();
    }
  }, [isConnected, loadNFTs]);

  // Handle debounced search
  useEffect(() => {
    if (isConnected && debouncedSearchTerm !== searchTerm) {
      performSearch(debouncedSearchTerm, filter);
    }
  }, [debouncedSearchTerm, filter, isConnected, performSearch, searchTerm]);

  // Memoized filtered NFTs
  const filteredNFTs = useMemo(() => {
    if (!debouncedSearchTerm) return nfts;
    
    const searchLower = debouncedSearchTerm.toLowerCase();
    return nfts.filter((nft: NFT) => {
      const hasMatchingTag = nft.tags.some(tag => 
        tag.name.toLowerCase().includes(searchLower) ||
        tag.value.toLowerCase().includes(searchLower)
      );
      
      const matchesId = nft.id.toLowerCase().includes(searchLower);
      const matchesName = nft.metadata.name?.toLowerCase().includes(searchLower) || false;
      const matchesDescription = nft.metadata.description?.toLowerCase().includes(searchLower) || false;
      
      return hasMatchingTag || matchesId || matchesName || matchesDescription;
    });
  }, [nfts, debouncedSearchTerm]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Clear error state when user starts typing
    setSearchState(prev => ({ ...prev, error: null }));
  }, []);

  const handleFilterChange = useCallback((value: NFTFilterType) => {
    setFilter(value);
    // Clear search when changing filters
    setSearchTerm("");
  }, []);

  if (!isConnected) {
    return (
      <main className="min-h-screen">
        <AnimatedBackground />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            Your NFT Collection
          </h1>
          <Card className="text-center p-8 backdrop-blur-md bg-black/30 border border-white/10">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Connect Your Wallet</h2>
              <p className="text-gray-300 mb-6">
                Connect your wallet to view your NFT collection and mint new tokens.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const { isLoading, isSearching } = searchState;
  const showLoading = isLoading || isSearching;

  return (
    <main className="min-h-screen">
      <AnimatedBackground />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          Your NFT Collection
        </h1>

        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
          <FilterTabs 
            onValueChange={handleFilterChange} 
            disabled={showLoading}
          />
          <SearchInput 
            value={searchTerm}
            onChange={handleSearchChange}
            onRefresh={loadNFTs}
            searchState={searchState}
          />
        </div>

        {showLoading ? (
          <div className="flex flex-col justify-center items-center min-h-[300px] gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            <p className="text-gray-400">
              {isSearching ? "Searching NFTs..." : "Loading NFTs..."}
            </p>
          </div>
        ) : filteredNFTs.length > 0 ? (
          <DynamicNFTDashboard nfts={filteredNFTs} />
        ) : (
          <Card className="text-center p-8 backdrop-blur-md bg-black/30 border border-white/10">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">No NFTs Found</h2>
              <p className="text-gray-300 mb-6">
                {searchTerm 
                  ? "No NFTs match your search criteria. Try a different search term."
                  : "You don't have any NFTs in this category yet. Mint a new NFT to get started."}
              </p>
              <Button asChild>
                <a href="/mint">Mint a New NFT</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}