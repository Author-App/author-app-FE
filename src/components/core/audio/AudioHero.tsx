import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { YStack, XStack } from 'tamagui';

import IconHeadphone from '@/assets/icons/iconHeadphone';
import IconDuration from '@/assets/icons/iconDuration';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import UText from '@/src/components/core/text/uText';
import ULocalImage from '@/src/components/core/image/uLocalImage';

interface AudioHeroProps {
  title: string;
  duration?: string;
  thumbnail?: string | null;
  subtitle?: string;
  artworkSize?: number;
}

export const AudioHero = memo(function AudioHero({
  title,
  duration,
  thumbnail,
  subtitle,
  artworkSize = 140,
}: AudioHeroProps) {
  const borderRadius = Math.round(artworkSize * 0.17); // ~24 for 140
  const iconContainerSize = Math.round(artworkSize * 0.5);
  const iconSize = Math.round(artworkSize * 0.26);

  return (
    <UAnimatedView animation="fadeInUp" delay={100}>
      <YStack ai="center" mt={24} mb={24}>
        {/* Artwork Container with Glow Effect */}
        <YStack ai="center" jc="center" mb={24}>
          <YStack
            w={artworkSize}
            h={artworkSize}
            br={borderRadius}
            overflow="hidden"
            bg="$color4"
            shadowColor="$brandCrimson"
            shadowOffset={{ width: 0, height: 8 }}
            shadowOpacity={0.4}
            shadowRadius={20}
            elevation={10}
          >
            {thumbnail ? (
              <ULocalImage
                source={thumbnail}
                w="100%"
                h="100%"
                borderRadius={borderRadius}
              />
            ) : (
              <YStack flex={1} ai="center" jc="center">
                <LinearGradient
                  colors={['#8B1538', '#5C0E25', '#3D0918']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                <YStack
                  w={iconContainerSize}
                  h={iconContainerSize}
                  br={iconContainerSize / 2}
                  bg="rgba(255, 255, 255, 0.15)"
                  ai="center"
                  jc="center"
                >
                  <IconHeadphone dimen={iconSize} />
                </YStack>
              </YStack>
            )}
          </YStack>
        </YStack>

        {/* Title */}
        <UText
          variant="heading-h1"
          color="$white"
          textAlign="center"
          px={16}
        >
          {title}
        </UText>

        {/* Subtitle (optional) */}
        {subtitle && (
          <UText
            variant="text-md"
            color="$neutral3"
            textAlign="center"
            mt={4}
          >
            {subtitle}
          </UText>
        )}

        {/* Duration Badge */}
        {duration && (
          <XStack
            ai="center"
            gap={6}
            mt={12}
            px={16}
            py={8}
            br={20}
            bg="rgba(255, 255, 255, 0.1)"
          >
            <IconDuration dimen={16} />
            <UText variant="text-sm" color="$neutral1">
              {duration}
            </UText>
          </XStack>
        )}
      </YStack>
    </UAnimatedView>
  );
});
