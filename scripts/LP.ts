import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, BytesLike } from "ethers";
import { ethers, network } from "hardhat";
import { IERC165__factory, IERC20, IERC20__factory, IWETH9__factory, LP } from "../typechain-types";
import { Bridge__factory, GenericHandler__factory} from '@chainsafe/chainbridge-contracts'
import { abi as LPABI, bytecode as LPBytecode } from '../artifacts/contracts/LP.sol/LP.json'
const logger = require("pino")();

const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const WHALE = "0x2FAF487A4414Fe77e2327F0bf4AE2a264a776AD2"; //FTX Whale
const GAS_LIMIT = 2074040;
const nonFungiblePositionManagerAddress =
  "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

const bridgeAddress = '0xF75ABb9ABED5975d1430ddCF420bEF954C8F5235'
const genericHandler = '0x7ec51Af51bf6f6f4e3C2E87096381B2cf94f6d74'

// let dai: IERC20
// let weth: IERC20
// let usdc: IERC20
let whale
let owner: SignerWithAddress
let user
let wethAmount: BigNumber
let usdcAmount: BigNumber
let daiAmount: BigNumber
let LPD: LP
let poolFee: BigNumber

(async () => {
  const alice = '0xff93B45308FD417dF303D6515aB04D9e89a750Ca'
  const charlie = '0x24962717f8fA5BA3b931bACaF9ac03924EB475a0'

  // await network.provider.request({
    //   method: "hardhat_impersonateAccount",
  //   params: ["WHALE"],
  // })
  // const provider = ethers.getDefaultProvider('http://localhost:8551')
  const provider = new ethers.providers.JsonRpcProvider('http://localhost:8551')
  
  try {
    await provider.send("hardhat_impersonateAccount", [WHALE])
  } catch (e) {
    console.log(e)
  }
  
  const aliceSigner = provider.getSigner(alice)
  const charlieSigner = provider.getSigner(charlie)
  const whaleSigner = provider.getSigner(WHALE)
  const bridgeContract = new ethers.Contract(
    bridgeAddress,
    Bridge__factory.abi
  )

  const genericContract = new ethers.Contract(
    genericHandler,
    GenericHandler__factory.abi
  )

  const bridgeInstace = bridgeContract.connect(charlieSigner)
  const genericInstance = genericContract.connect(charlieSigner)

  const blankSignature = '0x00000000'

  const ILPContract = new ethers.utils.Interface(LPABI)
  const addPoolSig = ILPContract.getSighash('addPool')
  const mintPositionSig = ILPContract.getSighash('mintPosition')

  //@ts-ignore
  const addPoolSigResourceId = ethers.utils.hexZeroPad(12, 32)
  //@ts-ignore
  const mintPositionResourceId = ethers.utils.hexZeroPad(13, 32)
  //@ts-ignore
  const LPcontractResourceId = ethers.utils.hexZeroPad(9, 32)

  console.log("")
  console.log("ADD POOL SIG HASH", addPoolSig)
  console.log("MINT POSITION SIG HASH", mintPositionSig)
  console.log("")

  console.log("RESOURCE ID ADD POOL", addPoolSigResourceId)
  console.log('MINT POSITION', mintPositionResourceId)
  console.log("LP CONTRACT RESOURCE ID", LPcontractResourceId)

  const LPFactory = new ethers.ContractFactory(
    LPABI,
    LPBytecode,
    aliceSigner
  )

  const LPContract = await LPFactory.deploy()
  logger.info(`LP contract address: ${LPContract.address}`)

  //TODO: this is temporary since GENERIC HANDLER can only setup one signature per address
  // try {
  //   await (await bridgeInstace.adminSetGenericResource(
  //     genericHandler,
  //     LPcontractResourceId,
  //     LPContract.address,
  //     addPoolSig,
  //     0,
  //     blankSignature
  //   )).wait(1)
  // } catch(e) {
  //   console.log("Error set admin generic resource for addPool function", e)
  // }

  try {
    await (await bridgeInstace.adminSetGenericResource(
      genericHandler,
      LPcontractResourceId,
      LPContract.address,
      mintPositionSig,
      0,
      blankSignature
    )).wait(1)
  } catch(e){
    console.log("Error set admin generic resource for mintPosition function", e)
  }

  const mintPositionFunctionFromLPAddress = await genericInstance._contractAddressToDepositFunctionSignature(LPContract.address)

  console.log("Add Pool from contract address", mintPositionFunctionFromLPAddress)

  return

  let dai = new ethers.Contract(DAI, IERC20__factory.abi)
  let usdc = new ethers.Contract(USDC, IERC20__factory.abi)
  let weth = new ethers.Contract(WETH, IWETH9__factory.abi)
  poolFee = BigNumber.from("100");

  logger.info(`dai address: ${dai.address}`)
  logger.info(`usdc address: ${usdc.address}`)
  logger.info(`weth address: ${weth.address}`)

  // const daiConnected = await dai.connect(whaleSigner)

  // console.log("")
  // console.log("DAI BALANCE ALICE BEFORE", await dai.connect(aliceSigner).balanceOf(aliceSigner._address))

  //  try {
  //   const transferToAlice = await daiConnected.transfer(aliceSigner._address, BigNumber.from(1000n * 10n ** 18n))
  //   await transferToAlice.wait()
  // } catch (e) {
  //   console.log("Error =>", e);
  // }

  // console.log("")
  // console.log("DAI BALANCE ALICE AFTER ==>", await dai.connect(aliceSigner).balanceOf(aliceSigner._address))

  const tx = await LPContract.addPool(dai.address, usdc.address, poolFee);
  await tx.wait();

  console.log("")
  console.log("DAI BALANCE ALICE", await dai.connect(aliceSigner).balanceOf(aliceSigner._address))
  console.log("")


  const whaleDaiBalance = await dai.connect(whaleSigner).balanceOf(whaleSigner._address);
  console.log("🚀 ~ file: LP.ts ~ line 45 ~ whaleDaiBalance", whaleDaiBalance)
  const whaleUsdcBalance = await usdc.connect(whaleSigner).balanceOf(whaleSigner._address);
  console.log("🚀 ~ file: LP.ts ~ line 47 ~ whaleUsdcBalance", whaleUsdcBalance)

  const aliceBalanceBefore = await aliceSigner.getBalance()
  logger.info(`owner balance before: ${aliceBalanceBefore}`);

  daiAmount = BigNumber.from(1000n * 10n ** 18n);
  usdcAmount = ethers.utils.parseUnits("1000.0", 6);

  await (weth.connect(aliceSigner) as any).deposit({ value: BigNumber.from(1000n * 10n ** 18n).mul(2), gasLimit: GAS_LIMIT })

  await aliceSigner.sendTransaction({
    to: whaleSigner._address,
    value: aliceBalanceBefore.div(2),
    gasLimit: GAS_LIMIT,
  });

  const daiConnected = await dai.connect(whaleSigner)

  console.log("")
  console.log("DAI BALANCE ALICE BEFORE =>>", await daiConnected.balanceOf(aliceSigner._address))
  console.log("")

  try {
    const transferToAlice = await daiConnected.transfer(aliceSigner._address, daiAmount)
    await transferToAlice.wait()
  } catch (e) {
    console.log("Error DAI CONNECTED =>", e);
  }

  console.log("")
  console.log("DAI BALANCE ALICE AFTER ==>", await dai.connect(aliceSigner).balanceOf(aliceSigner._address))

  try {
    const transferToAliceUSDC = await usdc.connect(whaleSigner).transfer(aliceSigner._address, usdcAmount);
    await transferToAliceUSDC.wait()
  } catch(e){
    console.log("Error USDC CONNECTED =>", e)
  }
  
  await weth.connect(aliceSigner).transfer(whaleSigner._address, BigNumber.from(1000n * 10n ** 18n))
  
  const usdcOwnerBalance = await usdc.connect(whaleSigner).balanceOf(aliceSigner._address);
  const daiOwnerBalance = await dai.connect(whaleSigner).balanceOf(aliceSigner._address);
  const whaleBalanceWeth = await weth.connect(whaleSigner).balanceOf(aliceSigner._address)
  
  console.log("whaleBalance WETH", whaleBalanceWeth)
  logger.info(`dai owner balance before: ${daiOwnerBalance}`);
  logger.info(`usdc owner balance before: ${usdcOwnerBalance}`);

  wethAmount = ethers.utils.parseUnits("0.5", "ether")

  await weth.connect(whaleSigner).transfer(aliceSigner._address, wethAmount)

  await (await dai.connect(aliceSigner).approve(LPContract.address, daiAmount)).wait(1)
  await (await usdc.connect(aliceSigner).approve(LPContract.address, usdcAmount)).wait(1)

  console.log("APPROVED!!!")
  const txLP = await LPContract.connect(aliceSigner).mintPosition2(daiAmount, usdcAmount)
  await txLP.wait(1)

})()