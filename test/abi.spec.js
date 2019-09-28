const Web3 = require("web3");
const EtherABI = require("../lib/abi").EtherABI;
const erc20ABI = require("./abi/erc20ABI");
const erc721ABI = require("./abi/erc721ABI");
const expect = require("chai").expect;

describe("test abi", function () {


  describe("test constructor", function () {
    it("throw error if input value is invalid", function () {
      expect(() => new EtherABI()).throw("The input value isn't a contract instance");
    })
  })

  describe("test erc20 abi", function () {

    describe("test encode & decode", function () {
      const web3 = new Web3(new Web3.providers.HttpProvider("https://localhost:8545"));
      var myContract = new web3.eth.Contract(erc20ABI, '0x52bc44d5378309ee2abf1539bf71de1b7d7be3b5', {
        from: '0x1234567890123456789012345678901234567891', // default from address
        gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
      });
      const inst = new EtherABI(myContract);
      before(function () {
        EtherABI.addABI(erc20ABI);
      });

      after(function () {
        EtherABI.removeABI(erc20ABI);
      });

      it("test get abi item", function () {
        const data = inst.getAbiItem.call(null, "transfer", "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe", "20000000000");
        expect(data.stateMutability).to.equal("nonpayable");
      });

      it("throw error if function name does not exist", function () {
        expect(() => inst.getAbiItem("transfer1")).throw("The contract doesn't contain \"transfer1\" function");
      })

      it("test transfer", function () {

        const data = inst.encode("transfer", "0x533243557dfdc87ae5bda885e22db00f87499971", "30000000000000000")
        expect(data).to.equal("0xa9059cbb000000000000000000000000533243557dfdc87ae5bda885e22db00f87499971000000000000000000000000000000000000000000000000006a94d74f430000")
        const decoded = EtherABI.decode(data);
        expect(decoded).to.deep.equal({
          name: 'transfer',
          params: [{
            name: '_to',
            value: '0x533243557dfdc87ae5bda885e22db00f87499971',
            type: 'address'
          },
          {
            name: '_value',
            value: '30000000000000000',
            type: 'uint256'
          }
          ]
        })
      })

      it("test approve", function () {
        const data = inst.encode("approve", "0x09344477fdc71748216a7b8bbe7f2013b893def8", "30000000000000000");
        expect(data).to.equal("0x095ea7b300000000000000000000000009344477fdc71748216a7b8bbe7f2013b893def8000000000000000000000000000000000000000000000000006a94d74f430000")
        const decoded = EtherABI.decode(data);
        expect(decoded).to.deep.equal({
          name: 'approve',
          params: [{
            name: '_spender',
            value: '0x09344477fdc71748216a7b8bbe7f2013b893def8',
            type: 'address'
          },
          {
            name: '_value',
            value: '30000000000000000',
            type: 'uint256'
          }
          ]
        })
      })

      it("test transferFrom", function () {
        const data = inst.encode("transferFrom", "0x09344477fdc71748216a7b8bbe7f2013b893def8", "0xae832592b6d697cd6b3d053866bfe5f334e7c667", "30000000000000000");
        expect(data).to.equal("0x23b872dd00000000000000000000000009344477fdc71748216a7b8bbe7f2013b893def8000000000000000000000000ae832592b6d697cd6b3d053866bfe5f334e7c667000000000000000000000000000000000000000000000000006a94d74f430000")
        const decoded = EtherABI.decode(data);
        expect(decoded).to.deep.equal({
          name: 'transferFrom',
          params: [{
            name: '_from',
            value: '0x09344477fdc71748216a7b8bbe7f2013b893def8',
            type: 'address'
          },
          {
            name: '_to',
            value: '0xae832592b6d697cd6b3d053866bfe5f334e7c667',
            type: 'address'
          },
          {
            name: '_value',
            value: '30000000000000000',
            type: 'uint256'
          }
          ]
        })
      })

      it("test Tansfer event", function () {
        const logs = [{
          event_name: "",
          data: "0x00000000000000000000000000000000000000000000017aedbc9d648c780000",
          address: "0x3b0b89bc54ecfc0c96ae8a99dc3ac54321b7162c",
          log_index: 25,
          topics: ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "0x0000000000000000000000000f4e07ce7a30d623c8d8bcd947be9fe85db53b56", "0x000000000000000000000000b74768b8b190b0728c7943b1d5f935ffe3f471b1"]
        }];

        const decodedLogs = EtherABI.decodeLogs(logs);
        expect(decodedLogs).to.deep.equal([{
          event_name: "",
          data: "0x00000000000000000000000000000000000000000000017aedbc9d648c780000",
          address: "0x3b0b89bc54ecfc0c96ae8a99dc3ac54321b7162c",
          log_index: 25,
          topics: ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "0x0000000000000000000000000f4e07ce7a30d623c8d8bcd947be9fe85db53b56", "0x000000000000000000000000b74768b8b190b0728c7943b1d5f935ffe3f471b1"],
          events: [{ "name": "_from", "type": "address", "value": "0x0f4e07ce7a30d623c8d8bcd947be9fe85db53b56" },
          { "name": "_to", "type": "address", "value": "0xb74768b8b190b0728c7943b1d5f935ffe3f471b1" },
          { "name": "_value", "type": "uint256", "value": "6990000000000000000000" }],
          "name": "Transfer"
        }]);

        let decoded = EtherABI.decodeLogs([{
          address: "0x55f287e77274deb12c798c039da92dd653b025ab",
          topics: ["0x61ae36884f77dd2a5df3261882e2f207a9c5b7a3ff4754f766f3151c247c2ba0", "0x0000000000000000000000004290e523da8c47ead9c7b60f3231cae7bf6af18b", "0x00000000000000000000000062c456b0e3c836e52844823c9e956c2360efe2e8"],
          event_name: "",
          log_index: 78,
          data: "0x0000000000000000000000000000000000000000000000000000000000000001"
        },
        {
          address: "0x55f287e77274deb12c798c039da92dd653b025ab",
          topics: ["0x88ad9237c84c60e60a52303b08fbc1f0dddaf442c6425eca4f5e2b0a40f0303f", "0x00000000000000000000000062c456b0e3c836e52844823c9e956c2360efe2e8", "0x0000000000000000000000004290e523da8c47ead9c7b60f3231cae7bf6af18b"],
          event_name: "",
          log_index: 79,
          data: "0x"
        }]
        )

        expect(decoded).to.deep.equal([{
          address: "0x55f287e77274deb12c798c039da92dd653b025ab",
          topics: ["0x61ae36884f77dd2a5df3261882e2f207a9c5b7a3ff4754f766f3151c247c2ba0", "0x0000000000000000000000004290e523da8c47ead9c7b60f3231cae7bf6af18b", "0x00000000000000000000000062c456b0e3c836e52844823c9e956c2360efe2e8"],
          event_name: "",
          log_index: 78,
          data: "0x0000000000000000000000000000000000000000000000000000000000000001"
        },
        {
          address: "0x55f287e77274deb12c798c039da92dd653b025ab",
          topics: ["0x88ad9237c84c60e60a52303b08fbc1f0dddaf442c6425eca4f5e2b0a40f0303f", "0x00000000000000000000000062c456b0e3c836e52844823c9e956c2360efe2e8", "0x0000000000000000000000004290e523da8c47ead9c7b60f3231cae7bf6af18b"],
          event_name: "",
          log_index: 79,
          data: "0x"
        }]);

        EtherABI.addABI([{
          anonymous: false,
          inputs: [{
            indexed: true,
            name: "_token",
            type: "address"
          },
          {
            indexed: true,
            name: "_user",
            type: "address"
          },
          {
            indexed: false,
            name: "_jthash",
            type: "bytes32"
          },
          {
            indexed: false,
            name: "_amount",
            type: "uint256"
          },
          {
            indexed: false,
            name: "_balance",
            type: "uint256"
          }
          ],
          name: "Withdraw",
          type: "event"
        }])

        decoded = EtherABI.decodeLogs([{
          address: "0x37304b0ab297f13f5520c523102797121182fb5b",
          topics: ["0xd0a6f018d0e9629a13bfeb9c60fd1bd8422531c157615dd2b75f0416f9255d98", "0x000000000000000000000000f51920ab64b5e5cf1bd06ed53899ad85eadc8c2a"],
          event_name: "LogBalanceChange",
          log_index: 141,
          data: "0x00000000000000000000000000000000000000000000000001f9fdf31d7f7ab000000000000000000000000000000000000000000000000001014d520f387ab1"
        },
        {
          address: "0x37304b0ab297f13f5520c523102797121182fb5b",
          topics: ["0xd0a6f018d0e9629a13bfeb9c60fd1bd8422531c157615dd2b75f0416f9255d98",
            "0x000000000000000000000000352e48eac00d833b09953397788f4030b6d12b06"],
          event_name: "LogBalanceChange",
          log_index: 142,
          data: "0x00000000000000000000000000000000000000000000000041e0416bae3ef385000000000000000000000000000000000000000000000000410c6896a2156ec8"
        },
        {
          address: "0x37304b0ab297f13f5520c523102797121182fb5b",
          topics: ["0xd5db3fe23370479a78dc47612ce8be2c8c0ae30d3f255129af35fe3f852b9656", "0x000000000000000000000000f51920ab64b5e5cf1bd06ed53899ad85eadc8c2a",
            "0x000000000000000000000000352e48eac00d833b09953397788f4030b6d12b06",
            "0x168f423f0d2ab06628261b7c4c6c260b1a7cbd585791f93b8e5e3649ff29320c"],
          event_name: "LogTrade",
          log_index: 143,
          data: "0xe2f6386e735005c9bc100cea6857e053e84f083ecb8158c31a237e686732ae780000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003600000000000000000000000000000000000000000000000000f8b0a10e47000000000000000000000000000000000000000000000000000001cc89761a7084bc00000000000000000000000000000000000000000000000000d3d8d50c2984bdfffffffffffffffffffffffffffffffffffffffffffffffffe337689e58f7b44"
        }])

        expect(decoded).to.deep.equal([{
          address: "0x37304b0ab297f13f5520c523102797121182fb5b",
          topics: ["0xd0a6f018d0e9629a13bfeb9c60fd1bd8422531c157615dd2b75f0416f9255d98", "0x000000000000000000000000f51920ab64b5e5cf1bd06ed53899ad85eadc8c2a"],
          event_name: "LogBalanceChange",
          log_index: 141,
          data: "0x00000000000000000000000000000000000000000000000001f9fdf31d7f7ab000000000000000000000000000000000000000000000000001014d520f387ab1"
        },
        {
          address: "0x37304b0ab297f13f5520c523102797121182fb5b",
          topics: ["0xd0a6f018d0e9629a13bfeb9c60fd1bd8422531c157615dd2b75f0416f9255d98",
            "0x000000000000000000000000352e48eac00d833b09953397788f4030b6d12b06"],
          event_name: "LogBalanceChange",
          log_index: 142,
          data: "0x00000000000000000000000000000000000000000000000041e0416bae3ef385000000000000000000000000000000000000000000000000410c6896a2156ec8"
        },
        {
          address: "0x37304b0ab297f13f5520c523102797121182fb5b",
          topics: ["0xd5db3fe23370479a78dc47612ce8be2c8c0ae30d3f255129af35fe3f852b9656", "0x000000000000000000000000f51920ab64b5e5cf1bd06ed53899ad85eadc8c2a",
            "0x000000000000000000000000352e48eac00d833b09953397788f4030b6d12b06",
            "0x168f423f0d2ab06628261b7c4c6c260b1a7cbd585791f93b8e5e3649ff29320c"],
          event_name: "LogTrade",
          log_index: 143,
          data: "0xe2f6386e735005c9bc100cea6857e053e84f083ecb8158c31a237e686732ae780000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003600000000000000000000000000000000000000000000000000f8b0a10e47000000000000000000000000000000000000000000000000000001cc89761a7084bc00000000000000000000000000000000000000000000000000d3d8d50c2984bdfffffffffffffffffffffffffffffffffffffffffffffffffe337689e58f7b44"
        }]);
      })

      it("throw error if doesn't contain function", function () {
        expect(() => inst.encode("test")).throw('The contract doesn\'t contain "test" function');
      })

      // it("throw error if decoded data contains 'NaN'", function () {
      //   expect(() => inst.encode("transfer", "533243557dfdc87ae5bda885e22db00f87499971", "30000000000000000")).throw('The encoded data contains "NaN", please check the input arguments');
      // })
    })
  })

  describe("test abi of erc721", function () {

    describe("test encode & decode", function () {
      const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
      var MyContract = new web3.eth.Contract(erc721ABI, "0x1b9bae18532eeb8cd4316a20678a0c43f28f0ae2");
      const inst = new EtherABI(MyContract);
      before(function () {
        EtherABI.addABI(erc721ABI);
      });

      after(function () {
        EtherABI.removeABI(erc721ABI);
      });

      it("test safeTransferFrom without data", function () {

        const data = inst.encode("safeTransferFrom", "0xae832592b6d697cd6b3d053866bfe5f334e7c667", "0x533243557dfdc87ae5bda885e22db00f87499971", 1);
        expect(data).to.equal("0x42842e0e000000000000000000000000ae832592b6d697cd6b3d053866bfe5f334e7c667000000000000000000000000533243557dfdc87ae5bda885e22db00f874999710000000000000000000000000000000000000000000000000000000000000001")
        expect(EtherABI.decode(data)).to.deep.equal({
          name: 'safeTransferFrom',
          params: [{
            name: '_from',
            value: '0xae832592b6d697cd6b3d053866bfe5f334e7c667',
            type: 'address'
          },
          {
            name: '_to',
            value: '0x533243557dfdc87ae5bda885e22db00f87499971',
            type: 'address'
          },
          {
            name: '_tokenId',
            value: '1',
            type: 'uint256'
          }
          ]
        })
      })

      it("test safeTransferFrom with data", function () {
        const data = inst.encode("safeTransferFrom", "0xae832592b6d697cd6b3d053866bfe5f334e7c667", "0x533243557dfdc87ae5bda885e22db00f87499971", 1, "0xaa");
        expect(data).to.equal("0xb88d4fde000000000000000000000000ae832592b6d697cd6b3d053866bfe5f334e7c667000000000000000000000000533243557dfdc87ae5bda885e22db00f87499971000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000001aa00000000000000000000000000000000000000000000000000000000000000")
        expect(EtherABI.decode(data)).to.deep.equal({
          name: 'safeTransferFrom',
          params: [{
            name: '_from',
            value: '0xae832592b6d697cd6b3d053866bfe5f334e7c667',
            type: 'address'
          },
          {
            name: '_to',
            value: '0x533243557dfdc87ae5bda885e22db00f87499971',
            type: 'address'
          },
          {
            name: '_tokenId',
            value: '1',
            type: 'uint256'
          },
          {
            name: '_data',
            value: '0xaa',
            type: 'bytes'
          }
          ]
        })
      })

      it("test safeTransferFrom with data for getAbiItem", function () {
        const data = inst.getAbiItem("safeTransferFrom", "0xae832592b6d697cd6b3d053866bfe5f334e7c667", "0x533243557dfdc87ae5bda885e22db00f87499971", 1, "0xaa");
        expect(data.name).to.equal("safeTransferFrom")
      })

      it("test mint", function () {
        const data = inst.encode("mint", "0x533243557dfdc87ae5bda885e22db00f87499971", 1, "https://jccdex.cn/1")
        expect(data).to.equal("0xd3fc9864000000000000000000000000533243557dfdc87ae5bda885e22db00f8749997100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000001368747470733a2f2f6a63636465782e636e2f3100000000000000000000000000")
        expect(EtherABI.decode(data)).to.deep.equal({
          name: 'mint',
          params: [{
            name: '_to',
            value: '0x533243557dfdc87ae5bda885e22db00f87499971',
            type: 'address'
          },
          {
            name: '_tokenId',
            value: '1',
            type: 'uint256'
          },
          {
            name: '_uri',
            value: 'https://jccdex.cn/1',
            type: 'string'
          }
          ]
        })
      })

      it("test burn", function () {
        const data = inst.encode("burn", "0x533243557dfdc87ae5bda885e22db00f87499971", 1)
        expect(data).to.equal("0x9dc29fac000000000000000000000000533243557dfdc87ae5bda885e22db00f874999710000000000000000000000000000000000000000000000000000000000000001")
        expect(EtherABI.decode(data)).to.deep.equal({
          name: 'burn',
          params: [{
            name: '_owner',
            value: '0x533243557dfdc87ae5bda885e22db00f87499971',
            type: 'address'
          },
          {
            name: '_tokenId',
            value: '1',
            type: 'uint256'
          }
          ]
        })
      })

      it("test transferFrom", function () {
        const data = inst.encode("transferFrom", "0xae832592b6d697cd6b3d053866bfe5f334e7c667", "0x533243557dfdc87ae5bda885e22db00f87499971", 1)
        expect(data).to.equal("0x23b872dd000000000000000000000000ae832592b6d697cd6b3d053866bfe5f334e7c667000000000000000000000000533243557dfdc87ae5bda885e22db00f874999710000000000000000000000000000000000000000000000000000000000000001")
        expect(EtherABI.decode(data)).to.deep.equal({
          name: 'transferFrom',
          params: [{
            name: '_from',
            value: '0xae832592b6d697cd6b3d053866bfe5f334e7c667',
            type: 'address'
          },
          {
            name: '_to',
            value: '0x533243557dfdc87ae5bda885e22db00f87499971',
            type: 'address'
          },
          {
            name: '_tokenId',
            value: '1',
            type: 'uint256'
          }
          ]
        })
      })

      it("test approve", function () {
        const data = inst.encode("approve", "0x533243557dfdc87ae5bda885e22db00f87499971", 1)
        expect(data).to.equal("0x095ea7b3000000000000000000000000533243557dfdc87ae5bda885e22db00f874999710000000000000000000000000000000000000000000000000000000000000001")
        expect(EtherABI.decode(data)).to.deep.equal({
          name: 'approve',
          params: [{
            name: '_approved',
            value: '0x533243557dfdc87ae5bda885e22db00f87499971',
            type: 'address'
          },
          {
            name: '_tokenId',
            value: '1',
            type: 'uint256'
          }
          ]
        })
      })

      it("test setApprovalForAll", function () {
        const data = inst.encode("setApprovalForAll", "0x533243557dfdc87ae5bda885e22db00f87499971", true)
        expect(data).to.equal("0xa22cb465000000000000000000000000533243557dfdc87ae5bda885e22db00f874999710000000000000000000000000000000000000000000000000000000000000001")
        expect(EtherABI.decode(data)).to.deep.equal({
          name: 'setApprovalForAll',
          params: [{
            name: '_operator',
            value: '0x533243557dfdc87ae5bda885e22db00f87499971',
            type: 'address'
          },
          {
            name: '_approved',
            value: true,
            type: 'bool'
          }
          ]
        })
      })

      it("throw error if number of arguments is invalid", function () {
        expect(() => inst.encode("safeTransferFrom", "0x533243557dfdc87ae5bda885e22db00f87499971", true)).throw('Invalid number of arguments to Solidity function');
      })

      it("throw error if number of arguments is invalid", function () {
        expect(() => inst.getAbiItem("safeTransferFrom", "0x533243557dfdc87ae5bda885e22db00f87499971", true)).throw('Invalid number of arguments to Solidity function');
      })
    })
  })

})