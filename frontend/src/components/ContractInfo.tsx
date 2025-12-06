import { useReadContract } from 'wagmi'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import type { Abi } from 'viem'
import { ogMainnet } from '../lib/wagmi'

const adminAddress = import.meta.env.VITE_RAMP_ADMIN_ADDRESS || '0x0601ED877D78dc4BE53cDd25A0dAfF3F6d261640'
const adminAbi: Abi = [
  {
    type: 'function',
    name: 'feeBps',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
]

export default function ContractInfo() {
  const { data, isLoading, error } = useReadContract({
    address: adminAddress as `0x${string}`,
    abi: adminAbi,
    functionName: 'feeBps',
    chainId: ogMainnet.id,
  })

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
      className="relative group"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-pink-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative rounded-2xl border border-base-600/50 bg-base-800/50 backdrop-blur-md p-6 hover:border-purple-500/30 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                <Icon icon="mdi:ethereum" className="text-2xl text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-xl blur-md" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Contract Info</h2>
              <p className="text-sm text-gray-400">Network & contract details</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            <span>Live</span>
          </div>
        </div>

        {/* Contract Details */}
        <div className="space-y-4">
          {/* Network Info */}
          <div className="p-4 rounded-xl bg-base-900/30 border border-base-600/30">
            <div className="flex items-center gap-2 mb-2">
              <Icon icon="mdi:network" className="text-purple-400" />
              <span className="text-sm font-medium text-white">Network</span>
            </div>
            <div className="text-gray-300">
              <div className="flex items-center justify-between">
                <span>0G Mainnet</span>
                <span className="text-purple-400 font-mono text-sm">16661</span>
              </div>
            </div>
          </div>

          {/* Contract Address */}
          <div className="p-4 rounded-xl bg-base-900/30 border border-base-600/30">
            <div className="flex items-center gap-2 mb-2">
              <Icon icon="mdi:file-document-outline" className="text-purple-400" />
              <span className="text-sm font-medium text-white">RampAdmin Contract</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-300 font-mono text-sm flex-1 break-all">
                {formatAddress(adminAddress)}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => copyToClipboard(adminAddress)}
                className="p-2 rounded-lg bg-base-800/50 hover:bg-base-700/50 text-gray-400 hover:text-white transition-colors"
                title="Copy full address"
              >
                <Icon icon="mdi:content-copy" />
              </motion.button>
            </div>
          </div>

          {/* Fee Information */}
          <div className="p-4 rounded-xl bg-base-900/30 border border-base-600/30">
            <div className="flex items-center gap-2 mb-2">
              <Icon icon="mdi:percent" className="text-purple-400" />
              <span className="text-sm font-medium text-white">Transaction Fee</span>
            </div>
            <div className="flex items-center gap-2">
              {isLoading ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <Icon icon="mdi:loading" className="animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : error ? (
                <div className="flex items-center gap-2 text-red-400">
                  <Icon icon="mdi:alert-circle" />
                  <span>Error loading fee</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-purple-400 font-mono text-sm">
                    {data?.toString?.()} bps
                  </span>
                  <span className="text-gray-400 text-xs">
                    ({((Number(data?.toString?.() || '0')) / 100).toFixed(2)}%)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/30">
            <Icon icon="mdi:check-circle" className="text-green-400" />
            <span className="text-green-400 text-sm font-medium">Contract Connected</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}