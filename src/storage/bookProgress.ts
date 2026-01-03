import AsyncStorage from "@react-native-async-storage/async-storage";

// ============================================================================
// Constants
// ============================================================================

const PROGRESS_PREFIX = "BOOK_PDF_PROGRESS_";
const URL_CACHE_PREFIX = "BOOK_URL_CACHE_";
const URL_EXPIRY_MS = 55 * 60 * 1000; // 55 minutes (5 min buffer before 1 hour expiry)

// ============================================================================
// Reading Progress
// ============================================================================

export const getPdfProgress = async (bookId: string) => {
  const data = await AsyncStorage.getItem(`${PROGRESS_PREFIX}${bookId}`);
  return data ? JSON.parse(data) : null;
};

export const savePdfProgress = async (
  bookId: string,
  page: number,
  totalPages: number
) => {
  const percentage = Math.round((page / totalPages) * 100);

  await AsyncStorage.setItem(
    `${PROGRESS_PREFIX}${bookId}`,
    JSON.stringify({
      page,
      totalPages,
      percentage,
      updatedAt: Date.now(),
    })
  );
};

export const removePdfProgress = async (bookId: string) => {
  await AsyncStorage.removeItem(`${PROGRESS_PREFIX}${bookId}`);
};

// ============================================================================
// Signed URL Cache
// ============================================================================

interface CachedUrl {
  url: string;
  cachedAt: number;
}

/**
 * Get cached signed URL if not expired
 * Returns null if no cache or expired
 */
export const getCachedSignedUrl = async (bookId: string): Promise<string | null> => {
  try {
    const data = await AsyncStorage.getItem(`${URL_CACHE_PREFIX}${bookId}`);
    if (!data) return null;

    const cached: CachedUrl = JSON.parse(data);
    const now = Date.now();

    // Check if URL is still valid (within expiry window)
    if (now - cached.cachedAt < URL_EXPIRY_MS) {
      return cached.url;
    }

    // Expired - clear cache
    await AsyncStorage.removeItem(`${URL_CACHE_PREFIX}${bookId}`);
    return null;
  } catch {
    return null;
  }
};

/**
 * Cache a signed URL with timestamp
 */
export const cacheSignedUrl = async (bookId: string, url: string): Promise<void> => {
  await AsyncStorage.setItem(
    `${URL_CACHE_PREFIX}${bookId}`,
    JSON.stringify({
      url,
      cachedAt: Date.now(),
    })
  );
};

/**
 * Clear cached signed URL
 */
export const clearCachedSignedUrl = async (bookId: string): Promise<void> => {
  await AsyncStorage.removeItem(`${URL_CACHE_PREFIX}${bookId}`);
};