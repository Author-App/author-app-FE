import React from 'react';
import { YStack, XStack, View } from 'tamagui';
import { FlashList } from '@shopify/flash-list';

import UText from '@/src/components/core/text/uText';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import type { RelatedBookCardResponse } from '@/src/types/api/library.types';

interface MoreBooksSectionProps {
  books: RelatedBookCardResponse[];
  onBookPress: (bookId: string) => void;
}

interface RelatedBookCardProps {
  book: RelatedBookCardResponse;
  onPress: () => void;
}

function RelatedBookCard({ book, onPress }: RelatedBookCardProps) {
  return (
    <YStack
      w={140}
      pressStyle={{ opacity: 0.8, scale: 0.98 }}
      onPress={onPress}
      animation="quick"
    >
      <YStack
        shadowColor="$brandCrimson"
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.3}
        shadowRadius={12}
        elevation={6}
      >
        <ULocalImage
          source={{ uri: book.thumbnail }}
          width={140}
          height={190}
          borderRadius={12}
          contentFit="cover"
        />
      </YStack>

      <YStack mt={12} px={4}>
        <UText
          variant="text-sm"
          color="$white"
          numberOfLines={2}
          fontWeight="600"
        >
          {book.title}
        </UText>
        <UText
          variant="text-xs"
          color="$neutral1"
          numberOfLines={1}
          mt={4}
        >
          {book.author}
        </UText>
      </YStack>
    </YStack>
  );
}

export function MoreBooksSection({ books, onBookPress }: MoreBooksSectionProps) {
  return (
    <UAnimatedView animation="fadeInUp" delay={600}>
      <YStack mt={32}>
        <XStack jc="space-between" ai="center" mb={16}>
          <UText variant="heading-h2" color="$white">
            More Books
          </UText>
          <UText variant="text-sm" color="$brandCrimson" fontWeight="600">
            See all
          </UText>
        </XStack>

        <FlashList
          horizontal
          data={books}
          ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <RelatedBookCard
              book={item}
              onPress={() => onBookPress(item.id)}
            />
          )}
        />
      </YStack>
    </UAnimatedView>
  );
}
