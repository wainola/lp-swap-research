// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.7.6;
pragma abicoder v2;

import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-core/contracts/libraries/TickMath.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/INonfungiblePositionManager.sol";
import "@uniswap/v3-periphery/contracts/base/LiquidityManagement.sol";
import "hardhat/console.sol";

contract LP is IERC721Receiver {
    address public constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    INonfungiblePositionManager public constant nonfungiblePositionManager =
        INonfungiblePositionManager(0xC36442b4a4522E871399CD717aBDD847Ab11FE88);
    uint24 public constant poolFee = 100;
    uint256 public constant MAX_SLIPPAGE = 1; // 1%

    // struct from Nico's solution
    struct Deposit {
        address owner;
        uint128 liquidity;
        address token0;
        address token1;
    }

    // maping from Nico's solution
    mapping(uint256 => Deposit) public deposits;

    // Implementing `onERC721Received` so this contract can receive custody of erc721 tokens
    function onERC721Received(
        address operator,
        address,
        uint256 tokenId,
        bytes calldata
    ) external override returns (bytes4) {
        // get position information

        return this.onERC721Received.selector;
    }

    uint256 public poolCount; // number of pools, for making ID's incremental
    uint256 private _tokenId;

    struct Pool {
        address token0;
        address token1;
        uint24 poolFee;
        bool isActive;
    }
    /// @dev pools[poolId] => Pool
    mapping(uint256 => Pool) public pools;

    /// @notice adds a new pool to the strategy
    function addPool(
        address token0,
        address token1,
        uint24 poolFee
    ) external {
        // Check is not address zero
        require(
            (token0 != address(0) && token1 != address(0)),
            "The token can't be the zero address"
        );

        // Check that poolFee exists
        require(
            poolFee == 100 ||
                poolFee == 500 ||
                poolFee == 3000 ||
                poolFee == 10000,
            "Invalid poolFee"
        );

        // assert pool does not exist
        for (uint256 poolId = 0; poolId < poolCount; poolId++) {
            require(
                pools[poolId].token0 != token0 &&
                    pools[poolId].token1 != token1 &&
                    pools[poolId].poolFee != poolFee,
                "Pool already exists"
            );
        }

        // creates pool in mapping
        pools[poolCount] = Pool({
            token0: token0,
            token1: token1,
            poolFee: poolFee,
            isActive: true
        });
        poolCount += 1; // This for making ID's incremental
        console.log("Pool added to struct of Pools");
    }

    function mintPosition(
        uint256 poolId,
        uint256 a0,
        uint256 a1
    )
        external
        returns (
            uint256 tokenId,
            uint128 liquidity,
            uint256 amount0,
            uint256 amount1
        )
    {
        Pool memory pool = pools[poolId];
        TransferHelper.safeTransferFrom(
            pool.token0,
            msg.sender,
            address(this),
            a0
        );
        TransferHelper.safeTransferFrom(
            pool.token1,
            msg.sender,
            address(this),
            a1
        );
        console.log("safe transfer executed");

        TransferHelper.safeApprove(
            pool.token0,
            address(nonfungiblePositionManager),
            a0
        );
        TransferHelper.safeApprove(
            pool.token1,
            address(nonfungiblePositionManager),
            a1
        );
        console.log("safe approve executed");
        console.log("token0", pool.token0);
        console.log("token1", pool.token1);
        console.log("fee", pool.poolFee);
        console.log("amount0", a0);
        console.log("amount1", a1);
        console.log("slippage a0", _slippageCalc(a0));
        console.log("slippage a1", _slippageCalc(a1));
        console.log("tick lower", uint(int256(TickMath.MIN_TICK)));
        console.log("tick upper", uint(int256(TickMath.MAX_TICK)));

        INonfungiblePositionManager.MintParams
            memory params = INonfungiblePositionManager.MintParams({
                token0: pool.token0,
                token1: pool.token1,
                fee: pool.poolFee,
                tickLower: TickMath.MIN_TICK,
                tickUpper: TickMath.MAX_TICK,
                amount0Desired: a0,
                amount1Desired: a1,
                amount0Min: _slippageCalc(a0),
                amount1Min: _slippageCalc(a1),
                recipient: address(this),
                deadline: block.timestamp
            });

        console.log("setting the params to mint");

        (tokenId, liquidity, amount0, amount1) = nonfungiblePositionManager
            .mint(params);
        console.log("tokenid", tokenId);
        console.log("liquidity", liquidity);
    }

    // method for calculating max slippage of an amount
    function _slippageCalc(uint256 amount) internal pure returns (uint256) {
        return amount - ((amount * MAX_SLIPPAGE) / 100);
    }

    function mintPosition2(uint256 a0, uint256 a1)
        external
        returns (
            uint256 tokenId,
            uint128 liquidity,
            uint256 amount0,
            uint256 amount1
        )
    {
        TransferHelper.safeTransferFrom(DAI, msg.sender, address(this), a0);
        TransferHelper.safeTransferFrom(USDC, msg.sender, address(this), a1);
        console.log("safe transfer executed");

        TransferHelper.safeApprove(
            DAI,
            address(nonfungiblePositionManager),
            a0
        );
        TransferHelper.safeApprove(
            USDC,
            address(nonfungiblePositionManager),
            a1
        );
        console.log("safe approve executed");
        console.log("token0", DAI);
        console.log("token1", USDC);
        console.log("fee", poolFee);
        console.log("amount0", a0);
        console.log("amount1", a1);
        console.log("slippage a0", _slippageCalc(a0));
        console.log("slippage a1", _slippageCalc(a1));
        console.log("tick lower", uint(int256(TickMath.MIN_TICK)));
        console.log("tick upper", uint(int256(TickMath.MAX_TICK)));

        INonfungiblePositionManager.MintParams
            memory params = INonfungiblePositionManager.MintParams({
                token0: DAI,
                token1: USDC,
                fee: poolFee,
                tickLower: TickMath.MIN_TICK,
                tickUpper: TickMath.MAX_TICK,
                amount0Desired: a0,
                amount1Desired: a1,
                amount0Min: _slippageCalc(a0),
                amount1Min: _slippageCalc(a1),
                recipient: address(this),
                deadline: block.timestamp
            });

        console.log("setting the params to mint");

        (tokenId, liquidity, amount0, amount1) = nonfungiblePositionManager
            .mint(params);
        console.log("tokenid", tokenId);
        console.log("liquidity", liquidity);
    }
}
