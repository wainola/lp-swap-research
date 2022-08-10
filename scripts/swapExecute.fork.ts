(async () => {
  const { Bridge__factory, GenericHandler__factory, BasicFeeHandler__factory } = require("@chainsafe/chainbridge-contracts")
  const SwapExampleJSON = require('../artifacts/contracts/SwapExample.sol/SwapExample.json')
  const { ethers } = require('ethers')
  const { createGenericDepositData } = require('./utils')

  const address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
  const provider = new ethers.providers.JsonRpcProvider('http://localhost:8550')
  const signer = provider.getSigner(address)

  const bridgeContract = new ethers.Contract(
    '0xfaAddC93baf78e89DCf37bA67943E1bE8F37Bb8c',
    Bridge__factory.abi,
  )

  const genericContract = new ethers.Contract(
    '0x276C216D241856199A83bf27b2286659e5b877D3',
    GenericHandler__factory.abi
  )

  const basicFeeContract = new ethers.Contract(
    '0x3347B4d90ebe72BeFb30444C9966B2B990aE9FcB',
    BasicFeeHandler__factory.abi
  )

  const bridgeInstance = bridgeContract.connect(signer)
  const basicFeeInstance = basicFeeContract.connect(signer)
  const genericInstance = genericContract.connect(signer)

  const swapperAddress = '0xD49a0e9A4CD5979aE36840f542D2d7f02C4817Be'

  const swapContract = new ethers.Contract(
    swapperAddress,
    SwapExampleJSON.abi
  )

  const swapInstance = swapContract.connect(signer)

  const swapFilter = swapInstance.filters.SwapExactInputSingleEvent()

  swapInstance.on(swapFilter, (swapMessage, amountIn, amounOut) => console.log(`SwapExactInputSingleEvent message: ${swapMessage} - ${amountIn} - ${amounOut}`))

  const resourceId = await genericInstance._contractAddressToResourceID(swapperAddress)

  const sigHash = await genericInstance._contractAddressToDepositFunctionSignature(swapperAddress)

  console.log("swapper resource id", resourceId)
  console.log("signature from generic", sigHash)

  const encodedData = ethers.utils.defaultAbiCoder.encode(
    ['uint256'], [1]
  )

  const genericData = createGenericDepositData(encodedData)

  const erc_abi = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "guy", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "src", "type": "address" }, { "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "wad", "type": "uint256" }], "name": "withdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "deposit", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": true, "name": "guy", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": true, "name": "dst", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "dst", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Deposit", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Withdrawal", "type": "event" }]

  const wehtAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
  const wethContract = new ethers.Contract(wehtAddress, erc_abi, signer)
  const daiAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
  const daiContract = new ethers.Contract(daiAddress, erc_abi, signer)

  console.log("Balance weth", ethers.utils.formatEther(await wethContract.balanceOf(signer._address)))
  console.log("balance DAI", ethers.utils.formatEther(await daiContract.balanceOf(signer._address)))

  console.log("ALLOWANCE FOR SWAPPER CONTRACT", ethers.utils.formatEther(await wethContract.allowance(signer._address, '0xD49a0e9A4CD5979aE36840f542D2d7f02C4817Be')))

  console.log("ALLOWANCE FOR GENERCI HANDLER", ethers.utils.formatEther(await wethContract.allowance(signer._address, '0x276C216D241856199A83bf27b2286659e5b877D3')))

  console.log("ALLOWANCE IN THE NAME OF GENERIC HANDLER", ethers.utils.formatEther(await wethContract.allowance('0x276C216D241856199A83bf27b2286659e5b877D3', '0xD49a0e9A4CD5979aE36840f542D2d7f02C4817Be')))

  // const depositData = `0x${ethers.utils.hexZeroPad(1, 32).substr(2) + ethers.utils.hexZeroPad(signer._address.length, 32).substr(2) + signer._address.substr(2)}`

  // const signerGen = provider.getSigner('0x276C216D241856199A83bf27b2286659e5b877D3')
  // const wethContract2 = new ethers.Contract(wehtAddress, erc_abi, signerGen)

  // console.log("signer 2", signerGen)

  // try {
  //   const approve = await wethContract.approve('0xD49a0e9A4CD5979aE36840f542D2d7f02C4817Be', ethers.utils.parseEther('1'))
  //   const approveTx = await approve.wait(1)
  //   console.log("approval status", approveTx.status)
  // } catch(e){
  //   console.log("Error on approval", e)
  // }

  let fee
  try {
    const calculatedFee = await basicFeeInstance.calculateFee(
      signer._address,
      1,
      2,
      resourceId,
      depositData,
      '0x00'
    )
    console.log("Calculated FEE", ethers.utils.formatUnits(calculatedFee[0], 32))
    fee = calculatedFee[0]
  } catch (e) {
    console.log("Error on CALCULATED FEE", e)
  }

  try {
    const deposit = await bridgeInstance.deposit(
      2,
      resourceId,
      genericData,
      '0x00',
      {
        value: fee,
        gasLimit: ethers.utils.hexlify(100000)
      }
    )
    const depositTx = await deposit.wait(1)
    console.log("deposit status", depositTx.status)
  } catch(e){
    console.log("Error on deposit", e)
  }

  console.log("Balance weth", ethers.utils.formatEther(await wethContract.balanceOf(signer._address)))
  console.log("balance DAI", ethers.utils.formatEther(await daiContract.balanceOf(signer._address)))

})()
