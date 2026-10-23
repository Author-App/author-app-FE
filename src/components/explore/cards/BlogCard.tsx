import React, { memo } from 'react';
import { YStack } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import type { ArticleResponse } from '@/src/explore/types/explore.types';
import { formatDate } from '@/src/utils/helper';

interface BlogCardProps {
  data: ArticleResponse;
  onPress: (data: ArticleResponse) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ data, onPress, ...props }) => {
  const meta = [
    data.publishedAt ? formatDate(data.publishedAt) : null,
    data.readTime ? `${data.readTime.value} ${data.readTime.unit} read` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <YStack
      mx={16}
      mb={14}
      br={24}
      overflow="hidden"
      bg="$glass"
      borderWidth={1}
      borderColor="$glassBorder"
      onPress={() => onPress(data)}
      pressStyle={{ scale: 0.98, opacity: 0.9 }}
      animation="quick"
      accessible
      accessibilityRole="button"
      accessibilityLabel={data.title}
    >
      <ULocalImage source={{ uri: data.thumbnail }} width="100%" height={168} contentFit="cover" />

      <YStack pt={14} px={16} pb={16} gap={6}>
        {meta !== '' && (
          <UText variant="meta-s" color="$accentCyan">
            {meta}
          </UText>
        )}
        <UText variant="display-s" fontSize={15} lineHeight={20} color="$textPrimary" numberOfLines={2}>
          {data.title}
        </UText>
      </YStack>
    </YStack>
  );
};

export default memo(BlogCard);
