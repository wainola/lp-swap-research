import { Bridge__factory, GenericHandler__factory, FeeHandlerRouter__factory, BasicFeeHandler__factory } from '@chainsafe/chainbridge-contracts'
import { abi as LPABI, bytecode as LPByteCode } from './../artifacts/contracts/LP.sol/LP.json'
import { ethers } from 'ethers'
import { createResourceID } from './uitls';

const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const WHALE = "0x2FAF487A4414Fe77e2327F0bf4AE2a264a776AD2"; //FTX Whale
const GAS_LIMIT = 2074040;
const nonFungiblePositionMaadminSetResourceHandlernagerAddress =
  "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

const alice = '0xff93B45308FD417dF303D6515aB04D9e89a750Ca';
const charlie = '0x24962717f8fA5BA3b931bACaF9ac03924EB475a0';

(async () => {
  const provider = new ethers.providers.JsonRpcProvider('http://localhost:8552')
  const charlieSigner = provider.getSigner(charlie)

  const bridgeFactory = new ethers.ContractFactory(
    Bridge__factory.abi,
    Bridge__factory.bytecode,
    charlieSigner
  )

  const genericHandlerFactory = new ethers.ContractFactory(
    GenericHandler__factory.abi,
    GenericHandler__factory.bytecode,
    charlieSigner
  )

  const feeRouterFactory = new ethers.ContractFactory(
    FeeHandlerRouter__factory.abi,
    FeeHandlerRouter__factory.bytecode,
    charlieSigner
  )

  const basicFeeHandlerFactory = new ethers.ContractFactory(
    BasicFeeHandler__factory.abi,
    BasicFeeHandler__factory.bytecode,
    charlieSigner
  )

  const bridgeInstance = await bridgeFactory.deploy(2)
  const bridgeAddress = bridgeInstance.address
  const genericInstance = await genericHandlerFactory.deploy(bridgeAddress)
  const genericAddress = genericInstance.address
  const feeRouterInstance = await feeRouterFactory.deploy(bridgeAddress)
  const feeRouterAddress = feeRouterInstance.address
  const basicFeeInstance = await basicFeeHandlerFactory.deploy(bridgeAddress, feeRouterAddress)
  const basicFeeAddress = basicFeeInstance.address
  console.log("🚀 ~ file: deployNode2.ts ~ line 46 ~ bridgeAddress", bridgeAddress)
  console.log("🚀 ~ file: deployNode2.ts ~ line 52 ~ feeRouterAddress", feeRouterAddress)
  console.log("🚀 ~ file: deployNode2.ts ~ line 49 ~ genericAddress", genericAddress)
  console.log("🚀 ~ file: deployNode2.ts ~ line 55 ~ basicFeeAddress", basicFeeAddress)


  // SETTING UP THE FEE ROUTER ON THE BRIDGE
  try {
    await (
      await bridgeInstance.adminChangeFeeHandler(feeRouterAddress)
    ).wait()
    console.log("adminChangeFeeHandler setup!")
  } catch (e) {
    console.log("Error adminChangeFeeHandler", e)
  }

  // SET RESOURCE ON FEE ROUTER
  try {
    await (
      await feeRouterInstance.adminSetResourceHandler(
        2, '0x0000000000000000000000000000000000000000000000000000000000000100',
        genericInstance.address
      )
    ).wait()
    console.log("adminSetResourceHandler setup!")
  } catch (e) {
    console.log("Error adminSetResourceHandler", e)
  }

  // SETTING UP GENERIC RESOURCE ON GENERIC HANDLER

  const LPFactory = new ethers.ContractFactory(
    LPABI,
    LPByteCode,
    charlieSigner
  )

  const LPInstance = await LPFactory.deploy()
  const LPAddress = LPInstance.address
  console.log("🚀 ~ file: deployNode2.ts ~ line 89 ~ LPAddress", LPAddress)
  const ILPContract = new ethers.utils.Interface(LPABI)
  const mintPosition2Signature = ILPContract.getSighash('mintPosition2')
  // @ts-ignore
  const mintPosition2ResourceId = ethers.utils.hexZeroPad(13, 32)
  const LPContractResourceId = createResourceID(
    LPAddress,
    2
  )
  console.log("🚀 ~ file: deployNode2.ts ~ line 98 ~ mintPosition2ResourceId", mintPosition2ResourceId)
  console.log("🚀 ~ file: deployNode2.ts ~ line 95 ~ mintPosition2Signature", mintPosition2Signature)
  console.log("🚀 ~ file: deployNode2.ts ~ line 103 ~ LPContractResourceId", LPContractResourceId)

  // HERE WE SETUP THE GENERIC RESOURCE TO USE
  try {
    await (
      await bridgeInstance.adminSetGenericResource(
        genericAddress,
        LPContractResourceId,
        LPAddress,
        mintPosition2Signature,
        0,
        '0x00000000'
      )
    ).wait()

    console.log("adminSetGenericResource setup!")
  } catch(e){
    console.log("Error on adminSetGenericResource", e)
  }

  const contractAddressFromResourceId = await genericInstance._contractAddressToResourceID(LPAddress)
  console.log("🚀 ~ file: deployNode2.ts ~ line 124 ~ contractAddressFromResourceId", contractAddressFromResourceId)

})()