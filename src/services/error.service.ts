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

  // A dropped request is the phone's problem, not a defect. Sentry's ignoreErrors
  // cannot catch these, because captureApiError rewrites the message first.
  if (!isTransportError(error) && !isExpectedRejection(error)) {
    const statusCode = isApiError(error) ? error.status : undefined;
    sentryService.captureApiError(
      endpoint || 'unknown',
      error,
      statusCode
    );
  }

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
  // RTK Query reports a dropped request as a status string with no `data`, so
  // this has to come before the isApiError check or it falls through to "Something
  // went wrong" and the user never learns it was their connection.
  if (isTransportError(error)) {
    return (error as { status: string }).status === 'TIMEOUT_ERROR'
      ? 'Request timed out. Please try again.'
      : 'No internet connection. Please check your network.';
  }

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
/**
 * True when the request never got an answer: no network, DNS failure, a socket
 * dropped by a wifi handover, or a timeout. RTK Query puts a string in `status`.
 */
const isTransportError = (error: unknown): boolean => {
  if (typeof error !== 'object' || error === null || !('status' in error)) {
    return false;
  }
  const { status } = error as { status: unknown };
  return status === 'FETCH_ERROR' || status === 'TIMEOUT_ERROR';
};

/**
 * The server answered, and the answer was a normal outcome: wrong credentials (401),
 * no permission (403), or a duplicate signup (409). The toast already told the user.
 * A 400 is deliberately NOT here: it means our client sent something the server
 * rejected, which is a defect.
 */
const isExpectedRejection = (error: unknown): boolean => {
  const status = (error as { status?: unknown } | null)?.status;
  return status === 401 || status === 403 || status === 409;
};

const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'data' in error &&
    typeof (error as ApiError).data === 'object'
  );
};
