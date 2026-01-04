import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKENS_KEY = 'AUTH_TOKENS';

interface StoredAuthTokens {
  refreshToken: string;
  userId: string;
}


export const saveAuthTokens = async (
  refreshToken: string,
  userId: string
): Promise<void> => {
  try {
    const data: StoredAuthTokens = { refreshToken, userId };
    await AsyncStorage.setItem(AUTH_TOKENS_KEY, JSON.stringify(data));
    console.log('✅ [authStorage] Saved auth tokens to storage');
  } catch (error) {
    console.error('❌ [authStorage] Failed to save auth tokens:', error);
  }
};


export const getAuthTokens = async (): Promise<StoredAuthTokens | null> => {
  try {
    const data = await AsyncStorage.getItem(AUTH_TOKENS_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ [authStorage] Failed to get auth tokens:', error);
    return null;
  }
};


export const clearAuthTokens = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AUTH_TOKENS_KEY);
    console.log('✅ [authStorage] Cleared auth tokens from storage');
  } catch (error) {
    console.error('❌ [authStorage] Failed to clear auth tokens:', error);
  }
};
