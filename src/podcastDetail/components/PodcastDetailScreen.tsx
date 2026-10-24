import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { YStack } from 'tamagui';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UBackButton from '@/src/components/core/buttons/uBackButton';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import UStickyTitleBar, { STICKY_BAR_HEIGHT } from '@/src/components/core/layout/uStickyTitleBar';
import UScreenError from '@/src/components/core/feedback/UScreenError';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';

import {
  AudioHero,
  AudioMiniPlayer,
  AudioPlayer,
  AudioSkeleton,
  MINI_PLAYER_CLEARANCE,
  useAudioPlayer,
} from '@/src/components/core/audio';
import { usePodcastDetail } from '../hooks/usePodcastDetail';
import { useSaveMediaProgress } from '@/src/hooks/useSaveMediaProgress';
import { PodcastDescription } from './PodcastDescription';
import { RelatedPodcastList } from './RelatedPodcastList';

export function PodcastDetailScreen() {
  const { podcastId } = useLocalSearchParams<{ podcastId: string }>();
  const { top, bottom } = useSafeAreaInsets();

  const { podcast, relatedPodcasts, formattedDuration, isLoading, isError, refetch } = usePodcastDetail(podcastId);

  const initialPosition = (podcast?.progress?.currentPositionSec ?? 0) * 1000;

  // Saves progress before going back, so the previous screen shows the new resume point
  const { handleBack, handleProgressUpdate } = useSaveMediaProgress(podcastId);

  // One player for the screen: the full controls and the mini player drive the same audio
  const audio = useAudioPlayer(podcast?.fileUrl, {
    autoPlay: true,
    initialPosition,
    onProgressUpdate: handleProgressUpdate,
  });

  const scrollY = useSharedValue(0);
  // The mini player shows once the full controls have scrolled out of view
  const playerBottom = useSharedValue(600);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  const backButton = (
    <YStack pos="absolute" top={top + 8} left={16} zIndex={2}>
      <UBackButton variant="glass-md" />
    </YStack>
  );

  if (isLoading) {
    return (
      <UScreenLayout pt={top + STICKY_BAR_HEIGHT} px={20}>
        {backButton}
        <AudioSkeleton />
      </UScreenLayout>
    );
  }

  if (isError || !podcast) {
    return (
      <UScreenLayout pt={top} pb={bottom}>
        {backButton}
        <UScreenError message="Unable to load podcast. Please try again." onRetry={refetch} />
      </UScreenLayout>
    );
  }

  return (
    <UScreenLayout>
      {/* Hero glow behind the cover. Static, not a live blur. */}
      <LinearGradient colors={['#0A1E2A', 'rgba(2,1,3,0)']} style={styles.heroGlow} pointerEvents="none" />

      {/* Back button only: the mini player carries the title */}
      <UStickyTitleBar scrollY={scrollY} onBack={handleBack} />

      <Animated.ScrollView
        style={{ marginTop: top + STICKY_BAR_HEIGHT }}
        contentContainerStyle={{ paddingBottom: bottom + MINI_PLAYER_CLEARANCE + 24 }}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <YStack px={20}>
          <AudioHero title={podcast.name} duration={formattedDuration} thumbnail={podcast.thumbnail} />
        </YStack>

        <YStack px={20} mt={28} onLayout={(e) => (playerBottom.value = e.nativeEvent.layout.y + e.nativeEvent.layout.height)}>
          <UAnimatedView animation="fadeInUp" delay={200}>
            <AudioPlayer audio={audio} />
          </UAnimatedView>
        </YStack>

        {podcast.description && <PodcastDescription description={podcast.description} />}

        <RelatedPodcastList podcasts={relatedPodcasts} />
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
    </UScreenLayout>
  );
}

const styles = StyleSheet.create({
  heroGlow: { position: 'absolute', top: 0, left: 0, right: 0, height: 420 },
});
