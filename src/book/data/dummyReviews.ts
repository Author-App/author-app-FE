import type { RatingStats, ReviewResponse } from '@/src/types/api/library.types';

// Dummy review responses matching the server type
export const DUMMY_REVIEWS: ReviewResponse[] = [
  {
    id: 'review-1',
    username: 'Sarah Johnson',
    rating: 5,
    comment:
      'Absolutely incredible read! The author has a way with words that draws you in from the very first page. I couldn\'t put it down and finished it in just two days. Highly recommend to anyone who loves immersive storytelling.',
    recommended: true,
    submittedAt: '2025-12-28T14:30:00Z',
    isUserReview: false,
  },
  {
    id: 'review-2',
    username: 'Michael Chen',
    rating: 4,
    comment:
      'Great book overall. The character development was exceptional and the plot kept me guessing. Only reason for 4 stars is the pacing slowed down a bit in the middle, but the ending more than made up for it.',
    recommended: true,
    submittedAt: '2025-12-25T09:15:00Z',
    isUserReview: false,
  },
  {
    id: 'review-3',
    username: 'Emily Rodriguez',
    rating: 5,
    comment:
      'This is exactly the kind of book I\'ve been looking for. The themes are thought-provoking and the writing style is beautiful. Already recommending it to all my friends!',
    recommended: true,
    submittedAt: '2025-12-20T18:45:00Z',
    isUserReview: false,
  },
  {
    id: 'review-4',
    username: 'David Thompson',
    rating: 3,
    comment:
      'Decent read but not my favorite. The concept was interesting but I felt like it didn\'t fully deliver on its promise. Still worth a read if you\'re into this genre.',
    recommended: false,
    submittedAt: '2025-12-15T11:20:00Z',
    isUserReview: false,
  },
  {
    id: 'review-5',
    username: 'Amanda Foster',
    rating: 5,
    comment:
      'A masterpiece! One of the best books I\'ve read this year. The author\'s attention to detail and the emotional depth of the characters made this an unforgettable experience.',
    recommended: true,
    submittedAt: '2025-12-10T16:00:00Z',
    isUserReview: false,
  },
  {
    id: 'review-6',
    username: 'James Wilson',
    rating: 4,
    comment:
      'Really enjoyed this one. The audiobook version is particularly good - the narrator brings the characters to life. Would love to see more from this author.',
    recommended: true,
    submittedAt: '2025-12-05T08:30:00Z',
    isUserReview: false,
  },
];

// Dummy current user review (optional - can be undefined)
export const DUMMY_CURRENT_USER_REVIEW: ReviewResponse = {
  id: 'review-current',
  username: 'You',
  rating: 4,
  comment:
    'I really enjoyed reading this book. The story was engaging and the characters felt real. Looking forward to more from this author!',
  recommended: true,
  submittedAt: '2025-12-30T10:00:00Z',
  isUserReview: true,
};

// Complete dummy rating stats matching RatingStats type
export const DUMMY_RATING_STATS: RatingStats = {
  average: 4.3,
  total: 128,
  recommended: 112, // ~87% recommended
  breakdown: {
    '1': 3,
    '2': 8,
    '3': 15,
    '4': 42,
    '5': 60,
  },
  userReviews: DUMMY_REVIEWS,
  currentUserReview: undefined, // Set to DUMMY_CURRENT_USER_REVIEW if user has reviewed
};

// Alternative: Rating stats with current user review
export const DUMMY_RATING_STATS_WITH_USER_REVIEW: RatingStats = {
  ...DUMMY_RATING_STATS,
  currentUserReview: DUMMY_CURRENT_USER_REVIEW,
};

// Empty rating stats (no reviews yet)
export const DUMMY_EMPTY_RATING_STATS: RatingStats = {
  average: 0,
  total: 0,
  recommended: 0,
  breakdown: {
    '1': 0,
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0,
  },
  userReviews: [],
  currentUserReview: undefined,
};
