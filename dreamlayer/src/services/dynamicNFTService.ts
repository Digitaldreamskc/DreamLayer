import { ethers } from 'ethers';
import { ERC7160Deployer } from '../utils/contracts/deployERC7160';
import { IrysMetadataHandler } from '../utils/metadata/irysHandler';

interface NFTDeploymentService {
  contractAddress?: string;
  baseURI?: string;
}

export class DynamicNFTService {
  private deployer: ERC7160Deployer;
  private metadataHandler: IrysMetadataHandler;
  private deploymentState: NFTDeploymentService = {};

  constructor(
    deployer: ERC7160Deployer,
    metadataHandler: IrysMetadataHandler
  ) {
    this.deployer = deployer;
    this.metadataHandler = metadataHandler;
  }

  async deployContract(
    name: string,
    symbol: string,
    initialMetadata: any
  ): Promise<string> {
    try {
      // 1. Upload initial metadata to Irys
      await this.metadataHandler.initialize();
      const baseURI = await this.metadataHandler.uploadMetadata(initialMetadata);

      // 2. Deploy the ERC7160 contract
      const { address, contract } = await this.deployer.deploy({
        name,
        symbol,
        baseURI,
      });

      // 3. Store the deployment information
      this.deploymentState = {
        contractAddress: address,
        baseURI,
      };

      return address;
    } catch (error) {
      console.error('Error in contract deployment:', error);
      throw error;
    }
  }

  async mintNFT(
    to: string,
    tokenId: number,
    metadata: any
  ): Promise<{ transactionHash: string; metadataUrl: string }> {
    if (!this.deploymentState.contractAddress) {
      throw new Error('Contract not deployed yet');
    }

    try {
      // 1. Upload the new token metadata to Irys
      const metadataUrl = await this.metadataHandler.uploadMetadata(metadata);

      // 2. Get contract instance
      const contract = await this.getContractInstance();

      // 3. Mint the NFT
      const tx = await contract.mint(to, tokenId);
      const receipt = await tx.wait();

      return {
        transactionHash: receipt.transactionHash,
        metadataUrl,
      };
    } catch (error) {
      console.error('Error minting NFT:', error);
      throw error;
    }
  }

  async updateTokenMetadata(
    tokenId: number,
    newMetadata: any
  ): Promise<{ transactionHash: string; metadataUrl: string }> {
    if (!this.deploymentState.contractAddress) {
      throw new Error('Contract not deployed yet');
    }

    try {
      // 1. Upload the new metadata to Irys
      const metadataUrl = await this.metadataHandler.uploadMetadata(newMetadata);

      // 2. Get contract instance
      const contract = await this.getContractInstance();

      // 3. Update the token's metadata
      const tx = await contract.setTokenURI(tokenId, metadataUrl);
      const receipt = await tx.wait();

      return {
        transactionHash: receipt.transactionHash,
        metadataUrl,
      };
    } catch (error) {
      console.error('Error updating token metadata:', error);
      throw error;
    }
  }

  private async getContractInstance(): Promise<ethers.Contract> {
    if (!this.deploymentState.contractAddress) {
      throw new Error('Contract not deployed yet');
    }
    
    const ERC7160 = await getContract('ERC7160');
    return new ethers.Contract(
      this.deploymentState.contractAddress,
      ERC7160.abi,
      this.deployer.getSigner()
    );
  }

  getDeploymentState(): NFTDeploymentService {
    return { ...this.deploymentState };
  }
}