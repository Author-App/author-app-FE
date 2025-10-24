import React from 'react';
import { YStack } from 'tamagui';
import { BookBannerData } from '../../../../types/banner/bannerTypes';

interface BookBannerProps {
  data: BookBannerData;
}

const BookBanner: React.FC<BookBannerProps> = ({ data }) => {
  const {
    id,
    image,
    title,
    author,
    genre,
    publishedDate,
    rating,
    totalRatings,
    pageCount,
    readingProgress,
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
      {/* TODO: Implement Book Banner UI */}
    </YStack>
  );
};

export default BookBanner;