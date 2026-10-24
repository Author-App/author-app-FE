import React from 'react';
import { XStack, YStack } from 'tamagui';
import Animated, { useAnimatedScrollHandler, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UText from '@/src/components/core/text/uText';
import UBadge from '@/src/components/core/display/uBadge';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import UStickyTitleBar, { STICKY_BAR_HEIGHT } from '@/src/components/core/layout/uStickyTitleBar';
import { DETAIL_HERO_HEIGHT, UDetailHero } from '@/src/components/core/layout/uDetailHero';
import { NeonButton } from '@/src/components/core/buttons/neonButton';
import type { CommunityDetailResponse } from '@/src/types/api/community.types';

// Clears the fixed action bar: 14 top + 52 button + the home indicator, plus room to breathe
const ACTION_BAR_CLEARANCE = 120;

interface CommunityAboutViewProps {
  community: CommunityDetailResponse;
  onJoin: () => void;
  isJoining: boolean;
  /** Joined members came here from the chat, so back and the CTA both return to it */
  onShowChat?: () => void;
}

export function CommunityAboutView({ community, onJoin, isJoining, onShowChat }: CommunityAboutViewProps) {
  const { top, bottom } = useSafeAreaInsets();
  const threadCount = community.threads.length;

  const scrollY = useSharedValue(0);
  const titleBottom = useSharedValue(DETAIL_HERO_HEIGHT);
  const showTitleAt = useDerivedValue(() => titleBottom.value - (top + STICKY_BAR_HEIGHT));
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  return (
    <UScreenLayout>
      <UStickyTitleBar scrollY={scrollY} showTitleAt={showTitleAt} title={community.title} onBack={onShowChat} />

      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: bottom + ACTION_BAR_CLEARANCE }}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <UDetailHero thumbnail={community.thumbnail} icon="people-outline" />

        <YStack px={20} mt={-70}>
          <YStack gap={12} pb={24} onLayout={(e) => (titleBottom.value = DETAIL_HERO_HEIGHT - 70 + e.nativeEvent.layout.height)}>
            <XStack gap={8}>
              <UBadge label={`${threadCount} ${threadCount === 1 ? 'discussion' : 'discussions'}`} tone="purple" onImage />
              {community.isJoined && <UBadge label="Joined" tone="cyan" onImage />}
            </XStack>
            <UText variant="display-l" color="$textPrimary" accessibilityRole="header">
              {community.title}
            </UText>
          </YStack>

          {community.description && (
            <UAnimatedView animation="fadeInUp" delay={200}>
              <YStack gap={10}>
                <UText variant="display-m" color="$textPrimary" accessibilityRole="header">
                  About
                </UText>
                <UText variant="body" color="$textSecondary">
                  {community.description}
                </UText>
              </YStack>
            </UAnimatedView>
          )}
        </YStack>
      </Animated.ScrollView>

      <XStack
        pos="absolute"
        left={0}
        right={0}
        bottom={0}
        pt={14}
        px={16}
        pb={Math.max(bottom, 16)}
        bg="rgba(7,5,18,0.88)"
        borderTopWidth={1}
        borderTopColor="$glassBorder"
      >
        {community.isJoined ? (
          <NeonButton flex={1} onPress={onShowChat} title="View Discussions" />
        ) : (
          <NeonButton flex={1} onPress={onJoin} loading={isJoining} title="Join Community" />
        )}
      </XStack>
    </UScreenLayout>
  );
}
