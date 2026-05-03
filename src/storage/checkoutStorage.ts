/**
 * Checkout Storage - Persists shipping address for returning customers
 * Uses SecureStore for PII (name, address, phone, email)
 */

import { secureSetObject, secureGetObject, secureDelete } from './secureStorage';
import type { ShippingAddress } from '@/src/types/api/print.types';

const STORAGE_KEYS = {
  SHIPPING_ADDRESS: 'checkout_shipping_address_v1',
} as const;

/**
 * Save shipping address for future orders
 */
export const saveShippingAddress = async (address: ShippingAddress): Promise<boolean> => {
  try {
    // Only save if we have meaningful data
    if (!address.firstName && !address.email && !address.street1) {
      return false;
    }
    
    const success = await secureSetObject(STORAGE_KEYS.SHIPPING_ADDRESS, address);
    return success;
  } catch (error) {
    return false;
  }
};

/**
 * Get saved shipping address
 */
export const getSavedShippingAddress = async (): Promise<ShippingAddress | null> => {
  try {
    return await secureGetObject<ShippingAddress>(STORAGE_KEYS.SHIPPING_ADDRESS);
  } catch {
    return null;
  }
};

/**
 * Clear saved shipping address
 */
export const clearSavedShippingAddress = async (): Promise<boolean> => {
  try {
    await secureDelete(STORAGE_KEYS.SHIPPING_ADDRESS);
    return true;
  } catch {
    return false;
  }
};
