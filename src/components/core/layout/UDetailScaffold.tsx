import React, { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Animated, { useAnimatedScrollHandler, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { XStack, YStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UText from '@/src/components/core/text/uText';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import USkeleton from '@/src/components/core/display/uSkeleton';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import UStickyTitleBar, { STICKY_BAR_HEIGHT } from '@/src/components/core/layout/uStickyTitleBar';
import { DETAIL_HERO_HEIGHT, UDetailHero } from '@/src/components/core/layout/uDetailHero';
import { useLayoutClass } from '@/src/components/core/layout/useLayoutClass';
import { PANE_GAP, READ_MAX, paneWidth } from '@/src/components/core/layout/layout';

const ACTION_BAR_CLEARANCE = 120;
const HERO_OVERLAP = 70;

interface UDetailScaffoldProps {
  title: string;
  badges: ReactNode;
  thumbnail?: string;
  icon: keyof typeof Ionicons.glyphMap;
  /** Facts that belong with the title (date, place): the left pane on wide screens */
  info?: ReactNode;
  /** The call to action: docked at the bottom on narrow screens, inline under the details on expanded */
  action: ReactNode;
  onBack?: () => void;
  /** The reading content */
  children?: ReactNode;
}

/**
 * The hero detail screen (events, communities). Compact and medium: one scroll under a fading hero,
 * action docked. Expanded: two panes, the details and action still on the left, the text on the right.
 */
export function UDetailScaffold({ title, badges, thumbnail, icon, info, action, onBack, children }: UDetailScaffoldProps) {
  const { top, bottom } = useSafeAreaInsets();
  const { size, side, contentWidth } = useLayoutClass();

  const scrollY = useSharedValue(0);
  const titleBottom = useSharedValue(DETAIL_HERO_HEIGHT);
  const showTitleAt = useDerivedValue(() => titleBottom.value - (top + STICKY_BAR_HEIGHT));
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  const header = (
    <YStack gap={12}>
      <XStack gap={8}>{badges}</XStack>
      <UText variant="display-l" color="$textPrimary" accessibilityRole="header">
        {title}
      </UText>
    </YStack>
  );

  if (size === 'expanded') {
    return (
      <UScreenLayout>
        <UStickyTitleBar scrollY={scrollY} onBack={onBack} />
        <XStack flex={1} mt={top + STICKY_BAR_HEIGHT} px={side} gap={PANE_GAP}>
          {/* Its own scroll only matters when a long title or Larger Text makes it taller than the window */}
          <ScrollView
            style={{ width: paneWidth(contentWidth), flexGrow: 0 }}
            contentContainerStyle={{ paddingBottom: bottom + 24, gap: 24 }}
            showsVerticalScrollIndicator={false}
          >
            <YStack aspectRatio={4 / 3} br={20} overflow="hidden" borderWidth={1} borderColor="$glassBorder" ai="center" jc="center">
              {thumbnail ? (
                <ULocalImage source={{ uri: thumbnail }} width="100%" height="100%" contentFit="cover" />
              ) : (
                <>
                  <LinearGradient colors={['#1B0F3F', '#0C3A52']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
                  <Ionicons name={icon} size={64} color={getTokenValue('$accentPurple', 'color')} />
                </>
              )}
            </YStack>
            {header}
            {info}
            {action}
          </ScrollView>

          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: bottom + 24 }} showsVerticalScrollIndicator={false}>
            <YStack maw={READ_MAX}>{children}</YStack>
          </ScrollView>
        </XStack>
      </UScreenLayout>
    );
  }

  const isCompact = size === 'compact';

  return (
    <UScreenLayout>
      <UStickyTitleBar scrollY={scrollY} showTitleAt={showTitleAt} title={title} onBack={onBack} />

      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: bottom + ACTION_BAR_CLEARANCE }}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <UDetailHero thumbnail={thumbnail} icon={icon} />

        <YStack px={isCompact ? 20 : side} mt={-HERO_OVERLAP}>
          <YStack pb={24} onLayout={(e) => (titleBottom.value = DETAIL_HERO_HEIGHT - HERO_OVERLAP + e.nativeEvent.layout.height)}>
            {header}
          </YStack>
          {info}
          <YStack maw={READ_MAX}>{children}</YStack>
        </YStack>
      </Animated.ScrollView>

      <XStack
        pos="absolute"
        left={0}
        right={0}
        bottom={0}
        pt={14}
        px={isCompact ? 16 : side}
        pb={Math.max(bottom, 16)}
        bg="rgba(7,5,18,0.88)"
        borderTopWidth={1}
        borderTopColor="$glassBorder"
      >
        <YStack flex={1} maw={isCompact ? undefined : READ_MAX}>
          {action}
        </YStack>
      </XStack>
    </UScreenLayout>
  );
}

/** The loading shape of UDetailScaffold. `withInfo` reserves the facts card (event date and place). */
export function UDetailScaffoldSkeleton({ withInfo = false }: { withInfo?: boolean }) {
  const { top } = useSafeAreaInsets();
  const { size, side, contentWidth } = useLayoutClass();

  if (size === 'expanded') {
    const pane = paneWidth(contentWidth);
    return (
      <XStack flex={1} mt={top + STICKY_BAR_HEIGHT} px={side} gap={PANE_GAP}>
        <YStack w={pane} gap={16}>
          <USkeleton width="100%" height={(pane * 3) / 4} radius={20} mb={8} />
          <USkeleton width={90} height={22} radius={11} />
          <USkeleton width="85%" height={24} radius={8} />
          {withInfo && <USkeleton width="100%" height={150} radius={20} mt={8} />}
          <USkeleton width="100%" height={56} radius={28} mt={8} />
        </YStack>
        <YStack flex={1} maw={READ_MAX} gap={14}>
          <USkeleton width={180} height={20} radius={8} />
          <USkeleton width="100%" height={14} radius={7} />
          <USkeleton width="90%" height={14} radius={7} />
          <USkeleton width="60%" height={14} radius={7} />
        </YStack>
      </XStack>
    );
  }

  return (
    <>
      <USkeleton width="100%" height={DETAIL_HERO_HEIGHT} radius={0} />
      <YStack px={size === 'compact' ? 20 : side} mt={-40} gap={14}>
        <USkeleton width={90} height={22} radius={11} />
        <USkeleton width="85%" height={24} radius={8} />
        {withInfo ? (
          <USkeleton width="100%" height={150} radius={20} mt={10} />
        ) : (
          <>
            <USkeleton width="100%" height={14} radius={7} mt={16} />
            <USkeleton width="70%" height={14} radius={7} />
          </>
        )}
      </YStack>
    </>
  );
}
