import BN from 'bn.js'

import Web3Client from './Web3Client'

import { address } from '../types/Common'

import posChildERC20Artifact from 'matic-pos-portal/artifacts/ChildERC20.json'
import posChildERC721Artifact from 'matic-pos-portal/artifacts/ChildERC721.json'
import posChildERC1155Artifact from 'matic-pos-portal/artifacts/ChildERC1155.json'

export default class ContractsBase {
  static MATIC_CHILD_TOKEN: address = '0x0000000000000000000000000000000000001010'

  web3Client: Web3Client
  network: any

  constructor(web3Client: Web3Client, network: any) {
    this.web3Client = web3Client
    this.network = network
  }

  public encode(number: BN | string | number) {
    if (typeof number === 'number') {
      number = new BN(number)
    } else if (typeof number === 'string') {
      if (number.slice(0, 2) === '0x') return number
      number = new BN(number)
    }
    if (BN.isBN(number)) {
      return '0x' + number.toString(16)
    }
  }

  public getERC20TokenContract(token: address, parent: boolean = false) {
    const web3 = parent ? this.web3Client.parentWeb3 : this.web3Client.web3
    return new web3.eth.Contract(this.network.abi('ChildERC20'), token)
  }

  public getRedditTokenContract(token: address, parent: boolean = false) {
    const web3 = parent ? this.web3Client.parentWeb3 : this.web3Client.web3
    return new web3.eth.Contract(
      [
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'owner',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'spender',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'value',
              type: 'uint256',
            },
          ],
          name: 'Approval',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'operator',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'tokenHolder',
              type: 'address',
            },
          ],
          name: 'AuthorizedOperator',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'operator',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'from',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
            },
            {
              indexed: false,
              internalType: 'bytes',
              name: 'operatorData',
              type: 'bytes',
            },
          ],
          name: 'Burned',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'operator',
              type: 'address',
            },
          ],
          name: 'DefaultOperatorAdded',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'operator',
              type: 'address',
            },
          ],
          name: 'DefaultOperatorRemoved',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'token',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'from',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'input1',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'output1',
              type: 'uint256',
            },
          ],
          name: 'Deposit',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'token',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'from',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'input1',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'input2',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'output1',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'output2',
              type: 'uint256',
            },
          ],
          name: 'LogTransfer',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'operator',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
            },
            {
              indexed: false,
              internalType: 'bytes',
              name: 'operatorData',
              type: 'bytes',
            },
          ],
          name: 'Minted',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'previousOwner',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'newOwner',
              type: 'address',
            },
          ],
          name: 'OwnershipTransferred',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'operator',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'tokenHolder',
              type: 'address',
            },
          ],
          name: 'RevokedOperator',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'operator',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'from',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
            },
            {
              indexed: false,
              internalType: 'bytes',
              name: 'operatorData',
              type: 'bytes',
            },
          ],
          name: 'Sent',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'from',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'value',
              type: 'uint256',
            },
          ],
          name: 'Transfer',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: 'address',
              name: 'token',
              type: 'address',
            },
            {
              indexed: true,
              internalType: 'address',
              name: 'from',
              type: 'address',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'input1',
              type: 'uint256',
            },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'output1',
              type: 'uint256',
            },
          ],
          name: 'Withdraw',
          type: 'event',
        },
        {
          constant: false,
          inputs: [
            {
              internalType: 'address',
              name: 'operator',
              type: 'address',
            },
          ],
          name: 'addDefaultOperator',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          constant: true,
          inputs: [
            {
              internalType: 'address',
              name: 'owner',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'spender',
              type: 'address',
            },
          ],
          name: 'allowance',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
        {
          constant: false,
          inputs: [
            {
              internalType: 'address',
              name: 'spender',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
          ],
          name: 'approve',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          constant: false,
          inputs: [
            {
              internalType: 'address',
              name: 'operator',
              type: 'address',
            },
          ],
          name: 'authorizeOperator',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          constant: true,
          inputs: [
            {
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
          ],
          name: 'balanceOf',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
        {
          constant: false,
          inputs: [
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
            {
              internalType: 'bytes',
              name: 'userData',
              type: 'bytes',
            },
          ],
          name: 'burn',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          constant: true,
          inputs: [],
          name: 'childChain',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
        {
          constant: false,
          inputs: [
            {
              internalType: 'address',
              name: 'spender',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'subtractedValue',
              type: 'uint256',
            },
          ],
          name: 'decreaseAllowance',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          constant: true,
          inputs: [],
          name: 'defaultOperators',
          outputs: [
            {
              internalType: 'address[]',
              name: '',
              type: 'address[]',
            },
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
        {
          constant: false,
          inputs: [
            {
              internalType: 'address',
              name: 'user',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
          ],
          name: 'deposit',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          constant: true,
          inputs: [],
          name: 'distributionContract',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
        {
          constant: false,
          inputs: [
            {
              internalType: 'address',
              name: 'spender',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'addedValue',
              type: 'uint256',
            },
          ],
          name: 'increaseAllowance',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          constant: false,
          inputs: [
            {
              internalType: 'address',
              name: 'sender',
              type: 'address',
            },
          ],
          name: 'initialize',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          constant: false,
          inputs: [
            {
              internalType: 'address',
              name: 'owner_',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'distributionContract_',
              type: 'address',
            },
            {
              internalType: 'string',
              name: 'subreddit_',
              type: 'string',
            },
            {
              internalType: 'string',
              name: 'name_',
              type: 'string',
            },
            {
              internalType: 'string',
              name: 'symbol_',
              type: 'string',
            },
            {
              internalType: 'address[]',
              name: 'defaultOperators_',
              type: 'address[]',
            },
            {
              internalType: 'address',
              name: '_rootToken',
              type: 'address',
            },
            {
              internalType: 'address',
              name: '_childChain',
              type: 'address',
            },
          ],
          name: 'initializecontract',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          constant: true,
          inputs: [
            {
              internalType: 'address',
              name: 'operator',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'tokenHolder',
              type: 'address',
            },
          ],
          name: 'isOperatorFor',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
        {
          constant: true,
          inputs: [],
          name: 'isOwner',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
        {
          constant: false,
          inputs: [
            {
              internalType: 'address',
              name: 'operator',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
            {
              internalType: 'bytes',
              name: 'userData',
              type: 'bytes',
            },
            {
              internalType: 'bytes',
              name: 'operatorData',
              type: 'bytes',
            },
          ],
          name: 'mint',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          constant: true,
          inputs: [],
          name: 'name',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
        {
          constant: false,
          inputs: [
            {
              internalType: 'address',
              name: 'account',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
            {
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
            },
            {
              internalType: 'bytes',
              name: 'operatorData',
              type: 'bytes',
            },
          ],
          name: 'operatorBurn',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          constant: false,
          inputs: [
            {
              internalType: 'address',
              name: 'sender',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'recipient',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
            {
              internalType: 'bytes',
              name: 'userData',
              type: 'bytes',
            },
            {
              internalType: 'bytes',
              name: 'operatorData',
              type: 'bytes',
            },
          ],
          name: 'operatorSend',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          constant: true,
          inputs: [],
          name: 'owner',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
        {
          constant: false,
          inputs: [
            {
              internalType: 'address',
              name: 'operator',
              type: 'address',
            },
          ],
          name: 'removeDefaultOperator',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          constant: false,
          inputs: [],
          name: 'renounceOwnership',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          constant: false,
          inputs: [
            {
              internalType: 'address',
              name: 'operator',
              type: 'address',
            },
          ],
          name: 'revokeOperator',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          constant: true,
          inputs: [],
          name: 'rootToken',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
        {
          constant: true,
          inputs: [],
          name: 'subreddit',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
        {
          constant: true,
          inputs: [],
          name: 'symbol',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
        {
          constant: true,
          inputs: [],
          name: 'totalSupply',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
        {
          constant: false,
          inputs: [
            {
              internalType: 'address',
              name: 'recipient',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
          ],
          name: 'transfer',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          constant: false,
          inputs: [
            {
              internalType: 'address',
              name: 'sender',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'recipient',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
          ],
          name: 'transferFrom',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          constant: false,
          inputs: [
            {
              internalType: 'address',
              name: 'newOwner',
              type: 'address',
            },
          ],
          name: 'transferOwnership',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          constant: false,
          inputs: [
            {
              internalType: 'address',
              name: 'distributionContract_',
              type: 'address',
            },
          ],
          name: 'updateDistributionContract',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      token
    )
  }

  public getERC721TokenContract(token: address, parent: boolean = false) {
    const web3 = parent ? this.web3Client.parentWeb3 : this.web3Client.web3
    return new web3.eth.Contract(this.network.abi('ChildERC721'), token)
  }

  public getChildMaticContract() {
    return new this.web3Client.web3.eth.Contract(this.network.abi('MRC20'), ContractsBase.MATIC_CHILD_TOKEN)
  }

  public getPOSERC20TokenContract(token: address, parent: boolean = false) {
    const web3 = parent ? this.web3Client.parentWeb3 : this.web3Client.web3
    return new web3.eth.Contract(posChildERC20Artifact.abi, token)
  }

  public getPOSERC721TokenContract(token: address, parent: boolean = false) {
    const web3 = parent ? this.web3Client.parentWeb3 : this.web3Client.web3
    return new web3.eth.Contract(posChildERC721Artifact.abi, token)
  }

  public getPOSERC1155TokenContract(token: address, parent: boolean = false) {
    const web3 = parent ? this.web3Client.parentWeb3 : this.web3Client.web3
    return new web3.eth.Contract(posChildERC1155Artifact.abi, token)
  }
}
