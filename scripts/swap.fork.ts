(async () => {
  const { ethers } = require('ethers')
  const SwapHandler = require('../artifacts/contracts/SwapHandler.sol/SwapHandler.json')
  const SwapExample2 = require('../artifacts/contracts/SwapExample2.sol/SwapExample2.json')

  const address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
  // const address = '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65'
  const provider = new ethers.providers.JsonRpcProvider('http://localhost:8550')
  const signer = provider.getSigner(address)

  const erc_abi = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "guy", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "src", "type": "address" }, { "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "wad", "type": "uint256" }], "name": "withdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "deposit", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": true, "name": "guy", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": true, "name": "dst", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "dst", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Deposit", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Withdrawal", "type": "event" }]

  const wehtAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
  const wethContract = new ethers.Contract(wehtAddress, erc_abi, signer)
  const daiAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
  const daiContract = new ethers.Contract(daiAddress, erc_abi, signer)

  // const SwapFractory = new ethers.ContractFactory(
  //   SwapExampleJSON.abi,
  //   SwapExampleJSON.bytecode,
  //   signer
  // )


  // // // const swapper = await SwapFractory.deploy(swapRouterAddress)

  // ===============> DEPLOY HERE

  // const swapRouterAddress = '0xE592427A0AEce92De3Edee1F18E0157C05861564'
  // const Swap2Factory = new ethers.ContractFactory(
  //   SwapExample2.abi,
  //   SwapExample2.bytecode,
  //   signer
  // )

  // const swapper2 = await Swap2Factory.deploy()

  // const swapper2Address = swapper2.address

  // const setSwapRouter = await swapper2.setSwapRouter(swapRouterAddress)
  // const setSwapRouterTx = await setSwapRouter.wait(1)

  // console.log("Set swap router status", setSwapRouterTx.status)

  // console.log("Swapper 2 address", swapper2Address)

  // const SwapHandlerFactory = new ethers.ContractFactory(
  //   SwapHandler.abi,
  //   SwapHandler.bytecode,
  //   signer
  // )

  // const swapHandler = await SwapHandlerFactory.deploy()
  // console.log("SWAPPER HANDLER ADDRESS", swapHandler.address)

  // ====================> END DEPLOY HERE

  // const swapperAddress = '0xf4e55515952BdAb2aeB4010f777E802D61eB384f'

  // const sw = new ethers.Contract(
  //   swapperAddress,
  //   SwapExampleJSON.abi
  //   )

  //   const swapper = sw.connect(signer)

  //   console.log("Swapper address", swapper.address)

  // ==================> INTERACTION HERE
  const swapper2Address = '0x4B901e2Db7C412D966689E8D3CF479294C456f1e'

  const swapper2Contract = new ethers.Contract(
    swapper2Address,
    SwapExample2.abi
  )

  const swapper = swapper2Contract.connect(signer)

  const swapHandlerAddress = '0xdcaa80371BDF9ff638851713f145Df074428Db19'

  const swapHandlerContract = new ethers.Contract(
    swapHandlerAddress,
    SwapHandler.abi
  )

  const swapHandler = swapHandlerContract.connect(signer);
  const overrides = {
    value: ethers.utils.parseEther('10'),
    gasLimit: ethers.utils.hexlify(50000),
  }

  await (await wethContract.deposit(overrides)).wait(1)

  console.log("SIGNER BALANCE", await (await signer.getBalance()).toString())


  const balanceSigner = await wethContract.balanceOf(signer._address)
  const balanceSwapHandler = await wethContract.balanceOf(swapHandlerAddress)
  const balanceSwapper2 = await wethContract.balanceOf(swapper2Address)

  console.log("balanaces ===>>>", balanceSigner.toString(), balanceSwapHandler.toString(), balanceSwapper2.toString())

  // SIGNER IS DEPLOYER OF WETH SO HE HAS MONEY
  await (await wethContract.transfer(swapHandlerAddress, ethers.utils.parseEther('5'), { gasLimit: ethers.utils.hexlify(500000) })).wait(1)
  await (await wethContract.transfer(swapper2Address, ethers.utils.parseEther('5'), { gasLimit: ethers.utils.hexlify(500000) })).wait(1)

  const approveFilter = wethContract.filters.Approval()

  wethContract.on(approveFilter, (sender, delegator, tokens) => console.log(`Sender ${sender} -> delegator ${delegator} -> tokens ${tokens.toString()}`))

  await (await wethContract.approve(swapHandlerAddress, ethers.utils.parseEther('3'))).wait(1)

  const all1 = await wethContract.allowance(signer._address, swapHandlerAddress)
  console.log("all1 =>", all1.toString())


  const allHandler = await wethContract.allowance(swapHandlerAddress, swapper2Address)
  console.log("allowance handler =>", ethers.utils.formatEther(allHandler))

  const allSwapper = await wethContract.allowance(swapper2Address, swapHandlerAddress)
  console.log("allowance swapper =>", ethers.utils.formatEther(allSwapper))

  const allIDK = await wethContract.allowance(signer._address, swapHandlerAddress)
  console.log("allowance IDK =>", ethers.utils.formatEther(allIDK))

  const aa0 = await wethContract.approve(swapHandlerAddress, ethers.utils.parseEther('3'))
  const aa0Tx = await aa0.wait(1)

  const aa1 = await swapHandler.approveHandler(swapper2Address, wehtAddress, ethers.utils.parseEther('3'), { gasLimit: ethers.utils.hexlify(500000) })
  const aa1Tx = await aa1.wait(1)

  console.log(aa1Tx.status)

  const swapFilter = swapper.filters.SwapExactInputSingleEvent()

  swapper.on(swapFilter, (message, amountIn, amountOut) => console.log(message, ethers.utils.formatEther(amountIn), ethers.utils.formatEther(amountOut)))


  // const a1 = await swapHandler.approve2(swapper2Address, daiAddress)
  // const a1Tx = await a1.wait(1)

  // console.log(a1Tx.status)

  // await (await daiContract.transfer(swapHandlerAddress, 500))

  // const balanceInDai = await daiContract.balanceOf(swapHandlerAddress)
  // console.log("bal =>", balanceInDai.toString())


  // const daiAll = await daiContract.allowance(swapHandlerAddress, swapper2Address)
  // console.log("dai allowance", daiAll.toString())

  try {
    const swapExec = await swapHandler.executeSwap(swapper2Address, ethers.utils.parseEther('1'), signer._address, { gasLimit: ethers.utils.hexlify(30000000) })
    const swapExecTx = await swapExec.wait(1)

    console.log("swap exec tx", swapExecTx.status)
  } catch (e) {
    console.log("Error on swap exec", e)
  }

  // try {
  //   const swapExec = await swapHandler.executeSwap2(swapper2Address, ethers.utils.parseEther('1'), { gasLimit: ethers.utils.hexlify(30000000) })
  //   const swapExecTx = await swapExec.wait(1)

  //   console.log("swap exec tx", swapExecTx.status)
  // } catch(e){
  //   console.log("Error on swap exec", e)
  // }

  console.log("Balance weth", ethers.utils.formatEther(await wethContract.balanceOf(signer._address)))
  console.log("balance DAI", ethers.utils.formatEther(await daiContract.balanceOf(signer._address)))
  // ===============> END INTERACTION HERE

})()
