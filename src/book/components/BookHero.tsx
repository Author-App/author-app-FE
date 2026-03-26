import React from 'react';
import { YStack, XStack } from 'tamagui';

import UBackButton from '@/src/components/core/buttons/uBackButton';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import UText from '@/src/components/core/text/uText';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import UStarRating from '@/src/components/core/rating/UStarRating';
import IconBook from '@/assets/icons/iconBook';
import IconHeadphone from '@/assets/icons/iconHeadphone';
import type { BookResponse } from '@/src/types/api/library.types';

interface BookHeroProps {
  book: BookResponse;
  averageRating?: number;
  totalRatings?: number;
}

export function BookHero({ book, averageRating, totalRatings }: BookHeroProps) {
  const isAudiobook = book.type === 'audiobook';
  const TypeIcon = isAudiobook ? IconHeadphone : IconBook;

  return (
  
      <UAnimatedView animation="fadeInUp" delay={100}>
        <YStack ai="center" mb={20} px={20}>
          <YStack
            shadowColor="$brandCrimson"
            shadowOffset={{ width: 0, height: 8 }}
            shadowOpacity={0.4}
            shadowRadius={20}
            elevation={10}
          >
            {book.thumbnail ? (
              <ULocalImage
                source={{ uri: book.thumbnail }}
                width={200}
                height={280}
                borderRadius={12}
                contentFit="contain"
              />
            ) : (
              <YStack
                w={200}
                h={280}
                br={12}
                bg="rgba(255, 255, 255, 0.1)"
                ai="center"
                jc="center"
              >
                <TypeIcon dimen={70} color="$white" />
              </YStack>
            )}
          </YStack>
        </YStack>

        {/* Book title */}
        <UText
          variant="heading-h2"
          color="$white"
          textAlign="center"
        >
          {book.title}
        </UText>

        {/* Author name */}
        <UText
          variant="text-sm"
          color="$neutral3"
          textAlign="center"
          mt={12}
        >
            {book.author}
        </UText>

        <XStack jc="center" ai="center" mt={12} gap={8}>
            <UStarRating rating={averageRating ?? 0} />
            <UText variant="text-sm" color="$neutral1">
                {averageRating && totalRatings
                ? `${averageRating.toFixed(1)} (${totalRatings})`
                : 'No ratings'}
            </UText>
        </XStack>
      </UAnimatedView>
  );
}
