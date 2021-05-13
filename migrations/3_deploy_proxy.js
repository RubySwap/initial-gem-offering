const IGOByProxy = artifacts.require("IGOByProxy");
const IGOUpgradeProxy = artifacts.require("IGOUpgradeProxy");

const fs = require('fs');
const abi = require('./abi/igo.json')

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://lb.rpc.egem.io/'));

module.exports = async function(deployer, a, account) {
    await deployer.deploy(IGOByProxy);

    const num = 100000000 * Math.pow(10, 6);
    const numAsHex = "0x" + num.toString(16);

    const num1 = 149200 * Math.pow(10, 18);
    const numAsHex1 = "0x" + num1.toString(16);

    const proxyAdmin= '';
    const igoAdmin= '';

    const lpToken = ''; //ruby-egem
    const offeringToken = '';
    const startBlock = '';
    const endBlock = '';
    const offeringAmount = numAsHex;
    const raisingAmount = numAsHex1;
    const adminAddress = igoAdmin;

    const abiEncodeData = web3.eth.abi.encodeFunctionCall({
      "inputs": [
        {
          "internalType": "contract IBEP20",
          "name": "_lpToken",
          "type": "address"
        },
        {
          "internalType": "contract IBEP20",
          "name": "_offeringToken",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_startBlock",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_endBlock",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_offeringAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_raisingAmount",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_adminAddress",
          "type": "address"
        }
      ],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }, [
      lpToken,
      offeringToken,
      startBlock,
      endBlock,
      offeringAmount,
      raisingAmount,
      adminAddress
    ]);

    await deployer.deploy(IGOUpgradeProxy, proxyAdmin, IGOByProxy.address, abiEncodeData);

    console.log(proxyAdmin, IGOByProxy.address, abiEncodeData);

    // const lotteryProxy = new web3.eth.Contract(abi, IGOUpgradeProxy.address);
    // console.log((await lotteryProxy.methods.getAddressListLength().call()).toString())

};
