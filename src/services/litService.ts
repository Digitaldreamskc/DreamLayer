import * as LitJsSdk from "@lit-protocol/lit-node-client"
import { LitNetwork } from "@lit-protocol/constants"
import { showToast } from '@/utils/toast'
import { ethers } from 'ethers'

let litNodeClientInstance: LitJsSdk.LitNodeClient | null = null

// Initialize Lit client
const getLitNodeClient = async (): Promise<LitJsSdk.LitNodeClient> => {
  if (litNodeClientInstance) return litNodeClientInstance

  litNodeClientInstance = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    litNetwork: LitNetwork.DatilDev, // Using DatilDev for development
    debug: false,
  })

  await litNodeClientInstance.connect()
  return litNodeClientInstance
}

// Define access control conditions
export const getAccessControlConditions = (nftContractAddress?: string) => {
  if (nftContractAddress) {
    // If NFT contract address is provided, only allow NFT holders to decrypt
    return [
      {
        contractAddress: nftContractAddress,
        standardContractType: "ERC721",
        chain: "ethereum",
        method: "balanceOf",
        parameters: [":userAddress"],
        returnValueTest: {
          comparator: ">",
          value: "0"
        }
      }
    ]
  }

  // Default: Allow any Ethereum address
  return [
    {
      contractAddress: "",
      standardContractType: "",
      chain: "ethereum",
      method: "eth_getBalance",
      parameters: [":userAddress", "latest"],
      returnValueTest: {
        comparator: ">=",
        value: "0"
      }
    }
  ]
}

// Encrypt data
export const encryptData = async (
  dataToEncrypt: string,
  nftContractAddress?: string
): Promise<{ ciphertext: string; dataToEncryptHash: string }> => {
  try {
    showToast.info('Encrypting', 'Preparing data encryption...')
    const litNodeClient = await getLitNodeClient()
    const accessControlConditions = getAccessControlConditions(nftContractAddress)

    const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
      {
        accessControlConditions,
        dataToEncrypt,
      },
      litNodeClient
    )

    showToast.success('Success', 'Data encrypted successfully!')
    return { ciphertext, dataToEncryptHash }
  } catch (error) {
    console.error('Encryption failed:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to encrypt data'
    showToast.error('Encryption Failed', errorMessage)
    throw new Error(errorMessage)
  }
}

// Decrypt data
export const decryptData = async (
  ciphertext: string,
  dataToEncryptHash: string,
  nftContractAddress?: string
): Promise<string> => {
  try {
    showToast.info('Decrypting', 'Preparing data decryption...')
    const litNodeClient = await getLitNodeClient()
    const accessControlConditions = getAccessControlConditions(nftContractAddress)

    // Get session signatures
    const sessionSigs = await litNodeClient.getSessionSigs({
      chain: "ethereum",
      resourceAbilityRequests: [
        {
          resource: new LitJsSdk.LitAccessControlConditionResource("*"),
          ability: LitJsSdk.LitAbility.AccessControlConditionDecryption,
        },
      ],
      authNeededCallback: async (params: any) => {
        if (!window.ethereum) throw new Error('No Ethereum provider found')
        
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = await provider.getSigner()
        const walletAddress = await signer.getAddress()
        const latestBlockhash = await litNodeClient.getLatestBlockhash()

        const toSign = await LitJsSdk.createSiweMessageWithRecaps({
          uri: params.uri,
          expiration: params.expiration,
          resources: params.resourceAbilityRequests,
          walletAddress,
          nonce: latestBlockhash,
          litNodeClient,
        })

        const authSig = await LitJsSdk.generateAuthSig({
          signer,
          toSign,
        })

        return authSig
      },
    })

    const decryptedString = await LitJsSdk.decryptToString(
      {
        accessControlConditions,
        chain: "ethereum",
        ciphertext,
        dataToEncryptHash,
        sessionSigs,
      },
      litNodeClient
    )

    showToast.success('Success', 'Data decrypted successfully!')
    return decryptedString
  } catch (error) {
    console.error('Decryption failed:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to decrypt data'
    showToast.error('Decryption Failed', errorMessage)
    throw new Error(errorMessage)
  }
} 