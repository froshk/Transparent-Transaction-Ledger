export const APP_CONFIG = {
  NAME: 'Transparent Transaction Ledger',
  DESCRIPTION: 'Blockchain-powered real estate transactions',
  VERSION: '1.0.0',
  AUTHOR: 'TTL Development Team',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE: '/users/update',
  },
  TRANSACTIONS: {
    LIST: '/transactions',
    CREATE: '/transactions',
    DETAIL: '/transactions/:id',
    UPDATE: '/transactions/:id',
    TIMELINE: '/transactions/:id/timeline',
  },
  PROPERTIES: {
    LIST: '/properties',
    CREATE: '/properties',
    DETAIL: '/properties/:id',
    HISTORY: '/properties/:id/history',
  },
  BLOCKCHAIN: {
    DEPLOY_CONTRACT: '/blockchain/deploy',
    CALL_CONTRACT: '/blockchain/call',
    TRANSACTION_STATUS: '/blockchain/transaction/:txId',
  },
} as const;

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 255,
} as const;
