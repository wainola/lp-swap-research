import { BigNumber, ethers } from 'ethers'
import { IERC20__factory, IWETH9__factory, LP } from '../typechain-types'
import { Bridge__factory, GenericHandler__factory, BasicFeeHandler__factory } from '@chainsafe/chainbridge-contracts'
import { abi as LPABI, bytecode as LPBytecode } from '../artifacts/contracts/LP.sol/LP.json'

const logger = require("pino")();

const bridgeAddress = '0xB0DB31Ba3B01D7FD2b020899B75cBa65e79BD81b';
const feeRouterAddress = '0x99a1a88abFb8ddA3543f4D0469d198810a5e74cD';
const genericAddress = '0x0F88A9d14d956A68AA772793B7249A2084F4A61B';
const basicFeeAddress = '0x7f55b7ebe0401Ef6C3dc1D8595cCC1a4E60e5aAf';
const LPAddress = '0x733Cf8D7F598449191F03F6d8bebc2516277D8AE';
const LPResourceId = '0x0000000000000000000000733cf8d7f598449191f03f6d8bebc2516277d8ae02';
const mintPosition2Signature = '0x29335192';

const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const WHALE = "0x2FAF487A4414Fe77e2327F0bf4AE2a264a776AD2"; //FTX Whale
const GAS_LIMIT = 2074040;
const nonFungiblePositionManagerAddress =
  "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";
const charlie = '0x24962717f8fA5BA3b931bACaF9ac03924EB475a0';

(async () => {
  const provider = new ethers.providers.JsonRpcProvider('http://localhost:8552')

  try {
    await provider.send("hardhat_impersonateAccount", [WHALE])
  } catch (e) {
    console.log(e)
  }

  const charlieSigner = provider.getSigner(charlie)
  const whaleSigner = provider.getSigner(WHALE)

  const bridgeContract = new ethers.Contract(
    bridgeAddress,
    Bridge__factory.abi
  )

  const genericContract = new ethers.Contract(
    genericAddress,
    GenericHandler__factory.abi
  )

  const basicFeeContract = new ethers.Contract(
    basicFeeAddress,
    BasicFeeHandler__factory.abi
  )

  const bridgeInstace = bridgeContract.connect(charlieSigner)
  const genericInstance = genericContract.connect(charlieSigner)
  const basicFeeInstance = basicFeeContract.connect(charlieSigner)


  let dai = new ethers.Contract(DAI, IERC20__factory.abi)
  let usdc = new ethers.Contract(USDC, IERC20__factory.abi)
  let weth = new ethers.Contract(WETH, IWETH9__factory.abi)
  let poolFee = BigNumber.from("100");

  logger.info(`dai address: ${dai.address}`)
  logger.info(`usdc address: ${usdc.address}`)
  logger.info(`weth address: ${weth.address}`)

  const LPContract = new ethers.Contract(
    LPAddress,
    LPABI
  )


  // BALANCES OF WHALE IN DAI AND USDC
  const whaleDaiBalance = await dai.connect(whaleSigner).balanceOf(whaleSigner._address);
  console.log("🚀 ~ file: LP.ts ~ line 45 ~ whaleDaiBalance", whaleDaiBalance)
  const whaleUsdcBalance = await usdc.connect(whaleSigner).balanceOf(whaleSigner._address);
  console.log("🚀 ~ file: LP.ts ~ line 47 ~ whaleUsdcBalance", whaleUsdcBalance)

  let daiAmount = BigNumber.from(1000n * 10n ** 18n);
  let usdcAmount = ethers.utils.parseUnits("1000.0", 6);

  const charlieBalanceBefore = await charlieSigner.getBalance()
  logger.info(`owner balance before: ${charlieBalanceBefore}`);

  await (weth.connect(charlieSigner) as any).deposit({ value: BigNumber.from(1000n * 10n ** 18n).mul(2), gasLimit: GAS_LIMIT })

  await charlieSigner.sendTransaction({
    to: whaleSigner._address,
    value: charlieBalanceBefore.div(2),
    gasLimit: GAS_LIMIT,
  });

  const daiConnected = await dai.connect(whaleSigner)

  console.log("")
  console.log("DAI BALANCE CHARLIE BEFORE =>>", await daiConnected.balanceOf(charlieSigner._address))
  console.log("")


  try {
    const transferToCharlie = await daiConnected.transfer(charlieSigner._address, daiAmount)
    await transferToCharlie.wait()
  } catch (e) {
    console.log("Error DAI CONNECTED =>", e);
  }

  console.log("")
  console.log("DAI BALANCE CHARLIE AFTER ==>", await dai.connect(charlieSigner).balanceOf(charlieSigner._address))


  try {
    const transferToCharlieUSDC = await usdc.connect(whaleSigner).transfer(charlieSigner._address, usdcAmount);
    await transferToCharlieUSDC.wait()
  } catch (e) {
    console.log("Error USDC CONNECTED =>", e)
  }

  await weth.connect(charlieSigner).transfer(whaleSigner._address, BigNumber.from(1000n * 10n ** 18n))

  const usdcOwnerBalance = await usdc.connect(whaleSigner).balanceOf(charlieSigner._address);
  const daiOwnerBalance = await dai.connect(whaleSigner).balanceOf(charlieSigner._address);
  const whaleBalanceWeth = await weth.connect(whaleSigner).balanceOf(charlieSigner._address)

  console.log("whaleBalance WETH", whaleBalanceWeth)
  logger.info(`dai owner balance before: ${daiOwnerBalance}`);
  logger.info(`usdc owner balance before: ${usdcOwnerBalance}`);

  let wethAmount = ethers.utils.parseUnits("0.5", "ether")

  await weth.connect(whaleSigner).transfer(charlieSigner._address, wethAmount)

  await (await dai.connect(charlieSigner).approve(LPAddress, daiAmount)).wait(1)
  await (await usdc.connect(charlieSigner).approve(LPAddress, usdcAmount)).wait(1)


  console.log("APPROVED!!!")
  const txLP = await LPContract.connect(charlieSigner).mintPosition2(daiAmount, usdcAmount)
  await txLP.wait(1)

  console.log("End execution!")

})()