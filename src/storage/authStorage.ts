/**
 * Auth Token Storage (SecureStore)
 * Migrated from AsyncStorage - users need to re-login once after update
 */

import { secureSetObject, secureGetObject, secureDelete } from './secureStorage';

const STORAGE_KEYS = {
  AUTH_TOKENS: 'auth_tokens_v2', // v2 = SecureStore migration
} as const;

interface StoredAuthTokens {
  refreshToken: string;
  userId: string;
}

export const saveAuthTokens = async (
  refreshToken: string,
  userId: string
): Promise<void> => {
  const data: StoredAuthTokens = { refreshToken, userId };
  const success = await secureSetObject(STORAGE_KEYS.AUTH_TOKENS, data);
  
  if (!success) {
    console.warn('[authStorage] Token save failed - session may not persist');
  }
};

export const getAuthTokens = async (): Promise<StoredAuthTokens | null> => {
  return secureGetObject<StoredAuthTokens>(STORAGE_KEYS.AUTH_TOKENS);
};

export const clearAuthTokens = async (): Promise<void> => {
  await secureDelete(STORAGE_KEYS.AUTH_TOKENS);
};
