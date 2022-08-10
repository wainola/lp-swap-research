// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.7.6;

interface ISwapExample {
    function swapExactInputSingle(bytes calldata data) external returns (uint256 amountOut);
    function swapExactInputSingleUSDC(bytes calldata data) external returns (uint256 amountOut);
}
