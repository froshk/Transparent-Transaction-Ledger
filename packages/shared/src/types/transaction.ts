export interface Transaction {
  id: string;
  propertyId: string;
  buyerId: string;
  sellerId: string;
  agentId?: string;
  status: TransactionStatus;
  offerAmount: number;
  earnestMoneyAmount: number;
  closingDate: Date;
  inspectionDate?: Date;
  blockchainTxId?: string;
  smartContractAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum TransactionStatus {
  OFFER_SUBMITTED = 'offer_submitted',
  OFFER_ACCEPTED = 'offer_accepted',
  INSPECTION_PENDING = 'inspection_pending',
  INSPECTION_COMPLETED = 'inspection_completed',
  EARNEST_MONEY_DEPOSITED = 'earnest_money_deposited',
  EARNEST_MONEY_RELEASED = 'earnest_money_released',
  CLOSING_PENDING = 'closing_pending',
  CLOSED = 'closed',
  CANCELLED = 'cancelled',
}

export interface TransactionTimeline {
  id: string;
  transactionId: string;
  event: TransactionEvent;
  description: string;
  timestamp: Date;
  userId?: string;
  blockchainTxId?: string;
}

export enum TransactionEvent {
  OFFER_SUBMITTED = 'offer_submitted',
  OFFER_ACCEPTED = 'offer_accepted',
  EARNEST_MONEY_DEPOSITED = 'earnest_money_deposited',
  INSPECTION_SCHEDULED = 'inspection_scheduled',
  INSPECTION_COMPLETED = 'inspection_completed',
  EARNEST_MONEY_RELEASED = 'earnest_money_released',
  DOCUMENT_UPLOADED = 'document_uploaded',
  DOCUMENT_SIGNED = 'document_signed',
  CLOSING_SCHEDULED = 'closing_scheduled',
  TRANSACTION_CLOSED = 'transaction_closed',
  TRANSACTION_CANCELLED = 'transaction_cancelled',
}

export interface CreateTransactionDto {
  propertyId: string;
  buyerId: string;
  sellerId: string;
  agentId?: string;
  offerAmount: number;
  earnestMoneyAmount: number;
  closingDate: Date;
  inspectionDate?: Date;
}
