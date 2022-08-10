import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from 'dotenv'

dotenv.config()

// Uniswap V3 Periphery settings
const DEFAULT_COMPILER_SETTINGS = {
  version: "0.7.6",
  settings: {
    evmVersion: "istanbul",
    optimizer: {
      enabled: true,
      runs: 1_000_000,
    },
    metadata: {
      bytecodeHash: "none",
    },
  },
};

const alchemyApiKey = process.env.ALCHEMY_API
if (!alchemyApiKey) {
  throw new Error("Please set your ALCHEMY_API in a .env file");
}

const config: HardhatUserConfig = {
  solidity: {
    compilers: [DEFAULT_COMPILER_SETTINGS],
  },
  networks: {
    hardhat: {
      loggingEnabled: true,
      forking: {
        url: alchemyApiKey,
        blockNumber: 13909440,
      }
    }
  }
};

export default config;
