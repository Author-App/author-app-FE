import React, { memo } from 'react';
import { XStack, YStack, YStackProps, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

import UText from '@/src/components/core/text/uText';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import haptics from '@/src/utils/haptics';
import type { CommunityResponse } from '@/src/explore/types/explore.types';

interface CommunityCardProps extends YStackProps {
  data: CommunityResponse;
  onPress: () => void;
  onToggleJoin: () => void;
  isToggling?: boolean;
}

const CommunityCard: React.FC<CommunityCardProps> = ({
  data,
  onPress,
  onToggleJoin,
  isToggling,
  ...props
}) => {
  const teal = getTokenValue('$brandTeal', 'color');
  const white = getTokenValue('$white', 'color');
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
        {/* Thumbnail */}
        <YStack h={140} w="100%" position="relative">
          {data.thumbnail ? (
            <ULocalImage
              source={{ uri: data.thumbnail }}
              width="100%"
              height={140}
              contentFit="cover"
            />
          ) : (
            <YStack flex={1} bg="$brandOcean" ai="center" jc="center">
              <Ionicons name="people" size={48} color={teal} style={{ opacity: 0.5 }} />
            </YStack>
          )}

          {/* Joined badge */}
          {data.isJoined && (
            <XStack
              position="absolute"
              top={12}
              left={12}
              bg="$brandTeal"
              px={10}
              py={5}
              br={20}
              ai="center"
              gap={4}
            >
              <Ionicons name="checkmark-circle" size={12} color={white} />
              <UText variant="text-xs" color="$white" fontWeight="600">
                Joined
              </UText>
            </XStack>
          )}

          {/* Thread count badge */}
          <XStack
            position="absolute"
            bottom={12}
            right={12}
            bg="rgba(0,0,0,0.6)"
            px={10}
            py={5}
            br={20}
            ai="center"
            gap={4}
          >
            <Ionicons name="chatbubbles-outline" size={12} color={neutral} />
            <UText variant="text-xs" color="$neutral1" fontWeight="500">
              {data.threadCount} {data.threadCount === 1 ? 'thread' : 'threads'}
            </UText>
          </XStack>
        </YStack>

        {/* Content */}
        <YStack p={16} gap={12}>
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

          {/* Description */}
          {data.description && (
            <UText
              variant="text-sm"
              color="$neutral1"
              numberOfLines={2}
              lineHeight={20}
              opacity={0.8}
            >
              {data.description}
            </UText>
          )}

          {/* Join/Exit button */}
          <XStack
            mt={4}
            bg={data.isJoined ? 'transparent' : '$brandTeal'}
            borderWidth={1}
            borderColor={data.isJoined ? '$brandCrimson' : '$brandTeal'}
            br={12}
            py={10}
            ai="center"
            jc="center"
            gap={8}
            opacity={isToggling ? 0.5 : 1}
            onPress={(e) => {
              e.stopPropagation?.();
              if (!isToggling) {
                haptics.medium();
                onToggleJoin();
              }
            }}
            pressStyle={{ opacity: 0.7, scale: 0.98 }}
            animation="quick"
          >
            <Ionicons
              name={data.isJoined ? 'exit-outline' : 'enter-outline'}
              size={16}
              color={data.isJoined ? getTokenValue('$brandCrimson', 'color') : white}
            />
            <UText
              variant="text-sm"
              color={data.isJoined ? '$brandCrimson' : '$white'}
              fontWeight="600"
            >
              {data.isJoined ? 'Leave Community' : 'Join Community'}
            </UText>
          </XStack>
        </YStack>
      </YStack>
    </UAnimatedView>
  );
};

export default memo(CommunityCard);
