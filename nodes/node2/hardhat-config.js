const dotenv = require("dotenv");

dotenv.config();

require("@typechain/hardhat");
require("@nomiclabs/hardhat-waffle");
require("hardhat-watcher");
require("@nomiclabs/hardhat-ethers");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const alchemyApiKey = process.env.ALCHEMY_API;
if (!alchemyApiKey) {
  throw new Error("Please set your ALCHEMY_API in a .env file");
}

const UNISWAP_SETTING = {
  version: '0.7.6',
  settings: {
    optimizer: {
      enabled: true,
      runs: 800,
    }
  }
}

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.0" },
      { version: "^0.8.0" },
      { version: ">=0.5.0" },
      { version: ">=0.7.5" },
      { version: "=0.8.0" },
      { version: "0.4.18" },
      { version: "0.4.22" },
      // { version: "=0.7.6" },
      {
        version: "0.8.15",
        settings: {
          optimizer: {
            enabled: true,
            runs: 2000,
          },
        },
      },
      UNISWAP_SETTING
    ],
    overrides: {
			'@uniswap/v3-periphery/contracts/libraries/PoolAddress.sol': UNISWAP_SETTING,
		}
  },
  watcher: {
    test: {
      tasks: [{ command: "test", params: { testFiles: ["{path}"] } }],
      files: ["./test/**/*"],
      verbose: true,
    },
  },
  networks: {
    hardhat: {
      loggingEnabled: true,
      forking: {
        url: alchemyApiKey,
        blockNumber: 13909542,
      },
      accounts: [
        {
          privateKey:
            "0x000000000000000000000000000000000000000000000000000000616c696365",
          balance: "10000000000000000000000",
        },
        {
          privateKey:
            "0x0000000000000000000000000000000000000000000000000000000000626f62",
          balance: "10000000000000000000000",
        },
        {
          privateKey:
            "0x00000000000000000000000000000000000000000000000000636861726c6965",
          balance: "10000000000000000000000",
        },
        {
          privateKey:
            "0x0000000000000000000000000000000000000000000000000000000064617665",
          balance: "10000000000000000000000",
        },
        {
          privateKey:
            "0x0000000000000000000000000000000000000000000000000000000000657665",
          balance: "10000000000000000000000",
        },
        {
          privateKey:
            "24a99b1a133711b5281ce2a84c218a994372e363717d083331a7061185da2db5",
          balance: "10000000000000000000000",
        },
      ],
      chainId: 567
    },
  },
};
