export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  stacksAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
  AGENT = 'agent',
  BROKER = 'broker',
  LENDER = 'lender',
  LAWYER = 'lawyer',
  TITLE_COMPANY = 'title_company',
  INVESTOR = 'investor',
  ADMIN = 'admin',
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  licenseNumber?: string; // For agents, brokers, lawyers
  companyName?: string;
  bio?: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
