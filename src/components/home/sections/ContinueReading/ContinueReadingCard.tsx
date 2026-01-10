import React, { memo } from 'react';
import { YStack, XStack, XStackProps } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

import UText from '@/src/components/core/text/uText';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import type { ContinueReadingBook } from '@/src/types/api/home.types';
import { formatPagesLeft, formatLastRead } from '@/src/utils/helper';
import { CARD_HEIGHT, CARD_GAP, IMAGE_WIDTH } from './constants';

export interface ContinueReadingCardProps extends XStackProps {
  item: ContinueReadingBook;
  index: number;
  cardWidth: number;
  onPress: () => void;
}

const ContinueReadingCard = memo(({ item, index, cardWidth, onPress, ...props }: ContinueReadingCardProps) => {
  const progress = item.progress;
  const percentage = progress?.percentage ?? 0;
  const pagesLeft = progress ? formatPagesLeft(progress.currentPage, progress.totalPages) : '';
  const lastRead = progress?.lastReadAt ? formatLastRead(progress.lastReadAt) : '';

  return (
    <UAnimatedView animation="fadeInUp" delay={index * 100} duration={400}>
      <XStack
        w={cardWidth}
        h={CARD_HEIGHT}
        mr={CARD_GAP}
        bg="$neutralAlphaLight1"
        borderRadius={16}
        overflow="hidden"
        pressStyle={{ scale: 0.98, opacity: 0.9 }}
        animation="quick"
        borderWidth={1}
        borderColor="$neutralAlphaLight2"
        onPress={onPress}
        {...props}
      >
        {/* Book Cover */}
        <YStack w={IMAGE_WIDTH} h={CARD_HEIGHT} position="relative">
          <ULocalImage
            source={{ uri: item.image }}
            width={IMAGE_WIDTH}
            height={CARD_HEIGHT}
            contentFit="cover"
          />
        </YStack>

        {/* Content */}
        <YStack flex={1} p={14} jc="space-between" w={0}>
          {/* Title & Last Read */}
          <YStack gap={6}>
            <UText
              variant="text-md"
              color="$white"
              fontWeight="600"
              numberOfLines={2}
              lineHeight={20}
            >
              {item.title}
            </UText>
            {lastRead && (
              <UText variant="text-xs" color="$neutral2">
                Last read {lastRead}
              </UText>
            )}
          </YStack>

          {/* Progress Section */}
          <YStack gap={8}>
            {/* Progress Bar */}
            <YStack w="100%" h={4} bg="$neutralAlphaLight2" borderRadius={2} overflow="hidden">
              <YStack
                h="100%"
                w={`${percentage}%`}
                bg="$secondary"
                borderRadius={2}
              />
            </YStack>

            {/* Progress Info */}
            <XStack jc="space-between" ai="center">
              <UText variant="text-xs" color="$secondary" fontWeight="600">
                {percentage}% complete
              </UText>
              {pagesLeft && (
                <UText variant="text-xs" color="$neutral2">
                  {pagesLeft}
                </UText>
              )}
            </XStack>
          </YStack>
        </YStack>

        {/* Continue Arrow */}
        <YStack
          w={36}
          ai="center"
          jc="center"
        >
          <Ionicons name="chevron-forward" size={22} color="white" />
        </YStack>
      </XStack>
    </UAnimatedView>
  );
});

ContinueReadingCard.displayName = 'ContinueReadingCard';

export default ContinueReadingCard;
