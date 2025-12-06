import { createConfig } from 'wagmi'
import { http, defineChain, type Chain } from 'viem'
import { mainnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

// 0G Mainnet definition
export const ogMainnet = defineChain({
  id: 16661,
  name: '0G Mainnet',
  network: 'ogMainnet',
  nativeCurrency: { name: '0G', symbol: '0G', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://evmrpc.0g.ai'] },
    public: { http: ['https://evmrpc.0g.ai'] },
  },
  blockExplorers: {
    default: { name: '0G ChainScan', url: 'https://chainscan.0g.ai' },
  },
  testnet: false,
})

export const localhost = defineChain({
  id: 31337,
  name: 'Hardhat Local',
  network: 'localhost',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
    public: { http: ['http://127.0.0.1:8545'] },
  },
  testnet: true,
})

const chains = [ogMainnet, localhost, mainnet] as const satisfies readonly [Chain, ...Chain[]]

const transports = {
  [ogMainnet.id]: http(ogMainnet.rpcUrls.default.http[0]!),
  [localhost.id]: http(localhost.rpcUrls.default.http[0]!),
  [mainnet.id]: http(mainnet.rpcUrls.default.http[0]!),
} as const

export const wagmiConfig = createConfig({
  chains,
  transports,
  connectors: [injected({ shimDisconnect: true })],
})