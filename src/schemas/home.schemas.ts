import { z } from 'zod';
import { apiResponseSchema } from './common.schemas';

// ============================================================================
// HOME FEED ENTITY SCHEMAS
// ============================================================================

/**
 * Banner displayed at top of home screen
 */
export const homeBannerSchema = z.object({
  title: z.string(),
}).nullable();

/**
 * Book item in home feed carousels
 */
export const homeBookSchema = z.object({
  id: z.string(),
  title: z.string(),
  image: z.string().optional(),
  hasAccess: z.boolean().optional(),
  price: z.number(),
  currency: z.string(),
});

/**
 * Article item in home feed carousels
 */
export const homeArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  image: z.string().optional(),
  readTime: z.object({
    value: z.number(),
    unit: z.string(),
  }).optional(),
});

/**
 * Progress info for continue reading items
 */
export const continueReadingProgressSchema = z.object({
  currentPage: z.number(),
  currentPositionSec: z.number(),
  lastReadAt: z.string(),
  percentage: z.number(),
  totalPages: z.number(),
});

/**
 * Book item in continue reading section
 */
export const continueReadingBookSchema = z.object({
  id: z.string(),
  title: z.string(),
  image: z.string().optional(),
  price: z.number(),
  currency: z.string(),
  hasAccess: z.boolean(),
  progress: continueReadingProgressSchema,
});

// ============================================================================
// HOME FEED RESPONSE SCHEMAS
// ============================================================================

/**
 * Home feed data
 */
export const homeFeedDataSchema = z.object({
  banner: homeBannerSchema,
  trendingBooks: z.array(homeBookSchema),
  articles: z.array(homeArticleSchema),
  audioBooks: z.array(homeBookSchema),
  continueReading: z.array(continueReadingBookSchema),
});

/**
 * GET /home - Full response
 */
export const getHomeFeedResponseSchema = apiResponseSchema(homeFeedDataSchema);

// ============================================================================
// EXPORTED TYPES
// ============================================================================

export type HomeBanner = z.infer<typeof homeBannerSchema>;
export type HomeBook = z.infer<typeof homeBookSchema>;
export type HomeArticle = z.infer<typeof homeArticleSchema>;
export type ContinueReadingProgress = z.infer<typeof continueReadingProgressSchema>;
export type ContinueReadingBook = z.infer<typeof continueReadingBookSchema>;
export type HomeFeedData = z.infer<typeof homeFeedDataSchema>;
export type GetHomeFeedResponse = z.infer<typeof getHomeFeedResponseSchema>;
