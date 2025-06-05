// Third-party imports
import { ethers, providers, Signer, BigNumber, Contract } from 'ethers';
import { WebIrys } from '@irys/sdk';

// Local imports
import { NFT_CONFIG } from '../config/nft.config';
import { DynamicNFTFactory__factory } from '../types/contracts/factories/DynamicNFTFactory__factory';
import { DynamicNFT__factory } from '../types/contracts/factories/DynamicNFT__factory';

// Types
interface InitializationResult {
  provider: providers.JsonRpcProvider;
  signer: Signer;
  irys: WebIrys;
  factoryContract: Contract;
}

interface IrysConfig {
  url: string;
  token: string;
  provider: providers.JsonRpcProvider;
}

interface DeploymentResult {
  contractAddress: string;
  transactionHash: string;
  owner: string;
}

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  dynamicFields?: Record<string, any>;
}

// Custom error classes
class InitializationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InitializationError';
  }
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Service class for handling Dynamic NFT deployments and interactions
 */
export class DynamicNFTInitializer {
  private provider: providers.JsonRpcProvider;
  private signer?: Signer;
  private irys?: WebIrys;
  private factoryContract?: Contract;
  private readonly isTestnet: boolean;

  /**
   * Creates an instance of DynamicNFTInitializer
   * @param isTestnet - Flag to determine if testnet should be used
   */
  constructor(isTestnet: boolean = false) {
    this.isTestnet = isTestnet;
    const network = isTestnet ? NFT_CONFIG.network.testnet : NFT_CONFIG.network.mainnet;
    
    try {
      this.provider = new providers.JsonRpcProvider(network.rpcUrl);
    } catch (error) {
      throw new InitializationError(`Failed to initialize provider: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validates NFT metadata against schema
   * @param metadata - The metadata to validate
   */
  private validateMetadata(metadata: NFTMetadata): void {
    const { required, properties } = NFT_CONFIG.metadata.schema;
    
    for (const field of required) {
      if (!metadata[field]) {
        throw new ValidationError(`Missing required field: ${field}`);
      }
    }

    for (const [key, value] of Object.entries(metadata)) {
      const propertyType = properties[key]?.type;
      if (propertyType && typeof value !== propertyType) {
        throw new ValidationError(`Invalid type for ${key}: expected ${propertyType}, got ${typeof value}`);
      }
    }
  }

  /**
   * Connects to the blockchain network and initializes services
   * @param privateKey - Private key for wallet connection
   * @returns Object containing initialized services
   */
  public async connect(privateKey: string): Promise<InitializationResult> {
    try {
      this.signer = new ethers.Wallet(privateKey, this.provider);
      
      const network = this.isTestnet ? NFT_CONFIG.network.testnet : NFT_CONFIG.network.mainnet;
      
      // Initialize factory contract
      this.factoryContract = DynamicNFTFactory__factory.connect(
        network.factoryAddress,
        this.signer
      );

      // Initialize Irys
      const irysConfig: IrysConfig = {
        url: NFT_CONFIG.irys.node,
        token: NFT_CONFIG.irys.token,
        provider: this.provider
      };

      this.irys = new WebIrys(irysConfig);
      await this.irys.ready();

      return {
        provider: this.provider,
        signer: this.signer,
        irys: this.irys,
        factoryContract: this.factoryContract
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new InitializationError(`Failed to initialize services: ${errorMessage}`);
    }
  }

  /**
   * Deploys a new NFT collection contract
   * @param name - Collection name
   * @param symbol - Collection symbol
   * @returns Deployment result
   */
  public async deployCollection(
    name: string,
    symbol: string
  ): Promise<DeploymentResult> {
    if (!this.factoryContract || !this.signer) {
      throw new InitializationError('Services not initialized. Call connect() first.');
    }

    try {
      const tx = await this.factoryContract.deployNFTContract(
        name,
        symbol,
        {
          gasLimit: NFT_CONFIG.deployment.gasLimit
        }
      );

      const receipt = await tx.wait(NFT_CONFIG.deployment.confirmations);
      const event = receipt.events?.find(e => e.event === 'NFTContractDeployed');

      if (!event) {
        throw new Error('Deployment event not found');
      }

      return {
        contractAddress: event.args.contractAddress,
        transactionHash: tx.hash,
        owner: await this.signer.getAddress()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to deploy collection: ${errorMessage}`);
    }
  }

  /**
   * Uploads metadata to Irys
   * @param metadata - NFT metadata
   * @returns Metadata URL
   */
  public async uploadMetadata(metadata: NFTMetadata): Promise<string> {
    if (!this.irys) {
      throw new InitializationError('Irys not initialized. Call connect() first.');
    }

    try {
      this.validateMetadata(metadata);

      const metadataBuffer = Buffer.from(JSON.stringify(metadata));
      const upload = await this.irys.upload(metadataBuffer, {
        tags: NFT_CONFIG.irys.defaultTags
      });

      return `https://arweave.net/${upload.id}`;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to upload metadata: ${errorMessage}`);
    }
  }

  /**
   * Gets all NFT contracts deployed by a user
   * @param userAddress - Address to query
   * @returns Array of contract addresses
   */
  public async getUserCollections(userAddress: string): Promise<string[]> {
    if (!this.factoryContract) {
      throw new InitializationError('Factory not initialized. Call connect() first.');
    }

    try {
      return await this.factoryContract.getUserContracts(userAddress);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to get user collections: ${errorMessage}`);
    }
  }

  /**
   * Gets the current wallet balance
   * @returns Current balance
   */
  public async getBalance(): Promise<BigNumber> {
    if (!this.signer) {
      throw new InitializationError('Signer not initialized. Call connect() first.');
    }

    try {
      return await this.signer.getBalance();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to get balance: ${errorMessage}`);
    }
  }

  /**
   * Gets the current Irys balance
   * @returns Current Irys balance
   */
  public async getIrysBalance(): Promise<BigNumber> {
    if (!this.irys) {
      throw new InitializationError('Irys not initialized. Call connect() first.');
    }

    try {
      return await this.irys.getLoadedBalance();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to get Irys balance: ${errorMessage}`);
    }
  }

  /**
   * Funds the Irys instance
   * @param amount - Amount to fund
   * @returns Funding transaction
   */
  public async fundIrys(amount: string): Promise<any> {
    if (!this.irys) {
      throw new InitializationError('Irys not initialized. Call connect() first.');
    }

    try {
      return await this.irys.fund(amount);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to fund Irys: ${errorMessage}`);
    }
  }
}