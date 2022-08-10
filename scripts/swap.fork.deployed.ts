(async () => {
  const SwapExampleJSON = require('../artifacts/contracts/SwapExample.sol/SwapExample.json')
  const { ethers } = require('ethers')

  const address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
  const provider = new ethers.providers.JsonRpcProvider('http://localhost:8551')
  const signer = provider.getSigner(address)

  const swapperAddress = '0x6F6f570F45833E249e27022648a26F4076F48f78'

  const swapContract = new ethers.Contract(
    swapperAddress,
    SwapExampleJSON.abi
  )

  const swapInstance = swapContract.connect(signer)

  const erc_abi = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "guy", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "src", "type": "address" }, { "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "wad", "type": "uint256" }], "name": "withdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "deposit", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": true, "name": "guy", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": true, "name": "dst", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "dst", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Deposit", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Withdrawal", "type": "event" }]

  const wehtAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
  const wethContract = new ethers.Contract(wehtAddress, erc_abi, signer)
  const daiAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
  const daiContract = new ethers.Contract(daiAddress, erc_abi, signer)

  const approve = await wethContract.approve(swapInstance.address, ethers.utils.parseEther('1'))
  const approvalTx = await approve.wait(1)

  console.log("approval status", approvalTx.status)

  // 1 WETH FOR DAI
  const swapExact = await swapInstance.swapExactInputSingle(ethers.utils.parseEther('1'))
  const swapTx = await swapExact.wait(1)

  console.log("Tx Swap", swapTx.status)

  console.log("Balance weth", ethers.utils.formatEther(await wethContract.balanceOf(signer._address)))
  console.log("balance DAI", ethers.utils.formatEther(await daiContract.balanceOf(signer._address)))
})()
