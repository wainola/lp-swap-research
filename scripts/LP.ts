import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { IERC165__factory, IERC20, IERC20__factory, IWETH9__factory, LP } from "../typechain-types";
import { abi as LPABI, bytecode as LPBytecode } from '../artifacts/contracts/LP.sol/LP.json'
const logger = require("pino")();

const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const WHALE = "0x2FAF487A4414Fe77e2327F0bf4AE2a264a776AD2"; //FTX Whale
const GAS_LIMIT = 2074040;
const nonFungiblePositionManagerAddress =
  "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

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
  const provider = new ethers.providers.JsonRpcProvider('http://localhost:8551')
  const aliceSigner = provider.getSigner(alice)

  const LPFactory = new ethers.ContractFactory(
    LPABI,
    LPBytecode,
    aliceSigner
  )

  const LPContract = await LPFactory.deploy()
  logger.info(`LP contract address: ${LPContract.address}`)

  // [owner, user] = await ethers.getSigners();
  // console.log("🚀 ~ file: LP.ts ~ line 28 ~ user", user)
  // console.log("🚀 ~ file: LP.ts ~ line 28 ~ owner", owner)

  // add a pool to LP (DAI/USDC 0.01%)
  // dai = await ethers.getContractAt("IERC20", DAI);
  // usdc = await ethers.getContractAt("IERC20", USDC);
  // weth = await ethers.getContractAt('IWETH9', WETH)
  
  let dai = new ethers.Contract(DAI, IERC20__factory.abi)
  let usdc = new ethers.Contract(USDC, IERC20__factory.abi)
  let weth = new ethers.Contract(WETH, IWETH9__factory.abi)
  poolFee = BigNumber.from("100");

  logger.info(`dai address: ${dai.address}`)
  logger.info(`usdc address: ${usdc.address}`)
  logger.info(`weth address: ${weth.address}`)


  const tx = await LPContract.addPool(dai.address, usdc.address, poolFee);
  await tx.wait();
  // // const tx2 = await LPContract.addPool(weth.address, usdc.address, BigNumber.from('3000'))
  // // await tx2.wait()

  // const whale = await ethers.getImpersonatedSigner(WHALE);
  const whale = provider.getSigner(WHALE)
  const whaleDaiBalance = await dai.connect(whale).balanceOf(whale._address);
  console.log("🚀 ~ file: LP.ts ~ line 45 ~ whaleDaiBalance", whaleDaiBalance)
  const whaleUsdcBalance = await usdc.connect(whale).balanceOf(whale._address);
  console.log("🚀 ~ file: LP.ts ~ line 47 ~ whaleUsdcBalance", whaleUsdcBalance)

  const aliceBalanceBefore = await aliceSigner.getBalance()
  logger.info(`owner balance before: ${aliceBalanceBefore}`);

  daiAmount = BigNumber.from(1000n * 10n ** 18n);
  usdcAmount = ethers.utils.parseUnits("1000.0", 6);

  // const wethConnected = await weth.connect(aliceSigner)
  // console.log(wethConnected)

  await (weth.connect(aliceSigner) as any).deposit({ value: BigNumber.from(1000n * 10n ** 18n).mul(2), gasLimit: GAS_LIMIT })

  // await aliceSigner.sendTransaction({
  //   to: whale._address,
  //   value: aliceBalanceBefore.div(2),
  //   gasLimit: GAS_LIMIT,
  // });

  // await dai.connect(whale).transfer(aliceSigner._address, daiAmount);
  // await usdc.connect(whale).transfer(aliceSigner._address, usdcAmount);

  // await weth.connect(aliceSigner).transfer(whale._address, BigNumber.from(1000n * 10n ** 18n))

  // const daiOwnerBalance = await dai.balanceOf(owner.address);
  // const usdcOwnerBalance = await usdc.balanceOf(owner.address);
  // const whaleBalanceWeth = await weth.balanceOf(whale.address)

  // console.log("whaleBalance WETH", whaleBalanceWeth)
  // logger.info(`dai owner balance before: ${daiOwnerBalance}`);
  // logger.info(`usdc owner balance before: ${usdcOwnerBalance}`);

  // wethAmount = ethers.utils.parseUnits("0.5", "ether")

  // await weth.connect(whale).transfer(owner.address, wethAmount)

})()