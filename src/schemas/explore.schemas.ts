import { z } from 'zod';
import { apiResponseSchema, explorePaginationSchema } from './common.schemas';

// ============================================================================
// ARTICLE SCHEMAS
// ============================================================================

export const articleAuthorSchema = z.object({
  name: z.string(),
  profileImage: z.string().optional(),
});

export const articleSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: articleAuthorSchema,
  publishedAt: z.string().nullable(),
  readTime: z.object({
    value: z.number(),
    unit: z.string(),
  }).optional(),
  thumbnail: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const articleDetailSchema = articleSchema.extend({
  content: z.string(), // Full HTML or markdown content
});

export const articleListDataSchema = z.object({
  articles: z.array(articleSchema),
  pagination: explorePaginationSchema,
});

/**
 * GET /articles - Article list response
 */
export const getArticlesResponseSchema = apiResponseSchema(articleListDataSchema);

/**
 * GET /articles/:id - Single article response
 */
export const getArticleDetailResponseSchema = apiResponseSchema(articleDetailSchema);

// ============================================================================
// MEDIA (PODCAST/VIDEO) SCHEMAS
// ============================================================================

export const mediaTypeSchema = z.enum(['video', 'podcast']);

export const mediaProgressSchema = z.object({
  currentPositionSec: z.number(),
  durationSec: z.number(),
  lastPlayedAt: z.string(),
  percentage: z.number(),
  watchedSec: z.number(),
});

export const mediaSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  durationSec: z.number(),
  fileUrl: z.string(),
  mediaType: mediaTypeSchema,
  thumbnail: z.string().optional(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
  progress: mediaProgressSchema.optional(),
});

export const mediaListDataSchema = z.object({
  media: z.array(mediaSchema),
  pagination: explorePaginationSchema,
});

/**
 * GET /media - Media list response
 */
export const getMediaListResponseSchema = apiResponseSchema(mediaListDataSchema);

export const mediaDetailDataSchema = mediaSchema.extend({
  moreMedia: z.array(mediaSchema).optional(),
});

/**
 * GET /media/:id - Single media detail response
 */
export const getMediaDetailResponseSchema = apiResponseSchema(mediaDetailDataSchema);

/**
 * PUT /media/:id/progress - Update media progress response
 */
export const updateMediaProgressResponseSchema = apiResponseSchema(
  z.object({
    message: z.string(),
  })
);

// ============================================================================
// EVENT SCHEMAS
// ============================================================================

export const eventTypeSchema = z.enum(['offline', 'online']);

export const eventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  eventDate: z.string().nullable(),
  eventTime: z.string(),
  eventType: eventTypeSchema,
  location: z.string().optional(),
  locationGoogleMapLink: z.string().optional(),
  googleMeetLink: z.string().optional(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

export const eventListDataSchema = z.object({
  events: z.array(eventSchema),
  pagination: explorePaginationSchema,
});

/**
 * GET /events - Event list response
 */
export const getEventsResponseSchema = apiResponseSchema(eventListDataSchema);

/**
 * GET /events/:id - Single event detail response
 */
export const getEventDetailResponseSchema = apiResponseSchema(eventSchema);

// ============================================================================
// COMMUNITY SCHEMAS
// ============================================================================

export const communitySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  threadCount: z.number(),
  isJoined: z.boolean(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

export const communityListDataSchema = z.object({
  communities: z.array(communitySchema),
  pagination: explorePaginationSchema,
});

/**
 * GET /communities - Community list response
 */
export const getCommunitiesResponseSchema = apiResponseSchema(communityListDataSchema);

export const threadSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  userName: z.string(),
  userProfileImage: z.string().optional(),
  message: z.string(),
  createdAt: z.union([z.string(), z.date()]).nullable(),
});

export const communityDetailDataSchema = communitySchema.extend({
  threads: z.array(threadSchema),
});

/**
 * GET /communities/:id - Community detail response
 */
export const getCommunityDetailResponseSchema = apiResponseSchema(communityDetailDataSchema);

/**
 * POST /communities/:id/join - Join community response
 * POST /communities/:id/exit - Exit community response
 */
export const communityActionResponseSchema = apiResponseSchema(
  z.object({
    message: z.string(),
  })
);

/**
 * POST /communities/:id/threads - Send thread response
 */
export const sendThreadResponseSchema = apiResponseSchema(threadSchema);

// ============================================================================
// EXPORTED TYPES
// ============================================================================

export type ArticleAuthor = z.infer<typeof articleAuthorSchema>;
export type Article = z.infer<typeof articleSchema>;
export type ArticleDetail = z.infer<typeof articleDetailSchema>;
export type ArticleListData = z.infer<typeof articleListDataSchema>;
export type GetArticlesResponse = z.infer<typeof getArticlesResponseSchema>;
export type GetArticleDetailResponse = z.infer<typeof getArticleDetailResponseSchema>;

export type MediaType = z.infer<typeof mediaTypeSchema>;
export type MediaProgress = z.infer<typeof mediaProgressSchema>;
export type Media = z.infer<typeof mediaSchema>;
export type MediaListData = z.infer<typeof mediaListDataSchema>;
export type MediaDetailData = z.infer<typeof mediaDetailDataSchema>;
export type GetMediaListResponse = z.infer<typeof getMediaListResponseSchema>;
export type GetMediaDetailResponse = z.infer<typeof getMediaDetailResponseSchema>;

export type EventType = z.infer<typeof eventTypeSchema>;
export type Event = z.infer<typeof eventSchema>;
export type EventListData = z.infer<typeof eventListDataSchema>;
export type GetEventsResponse = z.infer<typeof getEventsResponseSchema>;
export type GetEventDetailResponse = z.infer<typeof getEventDetailResponseSchema>;

export type Community = z.infer<typeof communitySchema>;
export type CommunityListData = z.infer<typeof communityListDataSchema>;
export type Thread = z.infer<typeof threadSchema>;
export type CommunityDetailData = z.infer<typeof communityDetailDataSchema>;
export type GetCommunitiesResponse = z.infer<typeof getCommunitiesResponseSchema>;
export type GetCommunityDetailResponse = z.infer<typeof getCommunityDetailResponseSchema>;
