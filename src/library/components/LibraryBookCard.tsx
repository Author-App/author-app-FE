import React, { memo } from 'react';
import { YStack, XStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import UText from '@/src/components/core/text/uText';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import { formatDurationCompact } from '@/src/utils/helper';
import type { BookResponse } from '@/src/types/api/library.types';

interface LibraryBookCardProps {
  book: BookResponse;
  onPress: () => void;
  index: number;
  numColumns: number;
}

const LibraryBookCard: React.FC<LibraryBookCardProps> = ({
  book,
  onPress,
  index,
  numColumns,
}) => {
  const teal = getTokenValue('$brandTeal', 'color');
  const isAudiobook = book.type === 'audiobook';

  // Calculate margins for grid spacing
  const isLeftColumn = index % numColumns === 0;
  const isRightColumn = index % numColumns === numColumns - 1;

  return (
    <YStack
      flex={1}
      mb={16}
      ml={isLeftColumn ? 16 : 6}
      mr={isRightColumn ? 16 : 6}
      borderRadius={16}
      overflow="hidden"
      bg="rgba(255,255,255,0.04)"
      borderWidth={1}
      borderColor="rgba(255,255,255,0.06)"
      onPress={onPress}
      pressStyle={{ opacity: 0.92, scale: 0.97 }}
    >
      {/* Cover Image with Cinematic Overlay */}
      <YStack h={270} w="100%" position="relative">
        <ULocalImage
          source={book.thumbnail}
          w="100%"
          h="100%"
        />
        {/* Cinematic Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(19,36,64,0.4)', 'rgba(19,36,64,0.95)']}
          locations={[0.3, 0.6, 1]}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100%',
          }}
        />

        <XStack
          position="absolute"
          top={10}
          left={10}
          right={10}
          jc="space-between"
          ai="center"
        >
          <YStack
            bg={isAudiobook ? '$brandTeal' : '$brandCrimson'}
            px={10}
            py={5}
            br={8}
          >
            <XStack ai="center" gap={5}>
              <Ionicons
                name={isAudiobook ? 'headset' : 'book'}
                size={11}
                color="white"
              />
              <UText variant="text-xs" color="$white" fontWeight="600">
                {isAudiobook ? 'Audio' : 'E-Book'}
              </UText>
            </XStack>
          </YStack>
          {/* Bookmark */}
          {book.bookmark && (
            <YStack bg="rgba(0,0,0,0.5)" p={6} br={8}>
              <Ionicons name="bookmark" size={16} color={teal} />
            </YStack>
          )}
        </XStack>

        {/* Owned Badge */}
        {book.hasAccess && !book.isFree && (
          <XStack
            position="absolute"
            bottom={5}
            left={10}
            bg="$brandTeal"
            px={8}
            py={4}
            br={6}
            ai="center"
            gap={4}
            zIndex={22}
          >
            <Ionicons name="checkmark-circle" size={12} color="white" />
            <UText variant="text-xs" color="$white" fontWeight="600">
              Owned
            </UText>
          </XStack>
        )}

        {/* Bottom Content Overlay */}
        <YStack
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          p={12}
          gap={6}
        >
          {/* Title */}
          <UText
            variant="text-sm"
            color="$white"
            fontWeight="700"
            numberOfLines={2}
            lineHeight={18}
          >
            {book.title}
          </UText>

          {/* Author */}
          <UText
            variant="text-xs"
            color="$brandTeal"
            numberOfLines={1}
            fontWeight="500"
          >
            {book.author}
          </UText>
        </YStack>
      </YStack>

      {/* Bottom Info Bar */}
      <XStack
        px={12}
        py={10}
        ai="center"
        jc="space-between"
        bg="rgba(255,255,255,0.02)"
        borderTopWidth={1}
        borderTopColor="rgba(255,255,255,0.05)"
      >
        {/* Price/Free Badge */}
        {book.isFree ? (
          <YStack bg="$brandTeal" px={10} py={4} br={6}>
            <UText variant="text-xs" color="$brandNavy" fontWeight="700">
              FREE
            </UText>
          </YStack>
        ) : (
          <UText variant="text-sm" color="$brandTeal" fontWeight="700">
            ${book.price}
          </UText>
        )}

        {/* Duration/Pages with Icon */}
        <XStack ai="center" gap={6}>
          {isAudiobook && book.durationSec ? (
            <XStack ai="center" gap={4} bg="rgba(255,255,255,0.06)" px={8} py={4} br={6}>
              <Ionicons name="time-outline" size={12} color={teal} />
              <UText variant="text-xs" color="$white" fontWeight="500">
                {formatDurationCompact(book.durationSec)}
              </UText>
            </XStack>
          ) : book.totalPages ? (
            <XStack ai="center" gap={4} bg="rgba(255,255,255,0.06)" px={8} py={4} br={6}>
              <Ionicons name="document-text-outline" size={12} color={teal} />
              <UText variant="text-xs" color="$white" fontWeight="500">
                {book.totalPages} pages
              </UText>
            </XStack>
          ) : null}
        </XStack>
      </XStack>
    </YStack>
  );
};

export default memo(LibraryBookCard);
