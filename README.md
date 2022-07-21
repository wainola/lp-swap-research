# Swap/LP stuff

```bash
yarn
# create env file with alchemy https key
yarn hardhat --config ./hardhat-config.fork.js node --port 8551

# for running the script
yarn hardhat run scripts/swap.fork.js

# for running the test
yarn hardhat --config ./hardhat-config.fork.js test
```
