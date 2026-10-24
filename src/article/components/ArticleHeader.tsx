import React from 'react';
import { XStack, YStack } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import UCtaGradient from '@/src/components/core/display/uCtaGradient';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import type { ArticleDetailResponse } from '../types/article.types';
import { formatDate } from '@/src/utils/helper';

interface ArticleHeaderProps {
  article: ArticleDetailResponse;
}

/** The Orbitron title, then the author with the date and read time. */
export function ArticleHeader({ article }: ArticleHeaderProps) {
  const meta = [
    formatDate(article.publishedAt ?? article.createdAt),
    article.readTime ? `${article.readTime.value} ${article.readTime.unit} read` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <YStack gap={18}>
      <UText variant="display-l" fontSize={24} lineHeight={30} letterSpacing={0.48} color="$textPrimary" accessibilityRole="header">
        {article.title}
      </UText>

      {/* Author with the date and read time under the name */}
      <XStack ai="center" gap={12}>
        {article.author.profileImage ? (
          <ULocalImage source={article.author.profileImage} w={40} h={40} borderRadius={20} />
        ) : (
          <YStack w={40} h={40} br={20} ai="center" jc="center" overflow="hidden">
            <UCtaGradient radius={20} />
            <UText variant="display-s" fontSize={15} color="$textPrimary">
              {article.author.name.charAt(0)}
            </UText>
          </YStack>
        )}
        <YStack flex={1} gap={4}>
          <UText variant="body" fontSize={14} lineHeight={20} fontWeight="600" color="$textPrimary">
            {article.author.name}
          </UText>
          <UText variant="meta" color="$accentCyan">
            {meta}
          </UText>
        </YStack>
      </XStack>
    </YStack>
  );
}
