// src/config/env.ts

const requiredEnvVars = [
  'WALLETCONNECT_PROJECT_ID',
  'ALCHEMY_API_KEY',
] as const;

const optionalEnvVars = [
  'IP_ASSET_REGISTRY_ADDRESS',
  'IP_ASSET_ORGANIZER_ADDRESS',
  'LICENSING_MODULE_ADDRESS',
] as const;

type RequiredEnvVar = typeof requiredEnvVars[number];
type OptionalEnvVar = typeof optionalEnvVars[number];

function getEnvVar(key: RequiredEnvVar | OptionalEnvVar, defaultValue?: string): string {
  const value = process.env[`NEXT_PUBLIC_${key}`] || defaultValue;
  
  // In development, provide default values for required vars
  if (process.env.NODE_ENV === 'development') {
    if (key === 'WALLETCONNECT_PROJECT_ID') return value || 'development_id';
    if (key === 'ALCHEMY_API_KEY') return value || 'demo';
  }
  
  // Only throw in production
  if (process.env.NODE_ENV === 'production') {
    if (requiredEnvVars.includes(key as RequiredEnvVar) && !value) {
      console.error(`Missing required environment variable: NEXT_PUBLIC_${key}`);
      return ''; // Return empty string instead of throwing
    }
  }
  
  return value || '';
}

export const ENV = {
  ALCHEMY_API_KEY: getEnvVar('ALCHEMY_API_KEY'),
  WALLETCONNECT_PROJECT_ID: getEnvVar('WALLETCONNECT_PROJECT_ID'),
  IP_ASSET_REGISTRY_ADDRESS: getEnvVar('IP_ASSET_REGISTRY_ADDRESS', ''),
  IP_ASSET_ORGANIZER_ADDRESS: getEnvVar('IP_ASSET_ORGANIZER_ADDRESS', ''),
  LICENSING_MODULE_ADDRESS: getEnvVar('LICENSING_MODULE_ADDRESS', ''),
} as const;

// Validation function that warns instead of throws
export function validateEnv(): boolean {
  let isValid = true;
  
  requiredEnvVars.forEach(key => {
    if (!ENV[key]) {
      console.warn(`Warning: Missing environment variable NEXT_PUBLIC_${key}`);
      isValid = false;
    }
  });

  return isValid;
}