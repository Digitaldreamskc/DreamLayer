import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAccount, useNetwork, useSignMessage } from 'wagmi'
import { TRANSACTION_LIMITS, STORAGE_KEYS } from '../config/wallet'
import { parseEther } from 'viem'

interface TransactionHistory {
  hash: string
  amount: string
  timestamp: number
  status: 'pending' | 'confirmed' | 'failed'
  to: string
}

interface WalletContextType {
  isConnected: boolean
  address: string | undefined
  chainId: number | undefined
  dailyTransactions: number
  transactionHistory: TransactionHistory[]
  canMakeTransaction: (amount: string) => Promise<{ can: boolean; reason?: string }>
  signMessage: (message: string) => Promise<string>
  addToTransactionHistory: (transaction: Omit<TransactionHistory, 'timestamp'>) => void
  updateTransactionStatus: (hash: string, status: TransactionHistory['status']) => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const { signMessageAsync } = useSignMessage()
  
  const [dailyTransactions, setDailyTransactions] = useState(0)
  const [transactionHistory, setTransactionHistory] = useState<TransactionHistory[]>([])

  // Load transaction history from local storage
  useEffect(() => {
    if (address) {
      const stored = localStorage.getItem(`${STORAGE_KEYS.TRANSACTION_HISTORY}_${address}`)
      if (stored) {
        setTransactionHistory(JSON.parse(stored))
      }

      // Reset daily transactions if it's a new day
      const lastDate = localStorage.getItem(`${STORAGE_KEYS.LAST_TRANSACTION_DATE}_${address}`)
      const today = new Date().toDateString()
      
      if (lastDate !== today) {
        setDailyTransactions(0)
        localStorage.setItem(`${STORAGE_KEYS.LAST_TRANSACTION_DATE}_${address}`, today)
      } else {
        const storedDaily = localStorage.getItem(`${STORAGE_KEYS.DAILY_TRANSACTIONS}_${address}`)
        if (storedDaily) {
          setDailyTransactions(Number(storedDaily))
        }
      }
    }
  }, [address])

  // Save transaction history to local storage
  useEffect(() => {
    if (address && transactionHistory.length > 0) {
      localStorage.setItem(
        `${STORAGE_KEYS.TRANSACTION_HISTORY}_${address}`,
        JSON.stringify(transactionHistory)
      )
    }
  }, [transactionHistory, address])

  // Check if a transaction can be made based on limits
  const canMakeTransaction = async (amount: string) => {
    if (!address) {
      return { can: false, reason: 'Wallet not connected' }
    }

    const etherAmount = parseEther(amount)
    const dailyLimit = parseEther(TRANSACTION_LIMITS.DAILY_LIMIT)
    const singleLimit = parseEther(TRANSACTION_LIMITS.SINGLE_TRANSACTION_LIMIT)

    if (etherAmount > singleLimit) {
      return { can: false, reason: 'Amount exceeds single transaction limit' }
    }

    // Calculate daily total
    const todaysTransactions = transactionHistory
      .filter(tx => {
        const txDate = new Date(tx.timestamp).toDateString()
        const today = new Date().toDateString()
        return txDate === today
      })
      .reduce((acc, tx) => acc + Number(tx.amount), 0)

    if (todaysTransactions + Number(amount) > Number(TRANSACTION_LIMITS.DAILY_LIMIT)) {
      return { can: false, reason: 'Amount would exceed daily limit' }
    }

    return { can: true }
  }

  const signMessage = async (message: string) => {
    return await signMessageAsync({ message })
  }

  const addToTransactionHistory = (transaction: Omit<TransactionHistory, 'timestamp'>) => {
    const newTransaction = {
      ...transaction,
      timestamp: Date.now(),
    }
    setTransactionHistory(prev => [newTransaction, ...prev])
    setDailyTransactions(prev => {
      const newCount = prev + 1
      if (address) {
        localStorage.setItem(`${STORAGE_KEYS.DAILY_TRANSACTIONS}_${address}`, String(newCount))
      }
      return newCount
    })
  }

  const updateTransactionStatus = (hash: string, status: TransactionHistory['status']) => {
    setTransactionHistory(prev =>
      prev.map(tx =>
        tx.hash === hash ? { ...tx, status } : tx
      )
    )
  }

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        chainId: chain?.id,
        dailyTransactions,
        transactionHistory,
        canMakeTransaction,
        signMessage,
        addToTransactionHistory,
        updateTransactionStatus,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}