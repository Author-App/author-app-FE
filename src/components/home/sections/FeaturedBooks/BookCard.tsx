import React, { memo } from 'react';
import { YStack, XStack } from 'tamagui';
import { Feather, Ionicons } from '@expo/vector-icons';

import UText from '@/src/components/core/text/uText';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import { formatPrice } from '@/src/utils/currency';
import type { HomeBook } from '@/src/home/types/home.types';
import { ITEM_GAP } from './constants';

export interface BookCardProps {
  item: HomeBook;
  onPress: () => void;
  index: number;
  isAudiobook?: boolean;
  cardWidth: number;
  imageHeight: number;
}

const BookCard = memo(({ item, onPress, index, isAudiobook, cardWidth, imageHeight }: BookCardProps) => {

  return (
    <UAnimatedView animation="fadeInUp" delay={index * 80} duration={400}>
      <YStack
        w={cardWidth}
        mr={ITEM_GAP}
        onPress={onPress}
        pressStyle={{ scale: 0.96, opacity: 0.9 }}
        animation="quick"
      >
        <YStack position="relative">
          <YStack
            w={cardWidth}
            h={imageHeight}
            borderRadius={12}
            overflow="hidden"
            shadowColor="$black"
            shadowOffset={{ width: 0, height: 8 }}
            shadowOpacity={0.25}
            shadowRadius={16}
            elevation={8}
          >
            <ULocalImage
              source={{ uri: item.image }}
              width={cardWidth}
              height={imageHeight}
              contentFit="cover"
            />
          </YStack>

          {isAudiobook && (
            <XStack
              position="absolute"
              top={8}
              right={8}
              bg="$brandCrimson"
              px={8}
              py={4}
              borderRadius={6}
              ai="center"
              gap={4}
            >
              <Feather name="headphones" size={10} color="white" />
              <UText variant="text-xs" color="$white" fontWeight="600">
                Audio
              </UText>
            </XStack>
          )}

          {item.hasAccess && (
            <XStack
            position="absolute"
            bottom={5}
            left={10}
            bg="#FFD700"
            px={8}
            py={4}
            br={6}
            ai="center"
            gap={4}
            zIndex={22}
            shadowColor="#000"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.4}
            shadowRadius={3}
            elevation={4}
          >
            <Ionicons name="checkmark-circle" size={12} color="#132440" />
            <UText variant="text-xs" color="$brandNavy" fontWeight="700">
              Owned
            </UText>
          </XStack>
          )}
        </YStack>

        <YStack mt={12} px={4} gap={4}>
          <UText
            variant="text-sm"
            color="$white"
            fontWeight="500"
            numberOfLines={2}
            lineHeight={18}
          >
            {item.title}
          </UText>
          <XStack
            bg="rgba(59, 151, 151, 0.2)"
            px={10}
            py={4}
            borderRadius={6}
            alignSelf="flex-start"
          >
            <UText variant="text-sm" color="$brandTeal" fontWeight="600">
              {formatPrice(item.price, item.currency)}
            </UText>
          </XStack>
        </YStack>
      </YStack>
    </UAnimatedView>
  );
});

BookCard.displayName = 'BookCard';

export default BookCard;
