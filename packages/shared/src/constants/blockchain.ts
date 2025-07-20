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
  },
  EARNEST_MONEY: {
    DEPOSIT: 'deposit-earnest-money',
    RELEASE: 'release-earnest-money',
    REFUND: 'refund-earnest-money',
    GET_BALANCE: 'get-balance',
  },
} as const;

export const BLOCKCHAIN_EVENTS = {
  PROPERTY_REGISTERED: 'property-registered',
  OWNERSHIP_TRANSFERRED: 'ownership-transferred',
  EARNEST_MONEY_DEPOSITED: 'earnest-money-deposited',
  EARNEST_MONEY_RELEASED: 'earnest-money-released',
  CONTRACT_DEPLOYED: 'contract-deployed',
} as const;
