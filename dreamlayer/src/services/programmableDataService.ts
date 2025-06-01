import { Wallet } from "ethers"
import { showToast } from '@/utils/toast'
import { getIrysUploader } from './dynamicNFTService'

interface ProgrammableDataConfig {
  transactionId: string
  startOffset: number
  length: number
  contractAddress: string
  tokenId: number
}

/**
 * Updates token data using Programmable Data
 * @param config Configuration for the programmable data update
 * @param privateKey Private key for signing the transaction
 */
export async function updateTokenDataWithProgrammableData(
  config: ProgrammableDataConfig,
  privateKey: string
) {
  try {
    showToast.info('Updating', 'Preparing programmable data update...')
    const irys = await getIrysUploader()

    // Create access list for reading data
    const accessList = await irys.programmable_data
      .read(config.transactionId, config.startOffset, config.length)
      .toAccessList()

    // Create and send transaction
    const wallet = new Wallet(privateKey, irys.api.rpcProvider)
    const evmTransaction = {
      to: config.contractAddress,
      data: encodeUpdateTokenDataFunction(config.tokenId, config.transactionId, config.startOffset, config.length),
      accessList: [accessList],
      type: 2 // EIP-1559 transaction
    }

    const tx = await wallet.sendTransaction(evmTransaction)
    await tx.wait()

    showToast.success('Success', 'Token data updated successfully!')
    return tx.hash
  } catch (error) {
    console.error('Failed to update token data:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to update token data'
    showToast.error('Update Failed', errorMessage)
    throw new Error(errorMessage)
  }
}

/**
 * Encodes the updateTokenData function call
 */
function encodeUpdateTokenDataFunction(
  tokenId: number,
  transactionId: string,
  startOffset: number,
  length: number
): string {
  // Function selector for updateTokenData(uint256,bytes32,uint256,uint256)
  const selector = '0x12345678' // Replace with actual function selector
  const tokenIdHex = tokenId.toString(16).padStart(64, '0')
  const txIdHex = transactionId.slice(2).padStart(64, '0')
  const startOffsetHex = startOffset.toString(16).padStart(64, '0')
  const lengthHex = length.toString(16).padStart(64, '0')

  return selector + tokenIdHex + txIdHex + startOffsetHex + lengthHex
}

/**
 * Reads token data from the contract
 * @param contractAddress Address of the DynamicNFT contract
 * @param tokenId ID of the token to read
 * @param provider Ethereum provider
 */
export async function readTokenData(
  contractAddress: string,
  tokenId: number,
  provider: any
): Promise<string> {
  try {
    const contract = new ethers.Contract(
      contractAddress,
      ['function getTokenData(uint256) view returns (bytes)'],
      provider
    )

    const data = await contract.getTokenData(tokenId)
    return ethers.utils.toUtf8String(data)
  } catch (error) {
    console.error('Failed to read token data:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to read token data'
    showToast.error('Read Failed', errorMessage)
    throw new Error(errorMessage)
  }
} 