/**
 * ArticleHeader Component
 *
 * Displays article title, author info, and metadata.
 */

import React from 'react';
import { XStack, YStack } from 'tamagui';
import { Image } from 'react-native';
import UText from '@/src/components/core/text/uText';
import type { ArticleDetailResponse } from '../types/article.types';
import { formatDate } from '@/src/utils/helper';

interface ArticleHeaderProps {
  article: ArticleDetailResponse;
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
  const publishedDate = article.publishedAt
    ? formatDate(article.publishedAt)
    : formatDate(article.createdAt);

  const readTimeText = article.readTime
    ? `${article.readTime} min read`
    : null;

  return (
    <YStack gap={16}>
      {/* Title */}
      <UText
        variant="heading-h1"
        color="$white"
        style={{ fontSize: 26, lineHeight: 34, fontWeight: '700' }}
      >
        {article.title}
      </UText>

      {/* Author & Meta */}
      <XStack alignItems="center" gap={12}>
        {article.author.profileImage ? (
          <Image
            source={{ uri: article.author.profileImage }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: '#1E3A5F',
            }}
          />
        ) : (
          <YStack
            width={44}
            height={44}
            borderRadius={22}
            backgroundColor="$brandTeal"
            justifyContent="center"
            alignItems="center"
          >
            <UText color="$white" fontWeight="600" style={{ fontSize: 18 }}>
              {article.author.name.charAt(0).toUpperCase()}
            </UText>
          </YStack>
        )}

        <YStack flex={1}>
          <UText variant="text-md" color="$white" fontWeight="600">
            {article.author.name}
          </UText>
          <XStack alignItems="center" gap={8}>
            <UText variant="text-sm" color="$color10">
              {publishedDate}
            </UText>
            {readTimeText && (
              <>
                <UText color="$color10">•</UText>
                <UText variant="text-sm" color="$color10">
                  {readTimeText}
                </UText>
              </>
            )}
          </XStack>
        </YStack>
      </XStack>
    </YStack>
  );
}
