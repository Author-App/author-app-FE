import React from 'react';
import { YStack } from 'tamagui';
import { AudiobookBannerData } from '../../../../types/banner/bannerTypes';

interface AudiobookBannerProps {
  data: AudiobookBannerData;
}

const AudiobookBanner: React.FC<AudiobookBannerProps> = ({ data }) => {
  const {
    id,
    image,
    title,
    author,
    narrator,
    genre,
    duration,
    listenedProgress,
    currentChapter,
    totalChapters,
    badges,
  } = data;

  return (
    <YStack
      height={260}
      borderRadius="$4"
      overflow="hidden"
      position="relative"
      bg="$neutral2"
      w="100%"
    >
      {/* TODO: Implement Audiobook Banner UI */}
    </YStack>
  );
};

export default AudiobookBanner;