# API

```javascript
/**
  * Creates an instance of EtherABI.
  * @param {Contract} contract moac contract instance
  * @memberof EtherABI
  */
  constructor(contract: Contract);
```

 ```javascript
 /**
  * moac contract instance
  *
  * @private
  * @type {Contract}
  * @memberof EtherABI
  */
  private _contract;
/**
  * moac abi
  *
  * @private
  * @type {IABIItem[]}
  * @memberof EtherABI
  */
  private _abi;

/**
 * get item of function meta data
 *
 * @param {string} name defined function name in the abi
 * @param {*} args parameters according to the defined inputs
 * @returns {IABIItem}
 * @memberof EtherABI
 */
  getAbiItem(name: string, ...args: any[]): IABIItem;

/**
  * encode the input value by function name
  *
  * @param {string} name defined function name in the abi
  * @param {*} args parameters according to the defined inputs
  * @returns {string}
  * @memberof EtherABI
  */
  encode(name: string, ...args: any[]): string;

/**
  * decode the input value
  *
  * @static
  * @param {string} data
  * @returns {IDecoded[]}
  * @memberof EtherABI
  */
  static decode(data: string): IDecoded[];

/**
  * decode moac transaction logs
  *
  * [Reference](https://github.com/ConsenSys/abi-decoder/blob/master/index.js#L130)
  *
  * @static
  * @param {ILog[]} logs
  * @returns {IDecodedLog[]} if event is defined and decode succeed, return log that contains
  * events as input arguments and name as event's name, otherwise return itself.
  * @memberof EtherABI
  */
  static decodeLogs(logs: ILog[]): IDecodedLog[];

/**
  * add abi to abiDecoder
  *
  * @static
  * @param {IABIItem[]} abi
  * @memberof EtherABI
  */
  static addABI(abi: IABIItem[]): void;

/**
  * remove ABIs and methodIDs from abiDecoder
  *
  * @static
  * @param {IABIItem[]} abi
  * @memberof EtherABI
  */
  static removeABI(abi: IABIItem[]): void;
```
