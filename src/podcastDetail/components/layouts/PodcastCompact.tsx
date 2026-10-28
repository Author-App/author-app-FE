import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { YStack } from 'tamagui';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UStickyTitleBar, { STICKY_BAR_HEIGHT } from '@/src/components/core/layout/uStickyTitleBar';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import { useLayoutClass } from '@/src/components/core/layout/useLayoutClass';
import { CARD_MIN_LIST } from '@/src/components/core/layout/layout';
import { AudioHero, AudioMiniPlayer, AudioPlayer, MINI_PLAYER_CLEARANCE } from '@/src/components/core/audio';
import { PodcastDescription } from '../PodcastDescription';
import { RelatedPodcastList } from '../RelatedPodcastList';
import type { PodcastLayoutProps } from './podcast.types';

/** One scroll: cover, controls, text. iPhone as designed; medium puts more episodes in a grid. */
const PodcastCompact = ({ podcast, relatedPodcasts, formattedDuration, audio, onBack }: PodcastLayoutProps) => {
  const { top, bottom } = useSafeAreaInsets();
  const { size, side, contentWidth, columns } = useLayoutClass();
  const isCompact = size === 'compact';
  const px = isCompact ? 20 : side;

  const scrollY = useSharedValue(0);
  // The mini player shows once the full controls have scrolled out of view
  const playerBottom = useSharedValue(600);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  return (
    <>
      {/* Hero glow behind the cover. Static, not a live blur. */}
      <LinearGradient colors={['#0A1E2A', 'rgba(2,1,3,0)']} style={styles.heroGlow} pointerEvents="none" />

      {/* Back button only: the mini player carries the title */}
      <UStickyTitleBar scrollY={scrollY} onBack={onBack} />

      <Animated.ScrollView
        style={{ marginTop: top + STICKY_BAR_HEIGHT }}
        contentContainerStyle={{ paddingBottom: bottom + MINI_PLAYER_CLEARANCE + 24 }}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <YStack px={px}>
          <AudioHero title={podcast.name} duration={formattedDuration} thumbnail={podcast.thumbnail} />
        </YStack>

        <YStack px={px} mt={28} onLayout={(e) => (playerBottom.value = e.nativeEvent.layout.y + e.nativeEvent.layout.height)}>
          <UAnimatedView animation="fadeInUp" delay={200}>
            <AudioPlayer audio={audio} />
          </UAnimatedView>
        </YStack>

        {podcast.description && <PodcastDescription description={podcast.description} inset={px} />}

        {isCompact ? (
          <RelatedPodcastList podcasts={relatedPodcasts} />
        ) : (
          <RelatedPodcastList
            podcasts={relatedPodcasts}
            inset={side}
            columns={columns(CARD_MIN_LIST)}
            width={contentWidth}
          />
        )}
      </Animated.ScrollView>

      <AudioMiniPlayer
        scrollY={scrollY}
        showAt={playerBottom}
        title={podcast.name}
        thumbnail={podcast.thumbnail}
        isPlaying={audio.isPlaying}
        isLoading={audio.isLoading}
        onTogglePlay={audio.togglePlayPause}
      />
    </>
  );
};

const styles = StyleSheet.create({
  heroGlow: { position: 'absolute', top: 0, left: 0, right: 0, height: 420 },
});

export default PodcastCompact;
