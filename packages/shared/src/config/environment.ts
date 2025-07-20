export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  API_URL: string;
  FRONTEND_URL: string;
  STACKS_NETWORK: 'mainnet' | 'testnet' | 'devnet';
  STACKS_API_URL: string;
}

export const getEnvironmentConfig = (): Partial<EnvironmentConfig> => {
  // This function can be used in both frontend and backend
  // Frontend will use process.env or import.meta.env
  // Backend will use process.env
  
  const isClient = typeof window !== 'undefined';
  
  if (isClient) {
    // Frontend environment variables (Next.js)
    return {
      NODE_ENV: process.env.NODE_ENV as any,
      API_URL: process.env.NEXT_PUBLIC_API_URL,
      FRONTEND_URL: process.env.NEXT_PUBLIC_APP_URL,
      STACKS_NETWORK: process.env.NEXT_PUBLIC_STACKS_NETWORK as any,
      STACKS_API_URL: process.env.NEXT_PUBLIC_STACKS_API_URL,
    };
  } else {
    // Backend environment variables (Node.js)
    return {
      NODE_ENV: process.env.NODE_ENV as any,
      API_URL: process.env.API_URL,
      FRONTEND_URL: process.env.FRONTEND_URL,
      STACKS_NETWORK: process.env.STACKS_NETWORK as any,
      STACKS_API_URL: process.env.STACKS_API_URL,
    };
  }
};

export const isDevelopment = (): boolean => {
  const config = getEnvironmentConfig();
  return config.NODE_ENV === 'development';
};

export const isProduction = (): boolean => {
  const config = getEnvironmentConfig();
  return config.NODE_ENV === 'production';
};

export const isTest = (): boolean => {
  const config = getEnvironmentConfig();
  return config.NODE_ENV === 'test';
};
