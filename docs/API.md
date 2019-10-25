# API

```javascript
/**
  * Creates an instance of EthereumABI.
  * @param {Contract} contract ethereum contract instance
  * @memberof EthereumABI
  */
  constructor(contract: Contract);
```

 ```javascript
 /**
  * ethereum contract instance
  *
  * @private
  * @type {Contract}
  * @memberof EthereumABI
  */
  private _contract;
/**
  * ethereum abi
  *
  * @private
  * @type {IABIItem[]}
  * @memberof EthereumABI
  */
  private _abi;

/**
 * get item of function meta data
 *
 * @param {string} name defined function name in the abi
 * @param {*} args parameters according to the defined inputs
 * @returns {IABIItem}
 * @memberof EthereumABI
 */
  getAbiItem(name: string, ...args: any[]): IABIItem;

/**
  * encode the input value by function name
  *
  * @param {string} name defined function name in the abi
  * @param {*} args parameters according to the defined inputs
  * @returns {string}
  * @memberof EthereumABI
  */
  encode(name: string, ...args: any[]): string;

/**
  * decode the input value
  *
  * @static
  * @param {string} data
  * @returns {IDecoded[]}
  * @memberof EthereumABI
  */
  static decode(data: string): IDecoded[];

/**
  * decode ethereum transaction logs
  *
  * [Reference](https://github.com/ConsenSys/abi-decoder/blob/master/index.js#L130)
  *
  * @static
  * @param {ILog[]} logs
  * @returns {IDecodedLog[]} if event is defined and decode succeed, return log that contains
  * events as input arguments and name as event's name, otherwise return itself.
  * @memberof EthereumABI
  */
  static decodeLogs(logs: ILog[]): IDecodedLog[];

/**
  * add abi to abiDecoder
  *
  * @static
  * @param {IABIItem[]} abi
  * @memberof EthereumABI
  */
  static addABI(abi: IABIItem[]): void;

/**
  * remove ABIs and methodIDs from abiDecoder
  *
  * @static
  * @param {IABIItem[]} abi
  * @memberof EthereumABI
  */
  static removeABI(abi: IABIItem[]): void;
```
