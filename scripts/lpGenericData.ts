import { createGenericDepositData, createResourceID } from "./uitls"
import { abi as LPABI, bytecode as LPBytecode } from '../artifacts/contracts/LP.sol/LP.json'
import { BigNumber } from "ethers"
import { IERC20__factory, IWETH9__factory } from "../typechain-types"
import { network } from "hardhat";
const logger = require("pino")();

const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const WHALE = "0x2FAF487A4414Fe77e2327F0bf4AE2a264a776AD2"; //FTX Whale
const GAS_LIMIT = 2074040;

const genericHandler = '0xD9B7Ff67E892fD56BE45a43B80b529A289C32ca8';

(async () => {

  // await network.provider.request({
  //   method: "hardhat_impersonateAccount",
  //   params: [WHALE],
  // })

  const provider = new ethers.providers.JsonRpcProvider('http://localhost:8551')
  const alice = '0xff93B45308FD417dF303D6515aB04D9e89a750Ca'
  const charlie = '0x24962717f8fA5BA3b931bACaF9ac03924EB475a0'
  const aliceSigner = provider.getSigner(alice)
  const charlieSigner = provider.getSigner(charlie)
  const whaleSigner = provider.getSigner(WHALE)
  const lpAddress = '0x153e09BFB739D2a435907622f8ef30BD8194d53a'
  const lpResourceId = createResourceID(
    '0x153e09BFB739D2a435907622f8ef30BD8194d53a',
    1
  )
  const genericHandlerAddress = '0x2Db7D21Fb4d93E7507ADF31625197dF2ad608A1D'
  console.log("🚀 ~ file: lpGenericData.ts ~ line 9 ~ lpResourceId", lpResourceId)

  const ILPContract = new ethers.utils.Interface(LPABI)
  const mintPosition2 = ILPContract.getSighash('mintPosition2')
  console.log("🚀 ~ file: lpGenericData.ts ~ line 13 ~ mintPosition2", mintPosition2)

  // return

  const daiAmount = BigNumber.from(1000n * 10n ** 18n);
  console.log("🚀 ~ file: lpGenericData.ts ~ line 44 ~ daiAmount", daiAmount)
  const usdcAmount = ethers.utils.parseUnits("1000.0", 6);
  console.log("🚀 ~ file: lpGenericData.ts ~ line 46 ~ usdcAmount", usdcAmount)

  // return 

  let dai = new ethers.Contract(DAI, IERC20__factory.abi)
  let usdc = new ethers.Contract(USDC, IERC20__factory.abi)
  let weth = new ethers.Contract(WETH, IWETH9__factory.abi)
  const poolFee = BigNumber.from("100");

  await (weth.connect(aliceSigner) as any).deposit({ value: BigNumber.from(1000n * 10n ** 18n).mul(2), gasLimit: GAS_LIMIT })

  const charlieBalanceBefore = await charlieSigner.getBalance()
  logger.info(`owner balance before: ${charlieBalanceBefore}`);

  await charlieSigner.sendTransaction({
    to: whaleSigner._address,
    value: charlieBalanceBefore.div(2),
    gasLimit: GAS_LIMIT,
  });

  try {
    const transferToAlice = await dai.connect(whaleSigner).transfer(charlieSigner._address, daiAmount)
    await transferToAlice.wait()
  } catch (e) {
    console.log("Error DAI CONNECTED =>", e);
  }

  try {
    const transferToAliceUSDC = await usdc.connect(whaleSigner).transfer(charlieSigner._address, usdcAmount);
    await transferToAliceUSDC.wait()
  } catch (e) {
    console.log("Error USDC CONNECTED =>", e)
  }

  console.log("")
  console.log("DAI BALANCE CHARLIE AFTER ==>", await dai.connect(charlieSigner).balanceOf(charlieSigner._address))
  console.log("USDC BALANCE OF CHARLIE AFTER ==>", await usdc.connect(charlieSigner).balanceOf(charlieSigner._address))

  try {
    const transferDaiToGeneric = await dai.connect(charlieSigner).transfer(genericHandlerAddress, daiAmount)
    await transferDaiToGeneric.wait()
  } catch (e) {
    console.log("Error transferring to the generic handler contract", e)
  }

  try {
    const transferUSDCGeneric = await usdc.connect(charlieSigner).transfer(genericHandlerAddress, usdcAmount);
    await transferUSDCGeneric.wait()
  } catch (e) {
    console.log("Error transferring USDC to generic handler", e)
  }

  console.log("DAI BALANCE OF GENERIC HANDLER", await dai.connect(charlieSigner).balanceOf('0xD9B7Ff67E892fD56BE45a43B80b529A289C32ca8'))

  console.log("USDC BALANCE OF GENERIC HANDLER", await usdc.connect(charlieSigner).balanceOf('0xD9B7Ff67E892fD56BE45a43B80b529A289C32ca8'))

  const LPContract = new ethers.Contract(
    lpAddress,
    LPABI
  )

  // ADDING POSITIONS IF THOSE ARE NOT DEFINED
  // await (await LPContract.connect(charlieSigner).addPool(DAI, USDC, poolFee)).wait()
  // console.log("POSITIONS ON THE POOL", await LPContract.connect(charlieSigner).pools(0))
  // return 
  // 

  // try {
  //   await ( await LPContract.connect(charlieSigner).specialApprove(
  //     genericHandlerAddress,
  //     lpAddress,
  //     usdcAmount, {
  //       gasLimit: GAS_LIMIT
  //     }
  //   )).wait()
  // } catch(e){
  //   console.log("ERROR PERFORMING SPECIAL APPROVE ON LP CONTRACT FOR USDC", e)
  // }

  await (await dai.connect(charlieSigner).approve(genericHandler, daiAmount)).wait(1)
  await (await usdc.connect(charlieSigner).approve(genericHandler, usdcAmount)).wait(1)

  // APPROVING FROM THE GENERIC HANDLER TO THE LP CONTRACT
  await (await dai.connect(charlieSigner).approve(lpAddress, daiAmount)).wait(1)
  await (await usdc.connect(charlieSigner).approve(lpAddress, usdcAmount)).wait(1)

  console.log("ALLOWANCE CHARLIE => GENERIC", await dai.connect(charlieSigner).allowance(charlieSigner._address, genericHandlerAddress))

  console.log("ALLOWANCE LP CONTRACT =>", await dai.connect(charlieSigner).allowance(charlieSigner._address, lpAddress))

  console.log("ALLOWANCE GENERIC => LP CONTRACT ==> DAI", await dai.connect(charlieSigner).allowance(genericHandlerAddress, lpAddress))

  console.log("ALLOWANCE GENERIC ==> LP CONTRACT ==> USDC", await usdc.connect(charlieSigner).allowance(
    genericHandlerAddress, lpAddress
  ))

  // console.log("ALLOWANCE LP CONTRACT =>", await dai.connect(charlieSigner).allowance(lpAddress, genericHandlerAddress))

  // try {
  //   await (await LPContract.connect(charlieSigner).specialApprove(
  //     genericHandlerAddress,
  //     lpAddress,
  //     daiAmount,
  //     {
  //       gasLimit: GAS_LIMIT
  //     }
  //   )).wait()
  // } catch (e) {
  //   console.log("ERROR PERFORMING SPECIAL APPROVE ON LP CONTRACT FOR DAI", e)
  // }

  const encodedAddPool = ethers.utils.defaultAbiCoder.encode(
    ['uint256', 'uint256'],
    [daiAmount, usdcAmount]
  )

  const genericDepositData = createGenericDepositData(encodedAddPool)
  console.log("🚀 ~ file: LP2.ts ~ line 171 ~ genericDepositData", genericDepositData)
})()