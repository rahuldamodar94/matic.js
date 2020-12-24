import BN from 'bn.js'
import assert from 'assert'
import ethUtils from 'ethereumjs-util'
import fetch from 'node-fetch'

import Web3Client from './Web3Client'
import ContractsBase from './ContractsBase'
import RootChain from '../root/RootChain'
import { MaticClientInitializationOptions } from '../types/Common'
import Proofs from '../libs/ProofsUtil'

import Web3 from 'web3'
const web3 = new Web3()
const hash: Web3['utils']['soliditySha3'] = web3.utils.soliditySha3

const logger = {
  info: require('debug')('maticjs:WithdrawManager'),
  debug: require('debug')('maticjs:debug:WithdrawManager'),
}

export default class ExitManager extends ContractsBase {
  private rootChain: RootChain
  private networkApiUrl

  constructor(rootChain: RootChain, options: MaticClientInitializationOptions, web3Client: Web3Client) {
    super(web3Client, options.network)
    this.rootChain = rootChain
    this.networkApiUrl = options.network.Matic.NetworkAPI
  }

  async buildPayloadForExit(burnTxHash, logEventSig) {
    // check checkpoint
    const lastChildBlock = await this.rootChain.getLastChildBlock()
    const burnTx = await this.web3Client.getMaticWeb3().eth.getTransaction(burnTxHash)
    const receipt = await this.web3Client.getMaticWeb3().eth.getTransactionReceipt(burnTxHash)
    const block: any = await this.web3Client
      .getMaticWeb3()
      .eth.getBlock(burnTx.blockNumber, true /* returnTransactionObjects */)

    logger.info({ 'burnTx.blockNumber': burnTx.blockNumber, lastCheckPointedBlockNumber: lastChildBlock })
    assert.ok(
      new BN(lastChildBlock).gte(new BN(burnTx.blockNumber)),
      'Burn transaction has not been checkpointed as yet'
    )
    const headerBlockNumber = await this.rootChain.findHeaderBlockNumber(burnTx.blockNumber)
    const headerBlock = await this.web3Client.call(
      this.rootChain.rootChain.methods.headerBlocks(this.encode(headerBlockNumber))
    )
    logger.info({ headerBlockNumber: headerBlockNumber.toString(), headerBlock })

    // build block proof
    const blockProof = await Proofs.buildBlockProof(
      this.web3Client.getMaticWeb3(),
      parseInt(headerBlock.start, 10),
      parseInt(headerBlock.end, 10),
      parseInt(burnTx.blockNumber + '', 10)
    )

    const receiptProof: any = await Proofs.getReceiptProof(receipt, block, this.web3Client.getMaticWeb3())

    const logIndex = receipt.logs.findIndex(log => log.topics[0].toLowerCase() == logEventSig.toLowerCase())
    assert.ok(logIndex > -1, 'Log not found in receipt')

    return this._encodePayload(
      headerBlockNumber,
      blockProof,
      burnTx.blockNumber,
      block.timestamp,
      Buffer.from(block.transactionsRoot.slice(2), 'hex'),
      Buffer.from(block.receiptsRoot.slice(2), 'hex'),
      Proofs.getReceiptBytes(receipt), // rlp encoded
      receiptProof.parentNodes,
      receiptProof.path,
      logIndex
    )
  }

  async buildPayloadForExitHermoine(burnTxHash, logEventSig) {
    // check checkpoint
    const lastChildBlock = await this.rootChain.getLastChildBlock()
    const receipt = await this.web3Client.getMaticWeb3().eth.getTransactionReceipt(burnTxHash)
    const block: any = await this.web3Client
      .getMaticWeb3()
      .eth.getBlock(receipt.blockNumber, true /* returnTransactionObjects */)
    logger.info({ 'receipt.blockNumber': receipt.blockNumber, lastCheckPointedBlockNumber: lastChildBlock })
    assert.ok(
      new BN(lastChildBlock).gte(new BN(receipt.blockNumber)),
      'Burn transaction has not been checkpointed as yet'
    )
    let blockIncludedResponse = await fetch(this.networkApiUrl + '/block-included/' + receipt.blockNumber)
    let headerBlock = await blockIncludedResponse.json()
    // build block proof

    const start = parseInt(headerBlock.start, 10)
    const end = parseInt(headerBlock.end, 10)
    const number = parseInt(receipt.blockNumber + '', 10)
    let blockProofResponse = await fetch(`${this.networkApiUrl}/block-proof?start=${start}&end=${end}&number=${number}`)
    const blockProof = (await blockProofResponse.json()).proof

    const receiptProof: any = await Proofs.getReceiptProof(receipt, block, this.web3Client.getMaticWeb3())
    const logIndex = receipt.logs.findIndex(log => log.topics[0].toLowerCase() == logEventSig.toLowerCase())
    assert.ok(logIndex > -1, 'Log not found in receipt')
    return this._encodePayload(
      headerBlock.headerBlockNumber,
      blockProof,
      receipt.blockNumber,
      block.timestamp,
      Buffer.from(block.transactionsRoot.slice(2), 'hex'),
      Buffer.from(block.receiptsRoot.slice(2), 'hex'),
      Proofs.getReceiptBytes(receipt), // rlp encoded
      receiptProof.parentNodes,
      receiptProof.path,
      logIndex
    )
  }

  async getExitHash(burnTxHash, logEventSig) {
    const lastChildBlock = await this.rootChain.getLastChildBlock()
    const receipt = await this.web3Client.getMaticWeb3().eth.getTransactionReceipt(burnTxHash)
    const block: any = await this.web3Client
      .getMaticWeb3()
      .eth.getBlock(receipt.blockNumber, true /* returnTransactionObjects */)

    assert.ok(
      new BN(lastChildBlock).gte(new BN(receipt.blockNumber)),
      'Burn transaction has not been checkpointed as yet'
    )

    const receiptProof: any = await Proofs.getReceiptProof(receipt, block, this.web3Client.getMaticWeb3())
    const logIndex = receipt.logs.findIndex(log => log.topics[0].toLowerCase() == logEventSig.toLowerCase())
    assert.ok(logIndex > -1, 'Log not found in receipt')

    const nibbleArr = []
    receiptProof.path.forEach(byte => {
      nibbleArr.push(Buffer.from('0' + (byte / 0x10).toString(16), 'hex'))
      nibbleArr.push(Buffer.from('0' + (byte % 0x10).toString(16), 'hex'))
    })

    return hash(receipt.blockNumber, ethUtils.bufferToHex(Buffer.concat(nibbleArr)), logIndex)
  }

  private _encodePayload(
    headerNumber,
    buildBlockProof,
    blockNumber,
    timestamp,
    transactionsRoot,
    receiptsRoot,
    receipt,
    receiptParentNodes,
    path,
    logIndex
  ) {
    return ethUtils.bufferToHex(
      ethUtils.rlp.encode([
        headerNumber,
        buildBlockProof,
        blockNumber,
        timestamp,
        ethUtils.bufferToHex(transactionsRoot),
        ethUtils.bufferToHex(receiptsRoot),
        ethUtils.bufferToHex(receipt),
        ethUtils.bufferToHex(ethUtils.rlp.encode(receiptParentNodes)),
        ethUtils.bufferToHex(Buffer.concat([Buffer.from('00', 'hex'), path])),
        logIndex,
      ])
    )
  }
}
