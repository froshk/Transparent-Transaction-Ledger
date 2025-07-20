export interface BlockchainTransaction {
  txId: string;
  contractAddress: string;
  functionName: string;
  sender: string;
  status: BlockchainTxStatus;
  blockHeight?: number;
  timestamp: Date;
  gasUsed?: number;
  fee?: number;
}

export enum BlockchainTxStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
}

export interface SmartContractCall {
  contractAddress: string;
  functionName: string;
  functionArgs: any[];
  senderAddress: string;
  network: StacksNetwork;
}

export enum StacksNetwork {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
  DEVNET = 'devnet',
}

export interface PropertyOnChain {
  propertyId: string;
  currentOwner: string;
  registrationTxId: string;
  lastUpdateTxId: string;
  isActive: boolean;
}

export interface EarnestMoneyContract {
  contractAddress: string;
  transactionId: string;
  buyerAddress: string;
  sellerAddress: string;
  amount: number;
  isReleased: boolean;
  releaseConditionsMet: boolean;
  createdAt: Date;
}

export interface ContractDeployment {
  contractName: string;
  contractAddress: string;
  deployerAddress: string;
  deploymentTxId: string;
  network: StacksNetwork;
  deployedAt: Date;
}
