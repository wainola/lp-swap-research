import { ethers } from 'ethers'
import { nearestUsableTick, NonfungiblePositionManager, Pool, Position } from '@uniswap/v3-sdk'
import { Percent, Token } from '@uniswap/sdk-core'
import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { abi as NonfungiblePositionManagerABI } from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'
import { INonfungiblePositionManager } from '../typechain-types/@uniswap/v3-periphery/contracts/interfaces/INonfungiblePositionManager'

const provider = new ethers.providers.JsonRpcProvider('http://localhost:8551')

const poolAddress = '0x6c6bc977e13df9b0de53b251522280bb72383700'

const poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI, provider)

const address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
const signer = provider.getSigner(address)

const NonfungiblePositionManagerContract = new ethers.Contract(
  '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
  NonfungiblePositionManagerABI
)

// @ts-ignore
const NonfungiblePositionManagerInstance: INonfungiblePositionManager = NonfungiblePositionManagerContract.connect(signer)

interface Immutables {
  factory: string
  token0: string
  token1: string
  fee: number
  tickSpacing: number
  maxLiquidityPerTick: ethers.BigNumber
}

interface State {
  liquidity: ethers.BigNumber
  sqrtPriceX96: ethers.BigNumber
  tick: number
  observationIndex: number
  observationCardinality: number
  observationCardinalityNext: number
  feeProtocol: number
  unlocked: boolean
}

async function getPoolImmutables() {
  const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] = await Promise.all([
    poolContract.factory(),
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
    poolContract.tickSpacing(),
    poolContract.maxLiquidityPerTick(),
  ])

  const immutables: Immutables = {
    factory,
    token0,
    token1,
    fee,
    tickSpacing,
    maxLiquidityPerTick,
  }
  return immutables
}

async function getPoolState() {
  const [liquidity, slot] = await Promise.all([poolContract.liquidity(), poolContract.slot0()])

  const PoolState: State = {
    liquidity,
    sqrtPriceX96: slot[0],
    tick: slot[1],
    observationIndex: slot[2],
    observationCardinality: slot[3],
    observationCardinalityNext: slot[4],
    feeProtocol: slot[5],
    unlocked: slot[6],
  }

  return PoolState
}


async function main() {

  const [immutables, state] = await Promise.all([getPoolImmutables(), getPoolState()])

  console.log("imutables", immutables)
  console.log("state", state)

  const DAI = new Token(1, immutables.token0, 18, 'DAI', 'Dai Stablecoin')

  const USDC = new Token(1, immutables.token1, 18, 'USDC', 'USDC Coin')

  // const poolExample = new Pool(
  //   TokenA,
  //   TokenB,
  //   immutables.fee,
  //   state.sqrtPriceX96.toString(),
  //   state.liquidity.toString(),
  //   state.tick
  // )
  // console.log(poolExample)

  const DAI_USDC_POOL = new Pool(
    DAI,
    USDC,
    immutables.fee,
    state.sqrtPriceX96.toString(),
    state.liquidity.toString(),
    state.tick
  )

  const tickLower = nearestUsableTick(state.tick, immutables.tickSpacing) - immutables.tickSpacing * 2
  const tickUpper = nearestUsableTick(state.tick, immutables.tickSpacing) + immutables.tickSpacing * 2

  console.log("tick lower and upper", tickLower, tickUpper)
  const position = new Position({
    pool: DAI_USDC_POOL,
    // @ts-ignore
    liquidity: state.liquidity * 0.0002,
    tickLower,
    tickUpper,
  })

  console.log("position", position)

  const block = await provider.getBlock(await provider.getBlockNumber())

  const deadline = block.timestamp + 200

  const { calldata, value } = NonfungiblePositionManager.addCallParameters(position, {
    slippageTolerance: new Percent(50, 10_000),
    recipient: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    deadline: deadline,
  })

  console.log("calldata", calldata)
  console.log("value", value)

  const iFace = new ethers.utils.Interface(NonfungiblePositionManagerABI)
  const decoded = iFace.decodeFunctionData('mint', calldata)

  const [[tokenA, tokenB, fee, tickLowerA, tickUpperA, amount0Desired, amount1Desired, amount0Min, amount1Min, recipient, deadlineA]] = decoded
  console.log(tokenA, tokenB, fee, tickLowerA, tickUpperA, amount0Desired, amount1Desired, amount0Min, amount1Min, recipient, deadline)

  const mintPool = await NonfungiblePositionManagerInstance.mint({
    token0: tokenA,
    token1: tokenB,
    fee,
    tickLower: tickLowerA,
    tickUpper: tickUpperA,
    amount0Desired,
    amount1Desired,
    amount0Min,
    amount1Min,
    recipient,
    deadline: Date.now(),
  }, { gasLimit: ethers.utils.hexlify(50000)})
  const mintTx = await mintPool.wait(1)

  console.log(mintTx.status)

}

main()