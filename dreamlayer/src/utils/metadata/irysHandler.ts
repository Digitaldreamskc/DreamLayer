import { WebIrys } from "@irys/sdk";
import { providers } from "ethers";

interface IrysConfig {
  url: string;
  token: string;
  provider: providers.Provider;
}

export class IrysMetadataHandler {
  private webIrys: WebIrys;

  constructor(config: IrysConfig) {
    this.webIrys = new WebIrys({
      url: config.url, // Usually "https://node2.irys.xyz"
      token: config.token,
      provider: config.provider,
    });
  }

  async initialize() {
    await this.webIrys.ready();
  }

  async uploadMetadata(metadata: any): Promise<string> {
    try {
      // Upload metadata to Irys
      const receipt = await this.webIrys.upload(
        JSON.stringify(metadata),
        {
          tags: [{ name: "Content-Type", value: "application/json" }],
        }
      );

      // Return the Irys URL
      return `https://gateway.irys.xyz/${receipt.id}`;
    } catch (error) {
      console.error('Error uploading metadata to Irys:', error);
      throw error;
    }
  }

  async uploadImage(imageBuffer: Buffer, contentType: string): Promise<string> {
    try {
      const receipt = await this.webIrys.upload(
        imageBuffer,
        {
          tags: [{ name: "Content-Type", value: contentType }],
        }
      );

      return `https://gateway.irys.xyz/${receipt.id}`;
    } catch (error) {
      console.error('Error uploading image to Irys:', error);
      throw error;
    }
  }
}