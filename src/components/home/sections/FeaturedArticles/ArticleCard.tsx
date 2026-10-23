import React, { memo } from 'react';
import { YStack, YStackProps } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import type { HomeArticle } from '@/src/home/types/home.types';

// Not in the artboards: built from the Continue Reading card's glass recipe
export const ARTICLE_WIDTH = 240;
export const ARTICLE_GAP = 12;

export interface ArticleCardProps extends YStackProps {
  item: HomeArticle;
  index: number;
  onPress: () => void;
}

const ArticleCard = memo(({ item, index, onPress, ...props }: ArticleCardProps) => (
  <UAnimatedView animation="fadeInUp" delay={index * 100} duration={400}>
    <YStack
      w={ARTICLE_WIDTH}
      br={20}
      overflow="hidden"
      bg="$glass"
      borderWidth={1}
      borderColor="$glassBorder"
      pressStyle={{ scale: 0.98, opacity: 0.9 }}
      animation="quick"
      onPress={onPress}
      accessible
      accessibilityRole="button"
      accessibilityLabel={item.title}
      {...props}
    >
      <ULocalImage source={{ uri: item.image }} width="100%" height={135} contentFit="cover" />
      <YStack p={12} gap={6}>
        <UText variant="display-s" color="$textPrimary" numberOfLines={2}>
          {item.title}
        </UText>
        {item.readTime && (
          <UText variant="meta-s" color="$accentCyan">
            {item.readTime.value} {item.readTime.unit} read
          </UText>
        )}
      </YStack>
    </YStack>
  </UAnimatedView>
));

ArticleCard.displayName = 'ArticleCard';

export default ArticleCard;
