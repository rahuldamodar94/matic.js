const Matic = require('../../lib/index').default
const config = require('./config')

const amount = '9000000000000000' // amount in wei
const from = config.FROM_ADDRESS // from address

// Create object of Matic
const matic = new Matic({
  maticProvider: config.MATIC_PROVIDER,
  parentProvider: config.PARENT_PROVIDER,
  rootChainAddress: config.ROOTCHAIN_ADDRESS,
  syncerUrl: config.SYNCER_URL,
  watcherUrl: config.WATCHER_URL,
})

matic.wallet = config.PRIVATE_KEY // prefix with `0x`

// Approve token

// Deposit tokens
matic.depositEthers({
  from,
  value: amount,
  onTransactionHash: () => {
    // action on Transaction success
  },
})
