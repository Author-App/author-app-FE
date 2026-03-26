import React from 'react';

import type { RatingStats } from '@/src/types/api/library.types';
import { ReviewsSection } from '../reviews/ReviewsSection';

interface ReviewsTabContentProps {
  ratingStats?: RatingStats;
  hasAccess?: boolean;
  onWriteReview: () => void;
}

export function ReviewsTabContent({
  ratingStats,
  hasAccess,
  onWriteReview,
}: ReviewsTabContentProps) {
  if (!ratingStats) return null;

  return (
    <ReviewsSection
      ratingStats={ratingStats}
      hasAccess={hasAccess}
      onWriteReview={onWriteReview}
    />
  );
}
