import React, { ReactNode } from 'react';
import { XStack, YStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

import ULocalImage from '@/src/components/core/image/uLocalImage';
import UText from '@/src/components/core/text/uText';
import UBadge from '@/src/components/core/display/uBadge';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import UStarRating from '@/src/components/core/rating/UStarRating';
import type { BookResponse } from '@/src/types/api/library.types';
import { getBookTypeLabel, getBookTypeTone } from '@/src/utils/bookHelpers';

interface BookHeroProps {
  book: BookResponse;
  averageRating?: number;
  totalRatings?: number;
  /** Cover width; the height is always 2:3 */
  coverWidth?: number;
  /** stacked: everything centred under the cover. side: the cover on the left, details beside it (medium) */
  variant?: 'stacked' | 'side';
  /** Side padding of the stacked hero */
  px?: number;
  /** Wide screens: the price and button, placed under the details */
  children?: ReactNode;
}

/** Cover with a purple glow, title, author, rating, then genre tags and the format. */
export function BookHero({
  book,
  averageRating,
  totalRatings,
  coverWidth = 168,
  variant = 'stacked',
  px = 16,
  children,
}: BookHeroProps) {
  const hasRating = !!averageRating && !!totalRatings;
  const isSide = variant === 'side';
  const textAlign = isSide ? 'left' : 'center';

  const cover = (
    <YStack
      w={coverWidth}
      h={coverWidth * 1.5}
      br={14}
      boxShadow="0 24px 48px rgba(0,0,0,0.8), 0 0 40px rgba(135,54,247,0.4)"
    >
      <YStack flex={1} br={14} overflow="hidden" borderWidth={1} borderColor="$inputBorder" ai="center" jc="center" bg="$glassSolid">
        {book.thumbnail ? (
          <ULocalImage source={{ uri: book.thumbnail }} width="100%" height="100%" contentFit="cover" />
        ) : (
          <Ionicons
            name={book.type === 'audiobook' ? 'headset-outline' : 'book-outline'}
            size={56}
            color={getTokenValue('$textMuted', 'color')}
          />
        )}
      </YStack>
    </YStack>
  );

  const title = (
    <UText variant="display-l" color="$textPrimary" textAlign={textAlign} mt={isSide ? 0 : 6} accessibilityRole="header">
      {book.title}
    </UText>
  );

  const author = (
    <UText variant="body" fontSize={14} lineHeight={20} color="$textSecondary" textAlign={textAlign}>
      {book.author}
    </UText>
  );

  const rating = (
    <XStack
      ai="center"
      gap={8}
      // One element for the row: otherwise "Rated 0 out of 5 stars" is read before "No ratings"
      accessible
      accessibilityRole="text"
      accessibilityLabel={
        hasRating ? `Rated ${averageRating!.toFixed(1)} out of 5, ${totalRatings} ratings` : 'No ratings yet'
      }
    >
      <UStarRating rating={averageRating ?? 0} size={16} gap={2} />
      {hasRating ? (
        <>
          <UText variant="display-s" color="$textPrimary">
            {averageRating!.toFixed(1)}
          </UText>
          <UText variant="body-s" color="$textMuted">
            ({totalRatings})
          </UText>
        </>
      ) : (
        <UText variant="body-s" color="$textMuted">
          No ratings
        </UText>
      )}
    </XStack>
  );

  const tags = (
    <XStack gap={8} flexWrap="wrap" jc={isSide ? 'flex-start' : 'center'}>
      {book.tags?.map((tag, index) => (
        <UBadge key={tag.id || index} label={tag.name} tone="purple" />
      ))}
      <UBadge label={getBookTypeLabel(book.type)} tone={getBookTypeTone(book.type)} />
    </XStack>
  );

  if (isSide) {
    return (
      <UAnimatedView animation="fadeInUp" delay={100}>
        <XStack gap={32} ai="flex-start">
          {cover}
          <YStack flex={1} gap={14} pt={4}>
            {tags}
            {title}
            {author}
            {rating}
            {children && <YStack mt={8}>{children}</YStack>}
          </YStack>
        </XStack>
      </UAnimatedView>
    );
  }

  return (
    <UAnimatedView animation="fadeInUp" delay={100}>
      <YStack ai="center" gap={14} px={px}>
        {cover}
        {title}
        {author}
        {rating}
        {tags}
        {children && <YStack alignSelf="stretch" mt={6}>{children}</YStack>}
      </YStack>
    </UAnimatedView>
  );
}
