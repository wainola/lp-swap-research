// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.7.6;
pragma abicoder v2;

import "./SwapExample2.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";
import "./ISwapper.sol";

contract SwapHandler {
  address swapRouter = 0xE592427A0AEce92De3Edee1F18E0157C05861564;
  address WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
  constructor(){}

  function approveHandler(address delegator, address token, uint256 amount) external returns (bool){
    console.log("approve handler delegator: %s, token: %s", delegator, token);
    IERC20 erc20 = IERC20(token);
    // SELECTOR NOT BEING RECOGNIZED
    bytes memory dataToSend = abi.encodeWithSelector(erc20.approve.selector, delegator, amount);
    // bytes memory dataToSend = abi.encodeWithSignature("approve(address, uint256)", delegator, 39);
    (bool success, bytes memory res) = address(erc20).call(dataToSend);
    console.log("success approving %s", success);
    return success;
  }

  // THIS WORKS
  function approve2(address delegator, address token) external returns (bool){
    console.log("amount approve2");
    IERC20 erc20 = IERC20(token);
    erc20.approve(delegator, 33);
    return true;
  }

  function executeSwap(
    address swapperAddress,
    uint256 amount,
    address recipient
  ) external {
    ISwapExample swapper = ISwapExample(swapperAddress);
    address depositer = msg.sender; // FIRST ACCOUNT ON HARDHAT or accounts[0]
    console.log("depositer is %s", depositer);
    console.log("amount is %s", amount);

    // bytes memory data = abi.encodeWithSelector(swapper.swapExactInputSingle.selector, amount);
    address recipientLocal = address(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266);
    uint256 amountLocal = amount;
    bytes memory dataToSend = abi.encode(amountLocal, recipientLocal);
    bytes memory data = abi.encodeWithSelector(swapper.swapExactInputSingle.selector, dataToSend);
    console.log("encoding data");

    (bool success, bytes memory returnData) = address(swapperAddress).call(data);
    console.log("success %s", success);

    require(success, "Call to swapExactInputSingle failed");
    uint256 amountOut;
    (amountOut) = abi.decode(returnData, (uint256));
    console.log("amount out %s", amountOut);

  }

  function executeSwap2(address swapper, uint256 amountIn) external {
    ISwapExample swapper = ISwapExample(swapper);
    address recipientLocal = address(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266);
    uint256 amountLocal = amountIn;
    bytes memory dataToSend = abi.encode(amountLocal, recipientLocal);
    swapper.swapExactInputSingle(dataToSend);
  }
}
