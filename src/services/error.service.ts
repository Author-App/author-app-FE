/**
 * Error Service (Adapter Pattern)
 * 
 * Centralizes error handling for API calls.
 * Adapts various error formats into consistent user-friendly messages.
 */

import { showErrorToast } from '@/src/utils/toast';
import { sentryService } from '@/src/services/sentry';
import type { ApiError } from '@/src/types/api/common.types';

/**
 * Handles API errors by showing a toast and logging to Sentry
 * 
 * @param error - Error from API call (RTK Query, network, or unknown)
 * @param endpoint - Optional endpoint name for better Sentry categorization
 */
export const handleApiError = (error: unknown, endpoint?: string): void => {
  const message = extractErrorMessage(error);
  showErrorToast(message);

  // Log to Sentry
  const statusCode = isApiError(error) ? error.status : undefined;
  sentryService.captureApiError(
    endpoint || 'unknown',
    error,
    statusCode
  );

  // Log in development for debugging
  if (__DEV__) {
    console.error('[API Error]', error);
  }
};

/**
 * Extracts a user-friendly message from various error formats
 * 
 * @param error - Error from API call
 * @returns User-friendly error message
 */
export const extractErrorMessage = (error: unknown): string => {
  // RTK Query error format
  if (isApiError(error)) {
    return error.data?.message || 'Request failed. Please try again.';
  }

  // Network/fetch error
  if (error instanceof Error) {
    if (error.message.toLowerCase().includes('network')) {
      return 'No internet connection. Please check your network.';
    }
    if (error.message.toLowerCase().includes('timeout')) {
      return 'Request timed out. Please try again.';
    }
    return error.message;
  }

  // String error
  if (typeof error === 'string') {
    return error;
  }

  // Fallback
  return 'Something went wrong. Please try again.';
};

/**
 * Type guard to check if error is an ApiError
 * 
 * @param error - Unknown error object
 * @returns True if error matches ApiError structure
 */
const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'data' in error &&
    typeof (error as ApiError).data === 'object'
  );
};

/**
 * Gets error message without showing toast
 * Useful when you need the message but want to handle display yourself
 * 
 * @param error - Error from API call
 * @returns User-friendly error message
 */
export const getErrorMessage = (error: unknown): string => {
  return extractErrorMessage(error);
};
