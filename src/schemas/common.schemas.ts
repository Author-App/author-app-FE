import { z } from 'zod';

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Wraps data in standard API response format { success, message?, data }
 * Use for most API endpoints
 */
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string().optional(),
    data: dataSchema,
  });

/**
 * Alternative API response with status string instead of success boolean
 * Used by library/orders endpoints
 */
export const statusResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    status: z.string(),
    data: dataSchema,
  });

/**
 * Pagination metadata for list endpoints
 */
export const paginationMetaSchema = z.object({
  currentPage: z.number(),
  totalPages: z.number(),
  totalItems: z.number().optional(),
  itemsPerPage: z.number().optional(),
  hasNextPage: z.boolean().optional(),
  hasPreviousPage: z.boolean().optional(),
});

/**
 * Alternative pagination used by explore endpoints
 */
export const explorePaginationSchema = z.object({
  currentPage: z.number(),
  totalPages: z.number(),
  totalCount: z.number(),
});

/**
 * Library-style pagination
 */
export const libraryPaginationSchema = z.object({
  total: z.number(),
  currentPage: z.number(),
  pageSize: z.number(),
  hasMore: z.boolean(),
});

/**
 * Simple message response
 */
export const messageResponseSchema = z.object({
  message: z.string(),
});

// ============================================================================
// EXPORTED TYPES
// ============================================================================

export type ApiResponse<T> = z.infer<ReturnType<typeof apiResponseSchema<z.ZodType<T>>>>;
export type StatusResponse<T> = z.infer<ReturnType<typeof statusResponseSchema<z.ZodType<T>>>>;
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
export type ExplorePagination = z.infer<typeof explorePaginationSchema>;
export type LibraryPagination = z.infer<typeof libraryPaginationSchema>;
