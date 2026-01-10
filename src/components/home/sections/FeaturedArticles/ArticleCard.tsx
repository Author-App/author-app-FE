import React, { memo } from 'react';
import { YStack, XStack, XStackProps } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import type { HomeArticle } from '@/src/home/types/home.types';
import { CARD_HEIGHT, CARD_GAP, IMAGE_WIDTH } from './constants';

export interface ArticleCardProps extends XStackProps {
  item: HomeArticle;
  index: number;
  cardWidth: number;
  onPress: () => void;
}

const ArticleCard = memo(({ item, index, cardWidth, onPress, ...props }: ArticleCardProps) => (
  <UAnimatedView animation="fadeInUp" delay={index * 100} duration={400}>
    <XStack
      w={cardWidth}
      h={CARD_HEIGHT}
      mr={CARD_GAP}
      bg="$neutralAlphaLight1"
      borderRadius={16}
      overflow="hidden"
      pressStyle={{ scale: 0.98, opacity: 0.9 }}
      animation="quick"
      borderWidth={1}
      borderColor="$neutralAlphaLight1"
      onPress={onPress}
      {...props}
    >
      <YStack w={IMAGE_WIDTH} h={CARD_HEIGHT}>
        <ULocalImage
          source={{ uri: item.image }}
          width={IMAGE_WIDTH}
          height={CARD_HEIGHT}
          contentFit="cover"
        />
      </YStack>

      <YStack flex={1} p={16} jc="space-between" w={0}>
        <XStack>
          <YStack
            bg="$brandOcean"
            px={10}
            py={4}
            borderRadius={4}
          >
            <UText
              variant="text-xs"
              color="$white"
              fontWeight="600"
              textTransform="uppercase"
            >
              Article
            </UText>
          </YStack>
        </XStack>

        <UText
          variant="text-md"
          color="$white"
          fontWeight="500"
          numberOfLines={3}
          lineHeight={22}
        >
          {item.title}
        </UText>

        <XStack ai="center" gap={8}>
          <YStack w={4} h={4} borderRadius={2} bg="$brandTeal" />
          {item.readTime && (
            <UText variant="text-xs" color="$neutralAlphaLight6">
              {item.readTime.value} {item.readTime.unit} read
            </UText>
          )}
        </XStack>
      </YStack>
    </XStack>
  </UAnimatedView>
));

ArticleCard.displayName = 'ArticleCard';

export default ArticleCard;
