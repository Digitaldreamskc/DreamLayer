import React from 'react'
import { useWallet } from '@/contexts/WalletContext'
import { useAccount, useConnect, useDisconnect, usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from 'wagmi'
import { parseEther } from 'viem'
import { TRANSACTION_LIMITS, TIME_CONSTANTS } from '@/config/wallet'

interface TransactionProps {
  to: string
  amount: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export const WalletConnection: React.FC = () => {
  const { connect, connectors, error: connectError } = useConnect()
  const { disconnect } = useDisconnect()
  const { address, isConnected } = useAccount()
  const { transactionHistory } = useWallet()

  return (
    <div className="space-y-4">
      {!isConnected ? (
        <div>
          <h2 className="text-xl font-bold mb-4">Connect Wallet</h2>
          <div className="space-y-2">
            {connectors.map((connector) => (
              <button
                key={connector.id}
                onClick={() => connect({ connector })}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
              >
                Connect {connector.name}
              </button>
            ))}
          </div>
          {connectError && (
            <p className="text-red-500 mt-2">{connectError.message}</p>
          )}
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Wallet Connected</h2>
            <button
              onClick={() => disconnect()}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Disconnect
            </button>
          </div>
          <p className="text-sm mb-2">
            Address: {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Transaction History</h3>
            <div className="space-y-2">
              {transactionHistory.map((tx) => (
                <div
                  key={tx.hash}
                  className="border p-2 rounded"
                >
                  <p className="text-sm">
                    To: {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                  </p>
                  <p className="text-sm">Amount: {tx.amount} ETH</p>
                  <p className="text-sm">
                    Status:{' '}
                    <span
                      className={`${
                        tx.status === 'confirmed'
                          ? 'text-green-500'
                          : tx.status === 'failed'
                          ? 'text-red-500'
                          : 'text-yellow-500'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export const TransactionForm: React.FC<TransactionProps> = ({
  to,
  amount,
  onSuccess,
  onError,
}) => {
  const { canMakeTransaction, addToTransactionHistory, updateTransactionStatus } = useWallet()

  const { config } = usePrepareSendTransaction({
    to,
    value: parseEther(amount),
  })

  const { data, sendTransaction } = useSendTransaction(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    confirmations: TIME_CONSTANTS.CONFIRMATION_BLOCKS,
    timeout: TIME_CONSTANTS.TRANSACTION_TIMEOUT,
  })

  const handleTransaction = async () => {
    try {
      const { can, reason } = await canMakeTransaction(amount)
      if (!can) {
        throw new Error(reason)
      }

      if (!sendTransaction) {
        throw new Error('Transaction not ready')
      }

      sendTransaction()

      if (data?.hash) {
        addToTransactionHistory({
          hash: data.hash,
          amount,
          to,
          status: 'pending',
        })
      }
    } catch (error) {
      onError?.(error as Error)
    }
  }

  React.useEffect(() => {
    if (data?.hash) {
      if (isSuccess) {
        updateTransactionStatus(data.hash, 'confirmed')
        onSuccess?.()
      } else if (!isLoading) {
        updateTransactionStatus(data.hash, 'failed')
      }
    }
  }, [isSuccess, isLoading, data?.hash])

  return (
    <div className="space-y-4">
      <button
        onClick={handleTransaction}
        disabled={!sendTransaction || isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isLoading ? 'Confirming...' : 'Send Transaction'}
      </button>
      {data?.hash && (
        <p className="text-sm">
          Transaction Hash: {data.hash.slice(0, 6)}...{data.hash.slice(-4)}
        </p>
      )}
    </div>
  )
}