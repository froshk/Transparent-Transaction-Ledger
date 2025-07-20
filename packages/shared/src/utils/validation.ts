import { VALIDATION_RULES } from '../constants/app';

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= VALIDATION_RULES.EMAIL_MAX_LENGTH;
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= VALIDATION_RULES.PASSWORD_MIN_LENGTH;
};

export const isValidName = (name: string): boolean => {
  return (
    name.length >= VALIDATION_RULES.NAME_MIN_LENGTH &&
    name.length <= VALIDATION_RULES.NAME_MAX_LENGTH
  );
};

export const isValidStacksAddress = (address: string): boolean => {
  // Basic Stacks address validation (starts with SP or ST for testnet)
  const stacksAddressRegex = /^S[PT][0-9A-Z]{39}$/;
  return stacksAddressRegex.test(address);
};

export const isValidAmount = (amount: number): boolean => {
  return amount > 0 && Number.isFinite(amount);
};

export const isValidZipCode = (zipCode: string): boolean => {
  // US ZIP code validation (5 digits or 5+4 format)
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode);
};

export const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateRequired = (value: any, fieldName: string): string | null => {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} is required`;
  }
  return null;
};
