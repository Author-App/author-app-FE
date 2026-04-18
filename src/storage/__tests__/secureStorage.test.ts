import * as SecureStore from 'expo-secure-store';
import {
  secureSet,
  secureGet,
  secureDelete,
  secureSetObject,
  secureGetObject,
} from '../secureStorage';

// Mock expo-secure-store (already mocked in jest.setup.js)
const mockSetItem = SecureStore.setItemAsync as jest.Mock;
const mockGetItem = SecureStore.getItemAsync as jest.Mock;
const mockDeleteItem = SecureStore.deleteItemAsync as jest.Mock;

describe('SecureStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('secureSet', () => {
    it('should store a string value', async () => {
      mockSetItem.mockResolvedValue(undefined);
      
      const result = await secureSet('testKey', 'testValue');
      
      expect(result).toBe(true);
      expect(mockSetItem).toHaveBeenCalledWith(
        'testKey',
        'testValue',
        expect.any(Object)
      );
    });

    it('should return false on error', async () => {
      mockSetItem.mockRejectedValue(new Error('Storage full'));
      
      const result = await secureSet('key', 'value');
      
      expect(result).toBe(false);
    });
  });

  describe('secureGet', () => {
    it('should retrieve a stored value', async () => {
      mockGetItem.mockResolvedValue('storedValue');
      
      const result = await secureGet('testKey');
      
      expect(result).toBe('storedValue');
      expect(mockGetItem).toHaveBeenCalledWith('testKey');
    });

    it('should return null for non-existent keys', async () => {
      mockGetItem.mockResolvedValue(null);
      
      const result = await secureGet('nonExistent');
      
      expect(result).toBeNull();
    });

    it('should return null on error', async () => {
      mockGetItem.mockRejectedValue(new Error('Access denied'));
      
      const result = await secureGet('key');
      
      expect(result).toBeNull();
    });
  });

  describe('secureDelete', () => {
    it('should delete an item', async () => {
      mockDeleteItem.mockResolvedValue(undefined);
      
      const result = await secureDelete('keyToDelete');
      
      expect(result).toBe(true);
      expect(mockDeleteItem).toHaveBeenCalledWith('keyToDelete');
    });

    it('should return false on error', async () => {
      mockDeleteItem.mockRejectedValue(new Error('Delete failed'));
      
      const result = await secureDelete('key');
      
      expect(result).toBe(false);
    });
  });

  describe('secureSetObject', () => {
    it('should serialize objects to JSON', async () => {
      mockSetItem.mockResolvedValue(undefined);
      const testObject = { foo: 'bar', count: 42 };
      
      const result = await secureSetObject('objectKey', testObject);
      
      expect(result).toBe(true);
      expect(mockSetItem).toHaveBeenCalledWith(
        'objectKey',
        JSON.stringify(testObject),
        expect.any(Object)
      );
    });

    it('should handle arrays', async () => {
      mockSetItem.mockResolvedValue(undefined);
      const testArray = [1, 2, 3];
      
      await secureSetObject('arrayKey', testArray);
      
      expect(mockSetItem).toHaveBeenCalledWith(
        'arrayKey',
        JSON.stringify(testArray),
        expect.any(Object)
      );
    });
  });

  describe('secureGetObject', () => {
    it('should parse JSON objects', async () => {
      const storedObject = { foo: 'bar', count: 42 };
      mockGetItem.mockResolvedValue(JSON.stringify(storedObject));
      
      const result = await secureGetObject<typeof storedObject>('objectKey');
      
      expect(result).toEqual(storedObject);
    });

    it('should return null for missing keys', async () => {
      mockGetItem.mockResolvedValue(null);
      
      const result = await secureGetObject('missing');
      
      expect(result).toBeNull();
    });

    it('should return null for invalid JSON', async () => {
      mockGetItem.mockResolvedValue('not-valid-json');
      
      const result = await secureGetObject('badKey');
      
      expect(result).toBeNull();
    });
  });
});
