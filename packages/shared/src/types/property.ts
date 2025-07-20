export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: PropertyType;
  currentOwnerId: string;
  blockchainPropertyId?: string;
  legalDescription: string;
  squareFootage?: number;
  lotSize?: number;
  yearBuilt?: number;
  bedrooms?: number;
  bathrooms?: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum PropertyType {
  RESIDENTIAL_SINGLE_FAMILY = 'residential_single_family',
  RESIDENTIAL_CONDO = 'residential_condo',
  RESIDENTIAL_TOWNHOUSE = 'residential_townhouse',
  COMMERCIAL_OFFICE = 'commercial_office',
  COMMERCIAL_RETAIL = 'commercial_retail',
  COMMERCIAL_INDUSTRIAL = 'commercial_industrial',
  LAND = 'land',
  MULTI_FAMILY = 'multi_family',
}

export interface PropertyHistory {
  id: string;
  propertyId: string;
  event: PropertyEvent;
  description: string;
  timestamp: Date;
  blockchainTxId?: string;
  documentHash?: string;
}

export enum PropertyEvent {
  PROPERTY_REGISTERED = 'property_registered',
  OWNERSHIP_TRANSFERRED = 'ownership_transferred',
  LIEN_ADDED = 'lien_added',
  LIEN_REMOVED = 'lien_removed',
  EASEMENT_ADDED = 'easement_added',
  ENCUMBRANCE_ADDED = 'encumbrance_added',
  ENCUMBRANCE_REMOVED = 'encumbrance_removed',
  TITLE_UPDATE = 'title_update',
}

export interface PropertyEncumbrance {
  id: string;
  propertyId: string;
  type: EncumbranceType;
  description: string;
  amount?: number;
  creditor?: string;
  recordedDate: Date;
  isActive: boolean;
  blockchainTxId?: string;
  recordedBy?: string;
  encumbranceId?: number; // On-chain encumbrance ID
}

export enum EncumbranceType {
  MORTGAGE = 'mortgage',
  LIEN = 'lien',
  EASEMENT = 'easement',
  COVENANT = 'covenant',
  RESTRICTION = 'restriction',
}

export interface CreatePropertyDto {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: PropertyType;
  currentOwnerId: string;
  legalDescription: string;
  squareFootage?: number;
  lotSize?: number;
  yearBuilt?: number;
  bedrooms?: number;
  bathrooms?: number;
}

export interface CreateEncumbranceDto {
  propertyId: string;
  type: EncumbranceType;
  description: string;
  amount?: number;
  creditor?: string;
}

export interface PropertyValidationResult {
  isValid: boolean;
  isClearForTransfer: boolean;
  hasActiveEncumbrances: boolean;
  encumbranceCount: number;
  validationErrors: string[];
}
