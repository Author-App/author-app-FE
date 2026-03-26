/**
 * Common API Types
 * 
 * Generic types used across all API endpoints.
 * These provide consistent typing for API responses and errors.
 */

/**
 * Generic API response wrapper
 * All successful API responses follow this structure
 */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/**
 * API Error response structure
 * Returned by RTK Query when a request fails
 */
export interface ApiError {
  status: number;
  data: {
    message: string;
    errors?: Record<string, string[]>;
  };
}

/**
 * Pagination metadata for list endpoints
 */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Generic paginated response
 */
export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

/**
 * Simple message response
 * Used for endpoints that return only a message
 */
export interface MessageResponse {
  message: string;
}
