import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { YStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import UText from '@/src/components/core/text/uText';
import UBadge from '@/src/components/core/display/uBadge';
import ULocalImage from '@/src/components/core/image/uLocalImage';

export const AUDIO_COVER_SIZE = 220;

interface AudioHeroProps {
  title: string;
  duration?: string;
  thumbnail?: string | null;
  subtitle?: string;
}

/** Square cover with a cyan glow, title, optional author, and the duration chip. */
export const AudioHero = memo(function AudioHero({ title, duration, thumbnail, subtitle }: AudioHeroProps) {
  return (
    <UAnimatedView animation="fadeInUp" delay={100}>
      <YStack ai="center" gap={12}>
        {/* Shadow on the outer view: overflow hidden on the same view would clip it */}
        <YStack
          w={AUDIO_COVER_SIZE}
          h={AUDIO_COVER_SIZE}
          br={24}
          mb={10}
          boxShadow="0 24px 48px rgba(0,0,0,0.8), 0 0 40px rgba(0,240,255,0.25)"
        >
          <YStack flex={1} br={24} overflow="hidden" borderWidth={1} borderColor="$glassCyanBorder" ai="center" jc="center">
            {thumbnail ? (
              <ULocalImage source={{ uri: thumbnail }} width="100%" height="100%" contentFit="cover" />
            ) : (
              <>
                <LinearGradient
                  colors={['#0C3A52', '#1B0F3F']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                <Ionicons name="headset-outline" size={64} color={getTokenValue('$accentCyan', 'color')} />
              </>
            )}
          </YStack>
        </YStack>

        <UText variant="display-l" color="$textPrimary" textAlign="center" accessibilityRole="header">
          {title}
        </UText>

        {subtitle && (
          <UText variant="body" fontSize={14} lineHeight={20} color="$textSecondary" textAlign="center">
            {subtitle}
          </UText>
        )}

        {duration && <UBadge label={duration} tone="cyan" alignSelf="center" />}
      </YStack>
    </UAnimatedView>
  );
});
