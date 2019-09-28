export interface ILog {
    data: string,
    address: string,
    event_name:string,
    log_index: number,
    topics: string[]
}

interface IEvent {
    name: string,
    type: string,
    value: any
}

export interface IDecodedLog extends ILog {
    events?: IEvent[],
    name?: string
}

export interface IDecoded {
    name: string,
    value: any,
    type: string
}

interface IInput {
    name: string,
    type: string,
    components?: any
}

interface IOutput {
    name: string,
    type: string,
    components?: any
}

// reference: https://solidity.readthedocs.io/en/latest/abi-spec.html#json
export interface IABIItem {
    type?: string,
    name?: string,
    inputs?: IInput[],
    outputs?: IOutput[],
    stateMutability?: string,
    payable?: boolean,
    constant?: boolean,
    signature?:string
}
