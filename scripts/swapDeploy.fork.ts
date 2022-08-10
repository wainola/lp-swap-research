(async () => {
  const { Bridge__factory, GenericHandler__factory, BasicFeeHandler__factory } = require("@chainsafe/chainbridge-contracts")
  const SwapExampleJSON = require('../artifacts/contracts/SwapExample.sol/SwapExample.json')
  const { ethers } = require('ethers')

  const address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
  const provider = new ethers.providers.JsonRpcProvider('http://localhost:8551')
  const signer = provider.getSigner(address)

  const swapperAddress = '0xD49a0e9A4CD5979aE36840f542D2d7f02C4817Be'

  // const bridgeFactory = new ethers.ContractFactory(Bridge__factory.abi, Bridge__factory.bytecode, signer)
  // const genericFactory = new ethers.ContractFactory(GenericHandler__factory.abi, GenericHandler__factory.bytecode, signer)
  // const basicFeeFactory = new ethers.ContractFactory(BasicFeeHandler__factory.abi, BasicFeeHandler__factory.bytecode, signer)

  // const bridgeContract = await bridgeFactory.deploy(1)
  // const bridgeAddress = bridgeContract.address
  // const genericHandlerContract = await genericFactory.deploy(bridgeAddress)
  // const genericHandlerAddress = genericHandlerContract.address
  // const basicFeeContract = await basicFeeFactory.deploy(bridgeAddress)
  // const basicFeeAddress = basicFeeContract.address

  const swappperResourceID = ethers.utils.hexZeroPad(1,32)

  const ISwapper = new ethers.utils.Interface(SwapExampleJSON.abi)
  const sigHash = ISwapper.getSighash('swapExactInputSingle')

  const bridgeFactory = new ethers.Contract(
    '0xfaAddC93baf78e89DCf37bA67943E1bE8F37Bb8c',
    Bridge__factory.abi,
  )

  const genericHandlerAddress = '0x276C216D241856199A83bf27b2286659e5b877D3'

  const bridgeContract = bridgeFactory.connect(signer)

  try {
    const responseGenericHandler = await bridgeContract.adminSetGenericResource(
      genericHandlerAddress,
      swappperResourceID,
      swapperAddress,
      sigHash,
      0,
      '0x00000000'
    )

    const resourceTx = await responseGenericHandler.wait(1)
    console.log('adminSetGenericResource status', resourceTx.status)
  } catch (e) {
    console.log("error setting generic resource id", e)
  }

  // try {
  //   const unpause = await bridgeContract.endKeygen('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
  //   const txUnpause = await unpause.wait(1)
  //   console.log("Unpause TX", txUnpause.status)
  // } catch (e) {
  //   console.log("Error unpausing bridge", e)
  // }

  // console.log("BRIDGE ADDRESS FORKING", bridgeAddress)
  // console.log("GENERIC HANDLER ADDRESS FORKING", genericHandlerAddress)
  // console.log("BASIC FEE ADDRESS FORKING", basicFeeAddress)
})()
