export const STACKS_CONFIG = {
  NETWORKS: {
    MAINNET: {
      url: 'https://stacks-node-api.mainnet.stacks.co',
      name: 'mainnet',
    },
    TESTNET: {
      url: 'https://stacks-node-api.testnet.stacks.co',
      name: 'testnet',
    },
    DEVNET: {
      url: 'http://localhost:3999',
      name: 'devnet',
    },
  },
  CONTRACTS: {
    PROPERTY_REGISTRY: 'property-registry',
    EARNEST_MONEY: 'earnest-money',
    TITLE_TRANSFER: 'title-transfer',
  },
  TRANSACTION_FEES: {
    DEFAULT: 1000, // microSTX
    PRIORITY: 2000, // microSTX
  },
} as const;

export const SMART_CONTRACT_FUNCTIONS = {
  PROPERTY_REGISTRY: {
    REGISTER_PROPERTY: 'register-property',
    TRANSFER_OWNERSHIP: 'transfer-ownership',
    GET_PROPERTY: 'get-property',
    GET_OWNER: 'get-owner',
    ADD_ENCUMBRANCE: 'add-encumbrance',
    REMOVE_ENCUMBRANCE: 'remove-encumbrance',
    UPDATE_PROPERTY_STATUS: 'update-property-status',
    GET_ENCUMBRANCE: 'get-encumbrance',
    HAS_ACTIVE_ENCUMBRANCES: 'has-active-encumbrances',
    IS_PROPERTY_CLEAR_FOR_TRANSFER: 'is-property-clear-for-transfer',
    GET_ENCUMBRANCE_COUNT: 'get-encumbrance-count',
  },
  EARNEST_MONEY: {
    DEPOSIT: 'deposit-earnest-money',
    RELEASE: 'release-earnest-money',
    REFUND: 'refund-earnest-money',
    MARK_CONDITIONS_MET: 'mark-conditions-met',
    GET_BALANCE: 'get-escrow-balance',
    GET_ESCROW: 'get-escrow',
    GET_ESCROW_BY_TRANSACTION: 'get-escrow-by-transaction',
  },
} as const;

export const BLOCKCHAIN_EVENTS = {
  PROPERTY_REGISTERED: 'property-registered',
  OWNERSHIP_TRANSFERRED: 'ownership-transferred',
  ENCUMBRANCE_ADDED: 'encumbrance-added',
  ENCUMBRANCE_REMOVED: 'encumbrance-removed',
  PROPERTY_ACTIVATED: 'property-activated',
  PROPERTY_DEACTIVATED: 'property-deactivated',
  EARNEST_MONEY_DEPOSITED: 'earnest-money-deposited',
  EARNEST_MONEY_RELEASED: 'earnest-money-released',
  EARNEST_MONEY_REFUNDED: 'earnest-money-refunded',
  CONDITIONS_MARKED_MET: 'conditions-marked-met',
  CONTRACT_DEPLOYED: 'contract-deployed',
} as const;
