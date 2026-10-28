import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { XStack, YStack } from 'tamagui';
import { useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UStickyTitleBar, { STICKY_BAR_HEIGHT } from '@/src/components/core/layout/uStickyTitleBar';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import { useLayoutClass } from '@/src/components/core/layout/useLayoutClass';
import { PANE_GAP, paneWidth } from '@/src/components/core/layout/layout';
import { AudioHero, AudioPlayer, AudioSkeleton } from '@/src/components/core/audio';
import USkeleton from '@/src/components/core/display/uSkeleton';
import { PodcastDescription } from '../PodcastDescription';
import { RelatedPodcastList } from '../RelatedPodcastList';
import type { PodcastLayoutProps } from './podcast.types';

/** Two panes: cover and controls stay in view on the left, so no mini player; text and episodes scroll on the right. */
const PodcastExpanded = ({ podcast, relatedPodcasts, formattedDuration, audio, onBack }: PodcastLayoutProps) => {
  const { top, bottom } = useSafeAreaInsets();
  const { side, contentWidth } = useLayoutClass();
  const scrollY = useSharedValue(0);

  return (
    <>
      <LinearGradient colors={['#0A1E2A', 'rgba(2,1,3,0)']} style={styles.heroGlow} pointerEvents="none" />
      <UStickyTitleBar scrollY={scrollY} onBack={onBack} />

      <XStack flex={1} mt={top + STICKY_BAR_HEIGHT} px={side} gap={PANE_GAP}>
        {/* Its own scroll only matters when Larger Text makes it taller than the window */}
        <ScrollView
          style={{ width: paneWidth(contentWidth), flexGrow: 0 }}
          contentContainerStyle={{ paddingBottom: bottom + 24, gap: 28 }}
          showsVerticalScrollIndicator={false}
        >
          <AudioHero title={podcast.name} duration={formattedDuration} thumbnail={podcast.thumbnail} />
          <UAnimatedView animation="fadeInUp" delay={200}>
            <AudioPlayer audio={audio} />
          </UAnimatedView>
        </ScrollView>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: bottom + 24 }}
          showsVerticalScrollIndicator={false}
        >
          {podcast.description && <PodcastDescription description={podcast.description} inset={0} />}
          <RelatedPodcastList podcasts={relatedPodcasts} inset={0} />
        </ScrollView>
      </XStack>
    </>
  );
};

const styles = StyleSheet.create({
  heroGlow: { position: 'absolute', top: 0, left: 0, right: 0, height: 420 },
});

export default PodcastExpanded;

/** The loading shape of PodcastExpanded: cover and controls on the left, text and episodes on the right. */
export const PodcastExpandedSkeleton = () => {
  const { top } = useSafeAreaInsets();
  const { side, contentWidth } = useLayoutClass();

  return (
    <XStack flex={1} mt={top + STICKY_BAR_HEIGHT} px={side} gap={PANE_GAP}>
      <YStack w={paneWidth(contentWidth)}>
        <AudioSkeleton />
      </YStack>
      <YStack flex={1} gap={14} mt={32}>
        <USkeleton width={220} height={20} radius={8} />
        <USkeleton width="100%" height={14} radius={7} />
        <USkeleton width="90%" height={14} radius={7} />
        <USkeleton width="60%" height={14} radius={7} />
        <USkeleton width={180} height={20} radius={8} mt={32} />
        {[0, 1].map((i) => (
          <USkeleton key={i} width="100%" height={100} radius={24} />
        ))}
      </YStack>
    </XStack>
  );
};
