"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var abiDecoder = require("abi-decoder");
var Contract = require("web3-eth-contract");
var isFunction = require("lodash/isFunction");
var abiCoder = require("web3-eth-abi");
var web3_utils_1 = require("web3-utils");
/**
 * decoder and encoder for Ether
 *
 * @export
 * @class EtherABI
 */
var EtherABI = /** @class */ (function () {
    /**
     * Creates an instance of EtherABI.
     * @param {Contract} contract Ether contract instance
     * @memberof EtherABI
     */
    function EtherABI(contract) {
        var _this = this;
        /**
         * get item of function meta data
         *
         * @param {string} name defined function name in the abi
         * @param {*} args parameters according to the defined inputs
         * @returns {IABIItem}
         * @memberof EtherABI
         */
        this.getAbiItem = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var method = _this._contract[name];
            if (!isFunction(method)) {
                throw new Error("The contract doesn't contain \"" + name + "\" function");
            }
            var filterABIs = _this._abi.filter(function (item) { return item.name === name; });
            var abi;
            if (filterABIs.length === 1) {
                abi = filterABIs[0];
            }
            else {
                abi = filterABIs.find(function (item) { return item.inputs.length === args.length; });
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
         * @memberof EtherABI
         */
        this.encode = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var method = _this._contract[name];
            if (!isFunction(method)) {
                throw new Error("The contract doesn't contain \"" + name + "\" function");
            }
            var filterABIs = _this._abi.filter(function (item) { return item.name === name; });
            var encodedData;
            if (filterABIs.length === 1) {
                encodedData = method["getData"].apply(null, args);
            }
            else {
                var abi = filterABIs.find(function (item) { return item.inputs.length === args.length; });
                if (!abi) {
                    throw new Error("Invalid number of arguments to Solidity function");
                }
                // detail: https://github.com/EtherChain/chain3/blob/master/lib/chain3/function.js#L282
                var typename = abi.inputs.map(function (input) { return input.type; }).join(",");
                encodedData = method[typename].getData.apply(null, args);
            }
            if (encodedData.includes("NaN")) {
                throw new Error('The encoded data contains "NaN", please check the input arguments');
            }
            return encodedData;
        };
        if (contract instanceof Contract) {
            this._contract = contract;
            this._abi = contract._jsonInterface;
        }
        else {
            throw new Error("The input value isn't a contract instance");
        }
    }
    /**
     * decode the input value
     *
     * @static
     * @param {string} data
     * @returns {IDecoded[]}
     * @memberof EtherABI
     */
    EtherABI.decode = function (data) {
        var decodedData = abiDecoder.decodeMethod(data);
        return decodedData;
    };
    /**
     * decode Ether transaction logs
     *
     * [Reference](https://github.com/ConsenSys/abi-decoder/blob/master/index.js#L130)
     *
     * @static
     * @param {ILog[]} logs
     * @returns {IDecodedLog[]} if event is defined and decode succeed, return log that contains
     * events as input arguments and name as event's name, otherwise return itself.
     * @memberof EtherABI
     */
    EtherABI.decodeLogs = function (logs) {
        return logs
            .filter(function (log) { return log.topics.length > 0; })
            .map(function (logItem) {
            var methodID = logItem.topics[0].slice(2);
            var method = abiDecoder.getMethodIDs()[methodID];
            if (method) {
                var logData = logItem.TxData;
                var decodedParams_1 = [];
                var dataIndex_1 = 0;
                var topicsIndex_1 = 1;
                var dataTypes_1 = [];
                method.inputs.map(function (input) {
                    if (!input.indexed) {
                        dataTypes_1.push(input.type);
                    }
                });
                var decodedData_1 = abiCoder.decodeParameters(dataTypes_1, logData.slice(2));
                // Loop topic and data to get the params
                method.inputs.map(function (param) {
                    var decodedP = {
                        name: param.name,
                        type: param.type
                    };
                    if (param.indexed) {
                        decodedP.value = logItem.topics[topicsIndex_1];
                        topicsIndex_1++;
                    }
                    else {
                        decodedP.value = decodedData_1[dataIndex_1];
                        dataIndex_1++;
                    }
                    if (param.type === "address") {
                        decodedP.value = decodedP.value.toLowerCase();
                        // 42 because len(0x) + 40
                        if (decodedP.value.length > 42) {
                            var toRemove = decodedP.value.length - 42;
                            var temp = decodedP.value.split("");
                            temp.splice(2, toRemove);
                            decodedP.value = temp.join("");
                        }
                    }
                    if (param.type === "uint256" ||
                        param.type === "uint8" ||
                        param.type === "int") {
                        decodedP.value = new web3_utils_1.BN(decodedP.value).toString(10);
                    }
                    decodedParams_1.push(decodedP);
                });
                return Object.assign(logItem, {
                    events: decodedParams_1,
                    name: method.name
                });
            }
            return logItem;
        });
    };
    /**
     * add abi to abiDecoder
     *
     * @static
     * @param {IABIItem[]} abi
     * @memberof EtherABI
     */
    EtherABI.addABI = function (abi) {
        abiDecoder.addABI(abi);
    };
    /**
     * remove ABIs and methodIDs from abiDecoder
     *
     * @static
     * @param {IABIItem[]} abi
     * @memberof EtherABI
     */
    EtherABI.removeABI = function (abi) {
        abiDecoder.getABIs().length = 0;
        abiDecoder.removeABI(abi);
    };
    return EtherABI;
}());
exports.EtherABI = EtherABI;
exports.default = EtherABI;
//# sourceMappingURL=abi.js.map