/**
 * Secure Storage - Uses iOS Keychain / Android Keystore (encrypted)
 * Use for: tokens, API keys, sensitive user data
 * Limit: ~2KB per item on Android
 */

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export interface SecureStorageOptions {
  requireAuthentication?: boolean; // iOS only: require Face ID/Touch ID
}

export async function secureSet(
  key: string,
  value: string,
  options?: SecureStorageOptions
): Promise<boolean> {
  try {
    const storeOptions: SecureStore.SecureStoreOptions = {
      keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
    };

    if (options?.requireAuthentication && Platform.OS === 'ios') {
      storeOptions.requireAuthentication = true;
    }

    await SecureStore.setItemAsync(key, value, storeOptions);
    return true;
  } catch (error) {
    console.error(`[SecureStorage] Failed to save "${key}":`, error);
    return false;
  }
}

export async function secureGet(key: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error(`[SecureStorage] Failed to get "${key}":`, error);
    return null;
  }
}

export async function secureDelete(key: string): Promise<boolean> {
  try {
    await SecureStore.deleteItemAsync(key);
    return true;
  } catch (error) {
    console.error(`[SecureStorage] Failed to delete "${key}":`, error);
    return false;
  }
}

export async function secureSetObject<T>(key: string, value: T): Promise<boolean> {
  try {
    const jsonValue = JSON.stringify(value);
    return secureSet(key, jsonValue);
  } catch (error) {
    console.error(`[SecureStorage] Failed to serialize "${key}":`, error);
    return false;
  }
}

export async function secureGetObject<T>(key: string): Promise<T | null> {
  try {
    const jsonValue = await secureGet(key);
    if (!jsonValue) return null;
    return JSON.parse(jsonValue) as T;
  } catch (error) {
    console.error(`[SecureStorage] Failed to parse "${key}":`, error);
    return null;
  }
}
