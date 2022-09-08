import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { IERC20, LP } from "../typechain-types";
const logger = require("pino")();

const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const WHALE = "0x2FAF487A4414Fe77e2327F0bf4AE2a264a776AD2"; //FTX Whale
const GAS_LIMIT = 2074040;

describe('LP', () => {const logger = require("pino")();
  let dai: IERC20
  let weth: IERC20
  let usdc: IERC20
  let whale
  let owner: SignerWithAddress
  let user
  let wethAmount: BigNumber
  let usdcAmount: BigNumber
  let daiAmount: BigNumber
  let LPD: LP
  let poolFee: BigNumber
  
  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();

      const liquExamplesFactory = await ethers.getContractFactory("LP");
      LPD = (await liquExamplesFactory.deploy()) as LP
      await LPD.deployed();

      // add a pool to SupplyUni (DAI/USDC 0.01%)
      dai = await ethers.getContractAt("IERC20", DAI);
      usdc = await ethers.getContractAt("IERC20", USDC);
      weth = await ethers.getContractAt('IWETH9', WETH)
      poolFee = BigNumber.from("100");

      const tx = await LPD.addPool(dai.address, usdc.address, poolFee);
      // const tx2 = await supplyUni.addPool(weth.address, usdc.address, BigNumber.from('3000'))
      await tx.wait();
      // await tx2.wait()

      const whale = await ethers.getImpersonatedSigner(WHALE);
      const whaleDaiBalance = await dai.balanceOf(whale.address);
      const whaleUsdcBalance = await usdc.balanceOf(whale.address);

      const ownerBalanceBefore = await ethers.provider.getBalance(
        owner.address
      );
      logger.info(`owner balance before: ${ownerBalanceBefore}`);

      daiAmount = BigNumber.from(1000n * 10n ** 18n);
      usdcAmount = ethers.utils.parseUnits("1000.0", 6);

      // expect(whaleDaiBalance).to.gte(daiAmount);
      // expect(whaleUsdcBalance).to.gte(usdcAmount);

      await (weth.connect(owner) as any).deposit({ value: BigNumber.from(1000n * 10n ** 18n).mul(2), gasLimit: GAS_LIMIT })

      await owner.sendTransaction({
        to: whale.address,
        value: ownerBalanceBefore.div(2),
        gasLimit: GAS_LIMIT,
      });

      await dai.connect(whale).transfer(owner.address, daiAmount);
      await usdc.connect(whale).transfer(owner.address, usdcAmount);

      await weth.connect(owner).transfer(whale.address, BigNumber.from(1000n * 10n ** 18n))

      const daiOwnerBalance = await dai.balanceOf(owner.address);
      const usdcOwnerBalance = await usdc.balanceOf(owner.address);
      const whaleBalanceWeth = await weth.balanceOf(whale.address)

      console.log("whaleBalance WETH", whaleBalanceWeth)
      logger.info(`dai owner balance before: ${daiOwnerBalance}`);
      logger.info(`usdc owner balance before: ${usdcOwnerBalance}`);

      wethAmount = ethers.utils.parseUnits("0.5", "ether")

      await weth.connect(whale).transfer(owner.address, wethAmount)
  })

  // it('Should mint', async () => {
  //   const lastId = (await LPD.poolCount()).sub(1);
  //   await (await dai.connect(owner).approve(LPD.address, daiAmount)).wait(1)
  //   // await weth.connect(owner).approve(LPD.address, ethers.utils.parseUnits("0.5", "ether").toHexString())
  //   await (await usdc.connect(owner).approve(LPD.address, usdcAmount)).wait(1)

  //   console.log("approved!")
  //   const tx = await LPD.connect(owner).mintPosition(lastId, daiAmount, usdcAmount)
  //   await tx.wait(1)
  // })
  it('Should mint', async () => {
    // const lastId = (await LPD.poolCount()).sub(1);
    await (await dai.connect(owner).approve(LPD.address, daiAmount)).wait(1)
    // await weth.connect(owner).approve(LPD.address, ethers.utils.parseUnits("0.5", "ether").toHexString())
    await (await usdc.connect(owner).approve(LPD.address, usdcAmount)).wait(1)

    console.log("approved!")
    const tx = await LPD.connect(owner).mintPosition2(daiAmount, usdcAmount)
    await tx.wait(1)
  })
})