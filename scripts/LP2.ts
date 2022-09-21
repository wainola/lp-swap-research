import { Bridge__factory, GenericHandler__factory, BasicFeeHandler__factory } from '@chainsafe/chainbridge-contracts'
import { ethers, network } from "hardhat";
import { IERC20__factory, IWETH9__factory } from "../typechain-types";
import { abi as LPABI, bytecode as LPBytecode } from '../artifacts/contracts/LP.sol/LP.json'
import { BigNumber } from 'ethers';
import fs from 'fs'
import { promisify } from 'util'
import { createGenericDepositData, createResourceID } from './uitls';
import LPdeployJSON from './deploy.json'
const logger = require("pino")();


const writeFile = promisify(fs.writeFile)

const bridgeAddress = '0x77b491446DCC8ec91f1158D85af0a78146AbDA26';
const genericHandler = '0xD9B7Ff67E892fD56BE45a43B80b529A289C32ca8';
const basicFeeAddress = '0xb399ABad6c0e1BDBF265B4A9Bf822b0a92A60866';

const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const GAS_LIMIT = 2074040;

(async () => {

  const alice = '0xff93B45308FD417dF303D6515aB04D9e89a750Ca'
  const charlie = '0x24962717f8fA5BA3b931bACaF9ac03924EB475a0'

  const provider = new ethers.providers.JsonRpcProvider('http://localhost:8551')

  const aliceSigner = provider.getSigner(alice)
  const charlieSigner = provider.getSigner(charlie)

  /**
   * =============================================
   * JUST FOR RE DEPLOYMENT PURPOSES
   * ============================================
   */
  const LPFactory = new ethers.ContractFactory(
    LPABI,
    LPBytecode,
    aliceSigner
  )

  const LPContract = await LPFactory.deploy()
  
  logger.info(`LP contract address: ${LPContract.address}`)

  const deploy = {
    LPAddress: LPContract.address
  }

  await writeFile(
    `${[process.cwd()]}/scripts/deploy.json`,
    JSON.stringify(deploy),
    "utf8"
  );
  /**
   * =============================================
   * END DEPLOYMENT
   * =============================================
   */
  return

  // const bridgeContract = new ethers.Contract(
  //   bridgeAddress,
  //   Bridge__factory.abi
  // )

  // const genericContract = new ethers.Contract(
  //   genericHandler,
  //   GenericHandler__factory.abi
  // )

  // const basicFeeContract = new ethers.Contract(
  //   basicFeeAddress,
  //   BasicFeeHandler__factory.abi
  // )

  // const bridgeInstace = bridgeContract.connect(charlieSigner)
  // const genericInstance = genericContract.connect(charlieSigner)
  // const basicFeeInstance = basicFeeContract.connect(charlieSigner)

  // const LPresourceId = createResourceID(
  //   '0xc279648CE5cAa25B9bA753dAb0Dfef44A069BaF4',
  //   1
  // )
  // console.log("🚀 ~ file: LP2.ts ~ line 87 ~ LPresourceId", LPresourceId)

  // const ILPContract = new ethers.utils.Interface(LPABI)
  // const addPoolSig = ILPContract.getSighash('addPool')
  // console.log("🚀 ~ file: LP2.ts ~ line 39 ~ addPoolSig", addPoolSig)

  // // const LPAddress = LPdeployJSON.LPAddress
  // // console.log("🚀 ~ file: LP2.ts ~ line 97 ~ LPAddress", LPAddress)

  // const LPContract = new ethers.Contract(
  //   '0xc279648CE5cAa25B9bA753dAb0Dfef44A069BaF4',
  //   LPABI
  // )

  // console.log("pool being setup", await LPContract.connect(charlieSigner).pools(0))

  // GENERIC HANDLER SETUP FOR FUNCTION
  // try {
  //   await (
  //     await bridgeInstace.adminSetGenericResource(
  //       genericInstance.address,
  //       LPresourceId,
  //       LPdeployJSON.LPAddress,
  //       addPoolSig,
  //       0,
  //       '0x00000000',
  //       {
  //         gasLimit: GAS_LIMIT
  //       }
  //     )
  //   ).wait(1)
  // } catch (e) {
  //   console.log("🚀 ~ file: LP2.ts ~ line 87 ~ ERROR", e)
  // }

  // const constractAddressToResourceId = await genericInstance._contractAddressToResourceID(LPContract.address)
  // console.log("🚀 ~ file: LP2.ts ~ line 111 ~ constractAddressToResourceId", constractAddressToResourceId)

  // const LPAddress = LPdeployJSON.LPAddress

  // const LPContract = new ethers.Contract(
  //   LPAddress,
  //   LPABI
  // )

  // // const mintPositionFunctionFromLPAddress = await genericInstance._contractAddressToDepositFunctionSignature(LPAddress)

  // // console.log("Add Pool from contract address", mintPositionFunctionFromLPAddress)

  // const contractAddressToResourceId = await genericInstance._contractAddressToResourceID(LPAddress)
  // console.log("🚀 ~ file: LP2.ts ~ line 53 ~ contractAddressToResourceId", contractAddressToResourceId)

  // const resourceIdToContractAddress = await genericInstance._resourceIDToContractAddress(contractAddressToResourceId)
  // console.log("🚀 ~ file: LP2.ts ~ line 102 ~ resourceIdToContractAddress", resourceIdToContractAddress, LPAddress)

  // try {
  //   await LPContract.connect(charlieSigner).poolFee()
  // } catch(e){
  //   console.log("error", e)
  // }
  // // console.log("DELETE POOL", await LPContract.connect(charlieSigner).deletePool(0))

  // let dai = new ethers.Contract(DAI, IERC20__factory.abi)
  // let usdc = new ethers.Contract(USDC, IERC20__factory.abi)
  // let weth = new ethers.Contract(WETH, IWETH9__factory.abi)
  // let poolFee = BigNumber.from("100");

  // // // const tx = await LPContract.connect(charlieSigner).addPool(dai.address, usdc.address, poolFee);
  // // // await tx.wait();

  // // // console.log("DELETE POOL", await LPContract.connect(charlieSigner).deletePool(0))
  // // // console.log('POOL ID', await LPContract.connect(charlieSigner).pools(0))


  // // @ts-ignore
  // const depositData = `0x${ethers.utils.hexZeroPad(100, 32).substr(2) + ethers.utils.hexZeroPad(aliceSigner._address.length, 32).substr(2) + aliceSigner._address.substr(2)}`
  // let fee

  // try {
  //   const calculatedFee = await basicFeeInstance.calculateFee(
  //     aliceSigner._address,
  //     1,
  //     2,
  //     constractAddressToResourceId,
  //     depositData,
  //     '0x00'
  //   )

  //   console.log("CALCULATED FEE", calculatedFee[0])
  //   fee = calculatedFee[0]
  // } catch (e) {
  //   console.log("Error on calculating fee", e)
  // }

  // const encodedAddPool = ethers.utils.defaultAbiCoder.encode(
  //   ['address', 'address', 'uint24'],
  //   [dai.address, usdc.address, poolFee]
  // )

  // const genericDepositData = createGenericDepositData(encodedAddPool)
  // console.log("🚀 ~ file: LP2.ts ~ line 171 ~ genericDepositData", genericDepositData)

  // try {
  //   const deposit = await bridgeInstace.deposit(
  //     2,
  //     constractAddressToResourceId,
  //     genericDepositData,
  //     '0x00',
  //     {
  //       value: fee,
  //       gasLimit: GAS_LIMIT
  //     }
  //   )

  //   await deposit.wait(1)
  // } catch (e) {
  //   console.log("Error on deposit with generic data", e)
  // }
})()