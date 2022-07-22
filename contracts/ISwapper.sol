// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity 0.8.0;

interface ISwapExample {
    function swapExactInputSingle(bytes calldata data) external returns (uint256 amountOut);
}
