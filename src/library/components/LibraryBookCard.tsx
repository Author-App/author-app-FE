import React, { memo } from 'react';
import { YStack, XStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

import UText from '@/src/components/core/text/uText';
import UBadge from '@/src/components/core/display/uBadge';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import { formatDurationCompact } from '@/src/utils/helper';
import { formatPrice } from '@/src/utils/currency';
import type { BookResponse } from '@/src/types/api/library.types';
import { getBookTypeLabel, getBookTypeTone } from '@/src/utils/bookHelpers';

interface LibraryBookCardProps {
  book: BookResponse;
  onPress: () => void;
}

const LibraryBookCard: React.FC<LibraryBookCardProps> = ({
  book,
  onPress,
}) => {
  const price = book.isFree ? 'Free' : formatPrice(book.price, book.currency);
  const length =
    book.type === 'audiobook' && book.durationSec
      ? formatDurationCompact(book.durationSec)
      : book.totalPages
        ? `${book.totalPages} pages`
        : null;
  const owned = book.hasAccess && !book.isFree;

  return (
    <YStack
      flex={1}
      mb={20}
      p={8}
      pb={10}
      gap={8}
      br={16}
      bg="$glass"
      borderWidth={1}
      borderColor="$glassBorder"
      onPress={onPress}
      pressStyle={{ opacity: 0.92, scale: 0.97 }}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${book.title}, ${getBookTypeLabel(book.type)}, ${owned ? 'owned' : price}`}
    >
      {/* Shadow on the outer view: overflow hidden on the same view would clip it */}
      <YStack aspectRatio={2 / 3} br={10} boxShadow="0 8px 16px rgba(0,0,0,0.6)">
        <YStack flex={1} br={10} overflow="hidden">
          <ULocalImage source={book.thumbnail} w="100%" h="100%" contentFit="cover" />
        </YStack>

        <UBadge
          label={getBookTypeLabel(book.type)}
          tone={getBookTypeTone(book.type)}
          onImage
          pos="absolute"
          top={8}
          left={8}
        />
        {book.bookmark && (
          <YStack pos="absolute" top={6} right={6} p={6} br={8} bg="rgba(2,1,3,0.8)">
            <Ionicons name="bookmark" size={14} color={getTokenValue('$accentCyan', 'color')} />
          </YStack>
        )}
        {owned && <UBadge label="Owned" tone="purple" onImage pos="absolute" bottom={8} left={8} />}
      </YStack>

      <UText variant="display-s" color="$textPrimary" numberOfLines={2} reserveLines={2}>
        {book.title}
      </UText>
      <XStack jc="space-between" ai="center" gap={6}>
        <UText variant="display-s" color="$accentCyan">
          {price}
        </UText>
        {length && (
          <UText variant="meta-s" color="$textMuted" numberOfLines={1}>
            {length}
          </UText>
        )}
      </XStack>
    </YStack>
  );
};

export default memo(LibraryBookCard);
