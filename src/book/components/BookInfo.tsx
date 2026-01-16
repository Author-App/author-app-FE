import React from 'react';
import { YStack, XStack } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import type { BookResponse, Tag } from '@/src/types/api/library.types';

interface BookInfoProps {
  book: BookResponse;
}

// Tag colors that cycle based on index
const TAG_COLORS = [
  '$brandCrimson',
  '$brandTeal',
  '$brandOcean',
] as const;

function BookTag({ tag, index }: { tag: Tag; index: number }) {
  const colorIndex = index % TAG_COLORS.length;
  const bgColor = TAG_COLORS[colorIndex];

  return (
    <YStack
      bg={bgColor}
      borderRadius={20}
      px={14}
      py={6}
    >
      <UText variant="text-sm" color="$white">
        {tag.name}
      </UText>
    </YStack>
  );
}

export function BookTags({ book }: BookInfoProps) {
  if (!book.tags || book.tags.length === 0) return null;

  return (
    <UAnimatedView animation="fadeInUp" delay={200}>
      <XStack gap={8} mt={24} px={20} flexWrap="wrap" jc="center">
        {book.tags.map((tag, index) => (
          <BookTag key={tag.id || index} tag={tag} index={index} />
        ))}
      </XStack>
    </UAnimatedView>
  );
}
