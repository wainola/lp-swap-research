const dotenv = require('dotenv');

dotenv.config()

require('@typechain/hardhat')
require("@nomiclabs/hardhat-waffle");
require('hardhat-watcher')
require('@nomiclabs/hardhat-ethers')

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const alchemyApiKey = process.env.ALCHEMY_API
if (!alchemyApiKey) {
  throw new Error("Please set your ALCHEMY_API in a .env file");
}


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      { version: '0.8.0' },
      { version: '^0.8.0' },
      { version: '>=0.5.0' },
      { version: '>=0.7.5' },
      { version: '=0.8.0' },
      { version: '0.4.18' },
      { version: '0.4.22' }
    ],
  },
  watcher: {
    test: {
      tasks: [{ command: 'test', params: { testFiles: ['{path}'] } }],
      files: ['./test/**/*'],
      verbose: true,
    },
  },
  networks: {
    hardhat: {
      loggingEnabled: true,
      // forking: {
      //   url: alchemyApiKey,
      //   blockNumber: 13909440,
      // }
    }
  }
};
