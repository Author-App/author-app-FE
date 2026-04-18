import * as secureStorageModule from '../secureStorage';
import { saveAuthTokens, getAuthTokens, clearAuthTokens } from '../authStorage';

// Mock the secureStorage module
jest.mock('../secureStorage', () => ({
  secureSetObject: jest.fn(),
  secureGetObject: jest.fn(),
  secureDelete: jest.fn(),
}));

const mockSecureSetObject = secureStorageModule.secureSetObject as jest.Mock;
const mockSecureGetObject = secureStorageModule.secureGetObject as jest.Mock;
const mockSecureDelete = secureStorageModule.secureDelete as jest.Mock;

describe('AuthStorage', () => {
  const mockRefreshToken = 'refresh_456abc';
  const mockUserId = 'user_123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveAuthTokens', () => {
    it('should store tokens securely', async () => {
      mockSecureSetObject.mockResolvedValue(true);

      await saveAuthTokens(mockRefreshToken, mockUserId);

      expect(mockSecureSetObject).toHaveBeenCalledWith(
        'auth_tokens_v2',
        { refreshToken: mockRefreshToken, userId: mockUserId }
      );
    });

    it('should handle storage failures gracefully', async () => {
      mockSecureSetObject.mockResolvedValue(false);

      // Should not throw even when storage fails
      await expect(saveAuthTokens('token', 'user')).resolves.not.toThrow();
    });
  });

  describe('getAuthTokens', () => {
    it('should retrieve stored tokens', async () => {
      const storedData = { refreshToken: mockRefreshToken, userId: mockUserId };
      mockSecureGetObject.mockResolvedValue(storedData);

      const result = await getAuthTokens();

      expect(mockSecureGetObject).toHaveBeenCalledWith('auth_tokens_v2');
      expect(result).toEqual(storedData);
    });

    it('should return null when no tokens stored', async () => {
      mockSecureGetObject.mockResolvedValue(null);

      const result = await getAuthTokens();

      expect(result).toBeNull();
    });
  });

  describe('clearAuthTokens', () => {
    it('should delete tokens from secure storage', async () => {
      mockSecureDelete.mockResolvedValue(true);

      await clearAuthTokens();

      expect(mockSecureDelete).toHaveBeenCalledWith('auth_tokens_v2');
    });
  });

  // Integration-style test showing the full flow
  describe('token lifecycle', () => {
    it('should support full store -> retrieve -> clear flow', async () => {
      // Store tokens
      mockSecureSetObject.mockResolvedValue(true);
      await saveAuthTokens(mockRefreshToken, mockUserId);
      expect(mockSecureSetObject).toHaveBeenCalled();

      // Retrieve tokens
      const storedData = { refreshToken: mockRefreshToken, userId: mockUserId };
      mockSecureGetObject.mockResolvedValue(storedData);
      const retrieved = await getAuthTokens();
      expect(retrieved).toEqual(storedData);

      // Clear tokens
      mockSecureDelete.mockResolvedValue(true);
      await clearAuthTokens();
      expect(mockSecureDelete).toHaveBeenCalled();

      // After clearing, getAuthTokens should return null
      mockSecureGetObject.mockResolvedValue(null);
      const afterClear = await getAuthTokens();
      expect(afterClear).toBeNull();
    });
  });
});
