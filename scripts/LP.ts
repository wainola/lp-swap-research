import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, BytesLike } from "ethers";
import { ethers, network } from "hardhat";
import { IERC165__factory, IERC20, IERC20__factory, IWETH9__factory, LP } from "../typechain-types";
import { Bridge__factory, GenericHandler__factory, BasicFeeHandler__factory } from '@chainsafe/chainbridge-contracts'
import { createGenericDepositData, createResourceID } from './uitls'
import { abi as LPABI, bytecode as LPBytecode } from '../artifacts/contracts/LP.sol/LP.json'
import LPContractJSON from './deploy.json'
const logger = require("pino")();

const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const WHALE = "0x2FAF487A4414Fe77e2327F0bf4AE2a264a776AD2"; //FTX Whale
const GAS_LIMIT = 2074040;
const nonFungiblePositionManagerAddress =
  "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

const bridgeAddress = '0x77b491446DCC8ec91f1158D85af0a78146AbDA26';
const genericHandler = '0x2Db7D21Fb4d93E7507ADF31625197dF2ad608A1D';
const basicFeeAddress = '0xb399ABad6c0e1BDBF265B4A9Bf822b0a92A60866';
const feeRouter = '0xB36a0Cb9fa49DCC142A3B78b84F77dBEDbc13D33'
const lpContractAddress = '0x153e09BFB739D2a435907622f8ef30BD8194d53a'
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

  const basicFeeContract = new ethers.Contract(
    basicFeeAddress,
    BasicFeeHandler__factory.abi
  )

  const bridgeInstace = bridgeContract.connect(charlieSigner)
  const genericInstance = genericContract.connect(charlieSigner)
  const basicFeeInstance = basicFeeContract.connect(charlieSigner)

  const blankSignature = '0x00000000'

  const ILPContract = new ethers.utils.Interface(LPABI)
  const addPoolSig = ILPContract.getSighash('addPool')
  const mintPositionSig = ILPContract.getSighash('mintPosition2')

  //@ts-ignore
  const addPoolSigResourceId = ethers.utils.hexZeroPad(12, 32)
  //@ts-ignore
  const mintPositionResourceId = ethers.utils.hexZeroPad(13, 32)
  //@ts-ignore
  const LPcontractResourceId = createResourceID(
    lpContractAddress,
    1
  )

  console.log("")
  console.log("ADD POOL SIG HASH", addPoolSig)
  console.log("MINT POSITION SIG HASH", mintPositionSig)
  console.log("")

  console.log("RESOURCE ID ADD POOL", addPoolSigResourceId)
  console.log('MINT POSITION', mintPositionResourceId)
  console.log("LP CONTRACT RESOURCE ID", LPcontractResourceId)


  const mintPositionFunctionFromLPAddress = await genericInstance._contractAddressToDepositFunctionSignature(LPContractJSON.LPAddress)

  console.log("Add Pool from contract address", mintPositionFunctionFromLPAddress)

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

  // NOTE: ADDING THE POOL TO THE STRUCT
  // const tx = await LPContract.addPool(dai.address, usdc.address, poolFee);
  // await tx.wait();

  const LPContract = new ethers.Contract(
    lpContractAddress,
    LPABI
  )

  console.log("")
  console.log("DAI BALANCE ALICE", await dai.connect(aliceSigner).balanceOf(aliceSigner._address))
  console.log("")

  // BALANCES OF WHALE IN DAI AND USDC
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
  } catch (e) {
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

  await (await dai.connect(aliceSigner).approve(lpContractAddress, daiAmount)).wait(1)
  await (await usdc.connect(aliceSigner).approve(lpContractAddress, usdcAmount)).wait(1)

  console.log("APPROVED!!!")
  const txLP = await LPContract.connect(aliceSigner).mintPosition2(daiAmount, usdcAmount)
  await txLP.wait(1)

  // /**
  //  * --------------------------------------------------
  //  * --------------------------------------------------
  //  * BRIDGE STUFF
  //  * --------------------------------------------------
  //  * --------------------------------------------------
  //  */

  // APPROVING TO GENERIC HANDLER
  await(
    await dai.connect(charlieSigner).approve(genericInstance.address, daiAmount)
  ).wait(1)

  await (
    await usdc.connect(charlieSigner).approve(genericInstance.address, usdcAmount)
  ).wait(1)

  console.log("ALLOWANCE FROM CHARLIE TO GENERIC ON DAI ===>", await dai.connect(charlieSigner).allowance(charlieSigner._address, genericInstance.address))

  console.log("ALLOWANCE FROM CHARLIE TO GENERIC ON USDC ===>", await usdc.connect(charlieSigner).allowance(charlieSigner._address, genericInstance.address))

  // CALLING APROVE ON THE SAME AMOUNTS BUT HERE ON THE GENERIC HANDLER CONTRACT
  // HERE WE APPROVE THE LP TO SPENT THE TOKENS FROM THE GENERIC
  try {
    await ( await genericInstance.approveToLP(
      lpContractAddress,
      daiAmount,
      usdcAmount
    )).wait()
  } catch (e) {
    console.log("Error on approving from generic to LP", e)
  }

  // CHECKING NOW THE ALLOWANCE FROM GENERIC TO LP CONTRACT
  console.log("ALLOWANCE FROM GENERIC TO LP CONTRACT IN DAI ===>", await dai.connect(charlieSigner).allowance(genericInstance.address, lpContractAddress))
  console.log("ALLOWANCE FROM GENERIC TO LP CONTRACT IN USDC ===>", await usdc.connect(charlieSigner).allowance(genericInstance.address, lpContractAddress))

  // HERE WE DEFINE THE ENCODED DATA TO SEND TO THE DEPOSIT

  // @ts-ignore
  const depositData = `0x${ethers.utils.hexZeroPad(100, 32).substr(2) + ethers.utils.hexZeroPad(aliceSigner._address.length, 32).substr(2) + aliceSigner._address.substr(2)}`
  let fee

  try {
    const calculatedFee = await basicFeeInstance.calculateFee(
      aliceSigner._address,
      1,
      2,
      LPcontractResourceId,
      depositData,
      '0x00'
    )

    console.log("CALCULATED FEE", calculatedFee[0])
    fee = calculatedFee[0]
  } catch (e) {
    console.log("Error on calculating fee", e)
  }

  // ENCODING DATA

  const encodedMintPosition2Data = ethers.utils.defaultAbiCoder.encode(
    ['uint256', 'uint256'],
    [daiAmount, usdcAmount]
  )

  // const encodedAddPool = ethers.utils.defaultAbiCoder.encode(
  //   ['address', 'address', 'uint24'],
  //   [dai.address, usdc.address, poolFee]
  // )

  // const genericDepositData = createGenericDepositData(encodedAddPool)

  const genericDepositData = createGenericDepositData(encodedMintPosition2Data)

  try {
    const deposit = await bridgeInstace.deposit(
      2,
      LPcontractResourceId,
      genericDepositData,
      '0x00',
      {
        value: fee,
        gasLimit: GAS_LIMIT
      }
    )

    await deposit.wait(1)
  } catch (e) {
    console.log("Error on deposit with generic data", e)
  }

})()