import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { YStack } from 'tamagui';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
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
import { useAudiobookPlayer } from '../hooks/useAudiobookPlayer';

export function AudiobookPlayerScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const { top, bottom } = useSafeAreaInsets();

  const {
    book,
    audioUrl,
    initialPosition,
    formattedDuration,
    isLoading,
    isAudioReady,
    isError,
    handleProgressUpdate,
    handleBack,
    refetch,
  } = useAudiobookPlayer(bookId);

  const audio = useAudioPlayer(audioUrl, { autoPlay: true, initialPosition, onProgressUpdate: handleProgressUpdate });

  const scrollY = useSharedValue(0);
  const playerBottom = useSharedValue(600);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  const backButton = (
    <YStack pos="absolute" top={top + 8} left={16} zIndex={2}>
      <UBackButton variant="glass-md" />
    </YStack>
  );

  if (isLoading || (!isAudioReady && !isError)) {
    return (
      <UScreenLayout pt={top + STICKY_BAR_HEIGHT} px={20}>
        {backButton}
        <AudioSkeleton />
      </UScreenLayout>
    );
  }

  if (isError || !book) {
    return (
      <UScreenLayout pt={top} pb={bottom}>
        {backButton}
        <UScreenError message="Unable to load audiobook. Please try again." onRetry={refetch} />
      </UScreenLayout>
    );
  }

  return (
    <UScreenLayout>
      {/* Hero glow behind the cover. Static, not a live blur. */}
      <LinearGradient colors={['#0A1E2A', 'rgba(2,1,3,0)']} style={styles.heroGlow} pointerEvents="none" />

      <UStickyTitleBar scrollY={scrollY} onBack={handleBack} />

      <Animated.ScrollView
        style={{ marginTop: top + STICKY_BAR_HEIGHT }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: bottom + MINI_PLAYER_CLEARANCE + 24 }}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <AudioHero title={book.title} subtitle={book.author} duration={formattedDuration} thumbnail={book.thumbnail} />

        <YStack mt={28} onLayout={(e) => (playerBottom.value = e.nativeEvent.layout.y + e.nativeEvent.layout.height)}>
          <UAnimatedView animation="fadeInUp" delay={200}>
            <AudioPlayer audio={audio} />
          </UAnimatedView>
        </YStack>
      </Animated.ScrollView>

      <AudioMiniPlayer
        scrollY={scrollY}
        showAt={playerBottom}
        title={book.title}
        thumbnail={book.thumbnail}
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
