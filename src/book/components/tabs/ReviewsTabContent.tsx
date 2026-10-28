import React from 'react';

import type { RatingStats } from '@/src/types/api/library.types';
import { ReviewsSection } from '../reviews/ReviewsSection';

interface ReviewsTabContentProps {
  ratingStats?: RatingStats;
  hasAccess?: boolean;
  onWriteReview: () => void;
  width: number;
}

export function ReviewsTabContent({
  ratingStats,
  hasAccess,
  onWriteReview,
  width,
}: ReviewsTabContentProps) {
  if (!ratingStats) return null;

  return (
    <ReviewsSection
      ratingStats={ratingStats}
      hasAccess={hasAccess}
      onWriteReview={onWriteReview}
      width={width}
    />
  );
}
