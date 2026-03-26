import React, { memo } from 'react';
import { XStack, YStack, YStackProps, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

import UText from '@/src/components/core/text/uText';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import type { ArticleResponse } from '@/src/explore/types/explore.types';
import { formatDate } from '@/src/utils/helper';

interface BlogCardProps extends YStackProps {
  data: ArticleResponse;
  onPress: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ data, onPress, ...props }) => {
  const teal = getTokenValue('$brandTeal', 'color');
  const neutral = getTokenValue('$neutral1', 'color');
  return (
    <UAnimatedView animation="fadeInUp" duration={400}>
      <YStack
        mx={20}
        mb={16}
        bg="$searchbarBg"
        borderRadius={20}
        overflow="hidden"
        onPress={onPress}
        pressStyle={{ scale: 0.98, opacity: 0.9 }}
        animation="quick"
        borderWidth={1}
        borderColor="$searchbarBorder"
        {...props}
      >
        {/* Full-width Image */}
        <YStack h={180} w="100%" position="relative">
          <ULocalImage
            source={{ uri: data.thumbnail }}
            width="100%"
            height={180}
            contentFit="cover"
          />
          
          {/* Read time badge */}
          <XStack
            position="absolute"
            top={12}
            right={12}
            bg="rgba(0,0,0,0.6)"
            px={10}
            py={5}
            br={20}
            ai="center"
            gap={4}
          >
            <Ionicons name="time-outline" size={12} color={neutral} />
            {data.readTime && (
              <UText variant="text-xs" color="$neutral1" fontWeight="500">
                {data.readTime.value} {data.readTime.unit} read
              </UText>
            )}
          </XStack>
        </YStack>

        {/* Content */}
        <YStack p={16} gap={10}>
          {/* Title */}
          <UText
            variant="text-md"
            color="$white"
            fontWeight="600"
            numberOfLines={2}
            lineHeight={24}
          >
            {data.title}
          </UText>

          {/* Meta row: Author & Date */}
          <XStack ai="center" jc="space-between" mt={4}>
            <XStack ai="center" gap={8} flex={1}>
              {data.author?.profileImage ? (
                <YStack w={24} h={24} br={12} overflow="hidden">
                  <ULocalImage
                    source={{ uri: data.author.profileImage }}
                    width={24}
                    height={24}
                    contentFit="cover"
                  />
                </YStack>
              ) : (
                <YStack w={24} h={24} br={12} bg="$brandOcean" ai="center" jc="center">
                  <Ionicons name="person" size={12} color={teal} />
                </YStack>
              )}
              <UText variant="text-xs" color="$neutral1" numberOfLines={1} flex={1}>
                {data.author?.name || 'Unknown Author'}
              </UText>
            </XStack>

            <XStack ai="center" gap={4}>
              <Ionicons name="calendar-outline" size={12} color={teal} />
              <UText variant="text-xs" color="$brandTeal">
                {data.publishedAt ? formatDate(data.publishedAt) : 'Recently'}
              </UText>
            </XStack>
          </XStack>
        </YStack>
      </YStack>
    </UAnimatedView>
  );
};

export default memo(BlogCard);
