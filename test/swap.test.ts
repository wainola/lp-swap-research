const { expect } = require("chai");
const { ethers, hardhatArguments } = require("hardhat");
const { ethers: realEthers } = require('ethers')
const { Bridge__factory, GenericHandler__factory, BasicFeeHandler__factory } = require("@chainsafe/chainbridge-contracts")
const SwapExampleJSON = require('../artifacts/contracts/SwapExample.sol/SwapExample.json')

describe('SwapExample', () => {
  it('stuff', async () => {
    // const web3 = new web3('http://localhost:8545')
    // const networkId = web3
    // console.log("network indo", Bridge__factory.bytecode, Bridge__factory.abi)

    const signers = await ethers.getSigners()
    const signer = signers[0]

    // const factory = new realEthers.ContractFactory(GoofyGoober.abi, GoofyGoober.bytecode, signer)

    // const contract = await factory.deploy()

    // const blankSignature = '0x00000000'

    // const bridgeFactory = await ethers.getContractFactory(Bridge__factory.abi, Bridge__factory.bytecode, signer)
    // const genericFactory = await ethers.getContractFactory(GenericHandler__factory.abi, GenericHandler__factory.bytecode, signer)
    // const basicFeeFactory = await ethers.getContractFactory(BasicFeeHandler__factory.abi, BasicFeeHandler__factory.bytecode, signer)

    // const bridgeContract = await bridgeFactory.deploy(1)
    // const bridgeAddress = bridgeContract.address
    // console.log("bridgeContract ", bridgeAddress)
    // const genericHandlerContract = await genericFactory.deploy(bridgeAddress)
    // const genericHandlerAddress = genericHandlerContract.address
    // console.log("genericHandlerContract", genericHandlerContract.address)
    // const basicFeeContract = await basicFeeFactory.deploy(bridgeAddress)
    // console.log("basicFeeContract address", basicFeeContract.address)

    // SETTING UP RESOURCE ID
    // const weth9ResourceId = realEthers.utils.hexZeroPad(13, 32)
    // console.log("🚀 ~ file: sample-test.js ~ line 48 ~ it ~ weth9ResourceId", weth9ResourceId)
    // const swapExampleResourceId = realEthers.utils.hexZeroPad(14, 32)
    // console.log("🚀 ~ file: sample-test.js ~ line 50 ~ it ~ swapExampleResourceId", swapExampleResourceId)


    // console.log("custom erc20 address", contract.address)
    // console.log("custom deploy tx", contract.deployTransaction)

    // SWAP CONTRACT TO DEPLOY
    const SwapExample = await ethers.getContractFactory('SwapExample')
    // USE ROUTER ADDRESS IN CONSTRUCTOR
    const swaper = await SwapExample.deploy('0xE592427A0AEce92De3Edee1F18E0157C05861564')

    // weth contract
    // check it out here: https://etherscan.io/address/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2#code
    const erc_abi = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "guy", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "src", "type": "address" }, { "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "wad", "type": "uint256" }], "name": "withdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "deposit", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": true, "name": "guy", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": true, "name": "dst", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "dst", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Deposit", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Withdrawal", "type": "event" }]

    const weth_addr = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
    const weth_contract = new ethers.Contract(weth_addr, erc_abi, signer)
    // const iWethContract = new realEthers.utils.Interface(erc_abi)
    // const depositSignature = iWethContract.getSighash('deposit')
    // console.log("🚀 ~ file: sample-test.js ~ line 73 ~ it ~ depositSignature", depositSignature)

    // DAI contract
    const dai_addr = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
    const dai_contract = new ethers.Contract(dai_addr, erc_abi, signer)

    // const swapperAddress = swaper.address
    // console.log("🚀 ~ file: sample-test.js ~ line 73 ~ it ~ swapperAddress", swapperAddress)

    // // USING INTERFACE TO GET SIGNATURE
    // const ISwaper = new realEthers.utils.Interface(SwapExampleJSON.abi)
    // console.log("swapExactInputSingle signature", ISwaper.getSighash('swapExactInputSingle'))

    // try {
    //   const responseAdminSetGenericResource = await (await bridgeContract.adminSetGenericResource(
    //     genericHandlerAddress,
    //     weth9ResourceId,
    //     weth_addr,
    //     depositSignature,
    //     0,
    //     blankSignature
    //   )).wait()
    //   console.log("🚀 ~ file: sample-test.js ~ line 95 ~ it ~ responseAdminSetGenericResource", responseAdminSetGenericResource.status)

    // } catch (e) {
    //   console.log("🚀 ~ file: sample-test.js ~ line 98 ~ it ~ e", e)
    // }

    // console.log("REOURCE ID TO CONTRACT ADDRESS", await genericHandlerContract._resourceIDToContractAddress(weth9ResourceId), weth_addr)

    // // UNPAUSE THE FUCKING BRIDGE
    // try {
    //   const unpause = await (await bridgeContract.endKeygen('0x1Ad4b1efE3Bc6FEE085e995FCF48219430e615C3')).wait(1)
    //   console.log("🚀 ~ file: sample-test.js ~ line 107 ~ it ~ unpause", unpause.status)

    // } catch (e) {
    //   console.log("🚀 ~ file: sample-test.js ~ line 110 ~ it ~ ERROR UNPAUSING", e)
    // }

    // const depositData = `0x${realEthers.utils.hexZeroPad(100, 32).substr(2) + realEthers.utils.hexZeroPad(signer.address.length, 32).substr(2) + signer.address.substr(2)}`

    // console.log("depositData", depositData)
    // let fee
    // try {
    //   const calculatedFee = await basicFeeContract.calculateFee(
    //     signer.address,
    //     1,
    //     2,
    //     weth9ResourceId,
    //     depositData,
    //     '0x00'
    //   )
    //   console.log("🚀 ~ file: sample-test.js ~ line 116 ~ it ~ calculatedFee", realEthers.utils.formatUnits(calculatedFee[0], 32))
    //   fee = calculatedFee[0]
    // } catch (e) {
    //   console.log("🚀 ~ file: sample-test.js ~ line 118 ~ it ~ CALCULATED FEE", e)
    // }

    // initial balance in ETH
    let balance = ethers.utils.formatEther((await signer.getBalance()))
    let num_weth = ethers.utils.formatEther((await weth_contract.balanceOf(signer.address)))
    expect(num_weth).to.equal('0.0')


    console.log('ETH Balance: ', balance)
    console.log('WETH Balance: ', num_weth)
    console.log('---')

    // convert eth to weth
    const overrides = {
      value: ethers.utils.parseEther('2'),
      gasLimit: ethers.utils.hexlify(50000),
    }

    // const depositFilter = weth_contract.filters.Deposit()

    // console.log("")
    // console.log("calling from generic handler")
    // console.log("")

    // const depositDataToSwap = '0x1bc16d674ec80000'
    // const genericDepositDataLength = (depositDataToSwap.substr(2)).length / 2
    // const genericDepositData = `0x${realEthers.utils.hexZeroPad(genericDepositDataLength, 32).substr(2) + depositDataToSwap.substr(2)}`

    // const depositFilters = bridgeContract.filters.Deposit()

    // bridgeContract.on(depositFilters, (p1, p2, p3, p4, p5, p6) => {
    //   console.log("")
    //   console.log("DEPOSIT EVENTS", p1, p2, p3)
    //   console.log("")
    // })

    // try {
    //   const depositTx = await (
    //     await bridgeContract.deposit(
    //       2,
    //       weth9ResourceId,
    //       genericDepositData,
    //       '0x00',
    //       {
    //         value: fee,
    //         gasLimit: ethers.utils.hexlify(100000)
    //       }
    //     )
    //   ).wait(1)
    //   console.log("🚀 ~ file: sample-test.js ~ line 161 ~ it ~ depositTx", depositTx.status)
    // } catch (e) {
    //   console.log("🚀 ~ file: sample-test.js ~ line 163 ~ it ~ ERROR DEPOSIT WETH THROUGH GENERIC CALL", e)
    // }


    let tx = await weth_contract.deposit(overrides)
    await tx.wait() // wait for it to be confirmed in blockchain


    // weth_contract.on(depositFilter, (sender, value) => {
    //   console.log("WETH9 deposit event", sender, realEthers.utils.formatEther(value))
    // })

    // confirm WETH balance increased
    balance = ethers.utils.formatEther((await signer.getBalance()))
    num_weth = ethers.utils.formatEther((await weth_contract.balanceOf(signer.address)))
    // expect(num_weth).to.equal('2.0')

    console.log('ETH Balance: ', balance)
    console.log('WETH Balance: ', num_weth)
    console.log('---')

    // approve swapper contract to spend for 1 WETH
    tx = await weth_contract.approve(swaper.address, ethers.utils.parseEther('1'))
    await tx.wait()

    // // const approvalFilter = weth_contract.filters.Approval()
    // // weth_contract.on(approvalFilter, (src, guy, wad) => {
    // //   console.log("Approval event", src, guy, wad)
    // // })

    // // 1 WETH -> DAI
    tx = await swaper.swapExactInputSingle(ethers.utils.parseEther('1'))
    await tx.wait()

    // // confirm DAI token balance
    num_weth = ethers.utils.formatEther((await weth_contract.balanceOf(signer.address)))
    let num_dai = ethers.utils.formatEther((await dai_contract.balanceOf(signer.address)))
    expect(num_weth).to.equal('1.0')

    console.log('WETH Balance: ', num_weth)
    console.log('DAI Balance: ', num_dai)

  })
})
