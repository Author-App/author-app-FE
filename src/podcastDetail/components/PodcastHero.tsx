import React, { memo } from 'react';
import { AudioHero } from '@/src/components/core/audio';

interface PodcastHeroProps {
  title: string;
  duration: string;
  thumbnail?: string | null;
}

export const PodcastHero = memo(function PodcastHero({
  title,
  duration,
  thumbnail,
}: PodcastHeroProps) {
  return (
    <AudioHero
      title={title}
      duration={duration}
      thumbnail={thumbnail}
    />
  );
});