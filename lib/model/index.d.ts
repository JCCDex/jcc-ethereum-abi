export interface ILog {
    TxData: string;
    address: string;
    blockHash: string;
    blockNumber: number;
    logIndex: number;
    removed: number;
    topics: string[];
    transactionHash: string;
    transactionIndex: number;
}
interface IEvent {
    name: string;
    type: string;
    value: any;
}
export interface IDecodedLog extends ILog {
    events?: IEvent[];
    name?: string;
}
export interface IDecoded {
    name: string;
    value: any;
    type: string;
}
interface IInput {
    name: string;
    type: string;
    components?: any;
}
interface IOutput {
    name: string;
    type: string;
    components?: any;
}
export interface IABIItem {
    type?: string;
    name?: string;
    inputs?: IInput[];
    outputs?: IOutput[];
    stateMutability?: string;
    payable?: boolean;
    constant?: boolean;
    signature?: string;
}
export {};
