# jcc-ethereum-abi

Decoder and encoder for the Ethereum ABI and decode events from Ethereum transactions.

![npm](https://img.shields.io/npm/v/jcc-ethereum-abi.svg)
[![Build Status](https://travis-ci.com/JCCDex/jcc-ethereum-abi.svg?branch=master)](https://travis-ci.com/JCCDex/jcc-ethereum-abi)
[![Coverage Status](https://coveralls.io/repos/github/JCCDex/jcc-ethereum-abi/badge.svg?branch=master)](https://coveralls.io/github/JCCDex/jcc-ethereum-abi?branch=master)
[![Dependencies](https://img.shields.io/david/JCCDex/jcc-ethereum-abi.svg?style=flat-square)](https://david-dm.org/JCCDex/jcc-ethereum-abi)
[![npm downloads](https://img.shields.io/npm/dm/jcc-ethereum-abi.svg)](http://npm-stat.com/charts.html?package=jcc-ethereum-abi)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

## Installtion

```shell
npm i jcc-ethereum-abi
```

## API

[APIs](https://github.com/JCCDex/jcc-ethereum-abi/blob/master/docs/API.md)

## How to use

See [abi.spec.js](https://github.com/JCCDex/jcc-ethereum-abi/blob/master/test/abi.spec.js) for details.

参见[abi.spec.js](https://github.com/JCCDex/jcc-ethereum-abi/blob/master/test/abi.spec.js)获得更多细节信息

jcc-ethereum-abi的作用是将合约调用演化为对函数名，参数的字符串拼接，类似call by name的方式对合约进行调用。这种方式极大的简化了对合约调用的封装工作。

```javascript
const Web3 = require("web3");
const EthereumABI = require("jcc-ethereum-abi").EthereumABI;
const erc20ABI = require("./test/abi/erc20ABI");


// for encoding

// create contract instance
const web3 = new Web3(new Web3.providers.HttpProvider("https://localhost:8545"));
var myContract = new web3.eth.Contract(erc20ABI, '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe', {
    from: '0x1234567890123456789012345678901234567891', // default from address
    gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
});

const inst = new EthereumABI(myContract);
// encode
const data = EthereumABI.encode("transfer", "0x533243557dfdc87ae5bda885e22db00f87499971", "30000000000000000")


// for decoding data and transaction logs

// add abi to abiDecoder firstly
EthereumABI.addABI(erc20ABI);

// decode
const decode = EthereumABI.decode(data);

// decode transaction logs
const logs = [{
    data: "0x00000000000000000000000000000000000000000000017aedbc9d648c780000",
    address: "0x4c6007cea426e543551f2cb6392e6d6768f74706",
    blockHash: "0x181c92ab726131010021473d6e444d2f682e013eb12b2d4faa0946a8847c56f1",
    blockNumber: 3175749,
    logIndex: 0,
    removed: false,
    topics: ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "0x000000000000000000000000687f6ab056708fcfd34b3226c0b70ddf95b2eab2", "0x00000000000000000000000066c9b619215db959ec137ede6b96f3fa6fd35a8a"],
    transactionHash: "0x9a7da10a30ad4c8e1bb4461107497130a19f53a844069dd3e019557ee1a423b8",
    transactionIndex: 1
}];
const decodeLogs = EthereumABI.decodeLogs(logs);


// remove ABIs and methodIDs from abiDecoder
EthereumABI.removeABI(erc20ABI);

```
