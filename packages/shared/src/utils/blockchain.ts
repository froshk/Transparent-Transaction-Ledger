import { StacksNetwork } from '../types/blockchain';
import { STACKS_CONFIG } from '../constants/blockchain';

export const getStacksNetworkConfig = (network: StacksNetwork) => {
  switch (network) {
    case StacksNetwork.MAINNET:
      return STACKS_CONFIG.NETWORKS.MAINNET;
    case StacksNetwork.TESTNET:
      return STACKS_CONFIG.NETWORKS.TESTNET;
    case StacksNetwork.DEVNET:
      return STACKS_CONFIG.NETWORKS.DEVNET;
    default:
      return STACKS_CONFIG.NETWORKS.TESTNET;
  }
};

export const isValidTransactionId = (txId: string): boolean => {
  // Stacks transaction IDs are 64-character hex strings with 0x prefix
  const txIdRegex = /^0x[a-fA-F0-9]{64}$/;
  return txIdRegex.test(txId);
};

export const isValidContractAddress = (address: string): boolean => {
  // Contract address format: {deployer-address}.{contract-name}
  const parts = address.split('.');
  if (parts.length !== 2) return false;
  
  const [deployerAddress, contractName] = parts;
  const stacksAddressRegex = /^S[PT][0-9A-Z]{39}$/;
  const contractNameRegex = /^[a-zA-Z][a-zA-Z0-9-_]*$/;
  
  return stacksAddressRegex.test(deployerAddress) && contractNameRegex.test(contractName);
};

export const microStxToStx = (microStx: number): number => {
  return microStx / 1000000;
};

export const stxToMicroStx = (stx: number): number => {
  return Math.floor(stx * 1000000);
};

export const generateContractAddress = (deployerAddress: string, contractName: string): string => {
  return `${deployerAddress}.${contractName}`;
};

export const parseContractAddress = (contractAddress: string): { deployer: string; name: string } | null => {
  const parts = contractAddress.split('.');
  if (parts.length !== 2) return null;
  
  return {
    deployer: parts[0],
    name: parts[1],
  };
};

export const getExplorerUrl = (network: StacksNetwork, txId: string): string => {
  const baseUrls = {
    [StacksNetwork.MAINNET]: 'https://explorer.stacks.co',
    [StacksNetwork.TESTNET]: 'https://explorer.stacks.co',
    [StacksNetwork.DEVNET]: 'http://localhost:8000',
  };
  
  return `${baseUrls[network]}/txid/${txId}?chain=${network}`;
};
