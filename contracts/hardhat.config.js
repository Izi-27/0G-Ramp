require('dotenv').config()
require('@nomicfoundation/hardhat-toolbox')

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.23',
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    hardhat: {},
    localhost: {
      url: process.env.LOCAL_RPC_URL || 'http://127.0.0.1:8545',
    },
    docker: {
      url: process.env.DOCKER_RPC_URL || 'http://contracts-node:8545',
    },
    ogGalileo: {
      url: process.env.OG_RPC_URL || 'https://evmrpc-testnet.0g.ai',
      chainId: 16602,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    ogMainnet: {
      url: process.env.OG_RPC_URL || 'https://evmrpc.0g.ai',
      chainId: 16661,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: process.env.ETHERSCAN_API_KEY ? { apiKey: process.env.ETHERSCAN_API_KEY } : {},
}