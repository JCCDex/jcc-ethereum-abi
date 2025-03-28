const abiDecoder = require("abi-decoder");
import { Contract } from "web3-eth-contract";
const isFunction = require("lodash/isFunction");
const abiCoder = require("web3-eth-abi");
import { IABIItem, IDecoded, IDecodedLog, ILog } from "./model";
const BN = require("bn.js");
// const contractClass = require("web3-eth-contract");
import { ContractAbi } from "web3-types";

/**
 * decoder and encoder for Ether
 *
 * @export
 * @class EthereumABI
 */
export default class EthereumABI {
  /**
   * Ether contract instance
   *
   * @private
   * @type {Contract}
   * @memberof EthereumABI
   */
  private _contract: Contract<ContractAbi>;

  /**
   * Ether abi
   *
   * @private
   * @type {IABIItem[]}
   * @memberof EthereumABI
   */
  private _abi: IABIItem[];

  /**
   * Creates an instance of EthereumABI.
   * @param {Contract} contract Ether contract instance
   * @memberof EthereumABI
   */

  constructor(contract: Contract<ContractAbi>) {
    if (contract instanceof Contract) {
      this._contract = contract;
      this._abi = Object.assign([], contract.options.jsonInterface);
    } else {
      throw new Error("The input value isn't a contract instance");
    }
  }
  /**
   * get item of function meta data
   *
   * @param {string} name defined function name in the abi
   * @param {*} args parameters according to the defined inputs
   * @returns {IABIItem}
   * @memberof EthereumABI
   */
  public getAbiItem = (name: string, ...args): IABIItem => {
    const method = this._contract.methods[name];
    if (!isFunction(method)) {
      throw new Error(`The contract doesn't contain "${name}" function`);
    }
    const filterABIs: IABIItem[] = this._abi.filter((item) => item.name === name);
    let abi: IABIItem;
    if (filterABIs.length === 1) {
      abi = filterABIs[0];
    } else {
      abi = filterABIs.find((item) => item.inputs.length === args.length);
      if (!abi) {
        throw new Error("Invalid number of arguments to Solidity function");
      }
    }

    return abi;
  };

  /**
   * encode the input value by function name
   *
   * @param {string} name defined function name in the abi
   * @param {*} args parameters according to the defined inputs
   * @returns {string}
   * @memberof EthereumABI
   */
  public encode = (name: string, ...args): string => {
    const method = this._contract.methods[name];
    if (!isFunction(method)) {
      throw new Error(`The contract doesn't contain "${name}" function`);
    }

    const encodedData = method.apply(null, args).encodeABI();
    return encodedData;
  };

  /**
   * decode the input value
   *
   * @static
   * @param {string} data
   * @returns {IDecoded[]}
   * @memberof EthereumABI
   */
  public static decode(data: string): IDecoded[] {
    const decodedData = abiDecoder.decodeMethod(data);
    return decodedData;
  }

  /**
   * decode Ether transaction logs
   *
   * [Reference](https://github.com/ConsenSys/abi-decoder/blob/master/index.js#L130)
   *
   * @static
   * @param {ILog[]} logs
   * @returns {IDecodedLog[]} if event is defined and decode succeed, return log that contains
   * events as input arguments and name as event's name, otherwise return itself.
   * @memberof EthereumABI
   */
  public static decodeLogs(logs: ILog[]): IDecodedLog[] {
    return logs
      .filter((log) => log.topics.length > 0)
      .map((logItem) => {
        const methodID = logItem.topics[0].slice(2);
        const method = abiDecoder.getMethodIDs()[methodID];
        if (method) {
          const logData = logItem.data;
          const decodedParams = [];
          let dataIndex = 0;
          let topicsIndex = 1;

          const dataTypes = [];
          method.inputs.map((input) => {
            if (!input.indexed) {
              dataTypes.push(input.type);
            }
          });

          const decodedData = abiCoder.decodeParameters(dataTypes, logData.slice(2));
          // Loop topic and data to get the params
          method.inputs.map((param) => {
            const decodedP: any = {
              name: param.name,
              type: param.type,
            };

            if (param.indexed) {
              decodedP.value = logItem.topics[topicsIndex];
              topicsIndex++;
            } else {
              decodedP.value = decodedData[dataIndex];
              dataIndex++;
            }

            if (param.type === "address") {
              decodedP.value = decodedP.value.toLowerCase();
              // 42 because len(0x) + 40
              if (decodedP.value.length > 42) {
                const toRemove = decodedP.value.length - 42;
                const temp = decodedP.value.split("");
                temp.splice(2, toRemove);
                decodedP.value = temp.join("");
              }
            }
            if (param.type === "uint256" || param.type === "uint8" || param.type === "int") {
              decodedP.value = new BN(decodedP.value).toString(10);
            }

            decodedParams.push(decodedP);
          });

          return Object.assign(logItem, {
            events: decodedParams,
            name: method.name,
          });
        }
        return logItem;
      });
  }

  /**
   * add abi to abiDecoder
   *
   * @static
   * @param {IABIItem[]} abi
   * @memberof EthereumABI
   */
  public static addABI(abi: IABIItem[]) {
    abiDecoder.addABI(abi);
  }

  /**
   * remove ABIs and methodIDs from abiDecoder
   *
   * @static
   * @param {IABIItem[]} abi
   * @memberof EthereumABI
   */
  public static removeABI(abi: IABIItem[]) {
    abiDecoder.getABIs().length = 0;
    abiDecoder.removeABI(abi);
  }
}

export { EthereumABI };
