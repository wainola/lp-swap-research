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

  // const swapperAddress = '0xDBD6c48913473F648f64d8E9fdDeead1F1734E22'

  // const sw = new ethers.Contract(
  //   swapperAddress,
  //   SwapExampleJSON.abi
  // )

  // const swapper = sw.connect(signer)

  // console.log("Swapper address", swapper.address)

  const swapper2Address = '0x87c470437282174b3f8368c7CF1Ac03bcAe57954'

  const swapper2Contract = new ethers.Contract(
    swapper2Address,
    SwapExample2.abi
  )

  const swapper = swapper2Contract.connect(signer)

  const swapHandlerAddress = '0x96E303b6D807c0824E83f954784e2d6f3614f167'

  const swapHandlerContract = new ethers.Contract(
    swapHandlerAddress,
    SwapHandler.abi
  )

  const swapHandler = swapHandlerContract.connect(signer);

  const balanceSigner = await wethContract.balanceOf(signer._address)
  const balanceSwapHandler = await wethContract.balanceOf(swapHandlerAddress)
  const balanceSwapper2 = await wethContract.balanceOf(swapper2Address)

  console.log("balanaces ===>>>", balanceSigner.toString(), balanceSwapHandler.toString(), balanceSwapper2.toString())

  // SIGNER IS DEPLOYER OF WETH SO HE HAS MONEY
  await (await wethContract.transfer(swapHandlerAddress, 500)).wait(1)
  await (await wethContract.transfer(swapper2Address, 500)).wait(1)

  const approveFilter = wethContract.filters.Approval()

  wethContract.on(approveFilter, (sender, delegator, tokens) => console.log(`Sender ${sender} -> delegator ${delegator} -> tokens ${tokens.toString()}`))

  // await (await wethContract.approve(swapHandlerAddress, 20)).wait(1)

  const all1 = await wethContract.allowance(signer._address, swapHandlerAddress)
  console.log("all1 =>", all1.toString())

  // await (await swapHandler.approveHandler(swapper2Address, wehtAddress), { gasLimit: ethers.utils.hexlify(50000) })

  const allHandler = await wethContract.allowance(swapHandlerAddress, swapper2Address)
  console.log("allowance handler =>", allHandler.toString())

  const allSwapper = await wethContract.allowance(swapper2Address, swapHandlerAddress)
  console.log("allowance swapper =>", allSwapper.toString())

  const allIDK = await wethContract.allowance(signer._address, swapHandlerAddress)
  console.log("allowance IDK =>", allIDK.toString())

  const aa0 = await wethContract.approve(swapHandlerAddress, 20)
  const aa0Tx = await aa0.wait(1)

  const aa1 = await swapHandler.approveHandler(swapper2Address, wehtAddress, 12, { gasLimit: ethers.utils.hexlify(150000) })
  const aa1Tx = await aa1.wait(1)

  console.log(aa1Tx.status)


  const a1 = await swapHandler.approve2(swapper2Address, daiAddress)
  const a1Tx = await a1.wait(1)

  console.log(a1Tx.status)

  await (await daiContract.transfer(swapHandlerAddress, 500))

  const balanceInDai = await daiContract.balanceOf(swapHandlerAddress)
  console.log("bal =>", balanceInDai.toString())

  const swapFilter = swapper.filters.SwapExactInputSingleEvent()

  swapper.on(swapFilter, (message, amountIn, amountOut) => console.log(message, amountIn.toString(), amountOut.toString()))

  const daiAll = await daiContract.allowance(swapHandlerAddress, swapper2Address)
  console.log("dai allowance", daiAll.toString())

  try {
    const swapExec = await swapHandler.executeSwap(swapper2Address, 9, signer._address, { gasLimit: ethers.utils.hexlify(250000) })
    const swapExecTx = await swapExec.wait(1)

    console.log("swap exec tx", swapExecTx.status)
  } catch (e) {
    console.log("Error on swap exec", e)
  }

  // const swapExact = await swapHandler.executeSwap(
  //   swapper2Address,
  //   ethers.utils.parseEther('3')
  // )
  // const swapTx = await swapExact.wait(1)

  // console.log("Tx Swap", swapTx.status)

  // const all2 = await wethContract.allowance(signer._address, swapHandlerAddress)
  // console.log("all2 =>", all2.toString())

  // const balance = await wethContract.balanceOf(signer._address)

  // console.log("Balance ether", ethers.utils.formatEther(await signer.getBalance()))
  // console.log("Weth balance", ethers.utils.formatEther(balance))

  // const overrides = {
  //   value: ethers.utils.parseEther('2'),
  //   gasLimit: ethers.utils.hexlify(50000),
  // }

  // const depositWeth = await wethContract.deposit(overrides)
  // const depositTx = await depositWeth.wait(1)

  // console.log("Balance ETH", ethers.utils.formatEther(await signer.getBalance()))
  // console.log("Balance Weth", ethers.utils.formatEther(await wethContract.balanceOf(signer._address)))

  // HERE: APPROVE SWAPPER TO SPEND 1 ETHER
  // BUT MY ACCOUNT HAS WETH TO SPEND
  // const approve = await wethContract.approve(swapHandler.address, ethers.utils.parseEther('11'))
  // const approvalTx = await approve.wait(1)

  // const approve2 = await wethContract.approve(swapper2Address, ethers.utils.parseEther('11'))
  // const approvalTx2 = await approve2.wait(1)

  // console.log("approval status", approvalTx2.status)

  // signer => handler = handler has 11 tokens
  // handler => swapper = swapper has 11 tokens

  // const txTF = await wethContract.transferFrom(signer._address, '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', ethers.utils.parseEther('1'))
  // const waitTF = await txTF.wait(1)


  // const allowance = await wethContract.allowance(signer._address, swapHandler.address)
  // const allowance2 = await wethContract.allowance(signer._address, swapper2Address)
  // console.log("ALLOWANCE FROM SIGNER TO HANDLER", allowance.toString())
  // console.log("ALLOWANCE FROM SIGNER TO SWAPPWE", allowance2.toString())


  // const allowance2 = await wethContract.allowance(signer._address, swapper2Address)

  // console.log("allowance signer to swapper", allowance2.toString())

  // // 1 WETH FOR DAI
  // const swapExact = await swapper.swapExactInputSingle(ethers.utils.parseEther('1'))
  // const swapTx = await swapExact.wait(1)
  // const swapExact = await swapHandler.executeSwap(
  //   swapper2Address,
  //   ethers.utils.parseEther('1')
  // )
  // const swapTx = await swapExact.wait(1)

  // console.log("Tx Swap", swapTx.status)

  // console.log("Balance weth", ethers.utils.formatEther(await wethContract.balanceOf(signer._address)))
  // console.log("balance DAI", ethers.utils.formatEther(await daiContract.balanceOf(signer._address)))
})()
