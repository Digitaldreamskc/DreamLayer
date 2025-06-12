import { Chain } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'

export const SUPPORTED_CHAINS: Chain[] = [
  mainnet,
  sepolia,
]

export const DEFAULT_CHAIN = mainnet

// Transaction limits (in ETH)
export const TRANSACTION_LIMITS = {
  DAILY_LIMIT: '10',
  SINGLE_TRANSACTION_LIMIT: '5',
  MINIMUM_BALANCE: '0.01',
}

// Time constants
export const TIME_CONSTANTS = {
  TRANSACTION_TIMEOUT: 60000, // 1 minute in milliseconds
  CONFIRMATION_BLOCKS: 3, // Number of blocks to wait for confirmation
}

// Storage keys
export const STORAGE_KEYS = {
  TRANSACTION_HISTORY: 'transaction_history',
  DAILY_TRANSACTIONS: 'daily_transactions',
  LAST_TRANSACTION_DATE: 'last_transaction_date',
}