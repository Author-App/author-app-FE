import React, { useCallback } from 'react';
import { ScrollView } from 'react-native';
import { YStack } from 'tamagui';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UHeader from '@/src/components/core/layout/uHeader';
import UBackButton from '@/src/components/core/buttons/uBackButton';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import AppLoader from '@/src/components/core/loaders/AppLoader';
import UScreenError from '@/src/components/core/feedback/UScreenError';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';

import { usePodcastDetail } from '../hooks/usePodcastDetail';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useSaveMediaProgress } from '@/src/hooks/useSaveMediaProgress';
import { PodcastHero } from './PodcastHero';
import { PodcastPlayer } from './PodcastPlayer';
import { PodcastDescription } from './PodcastDescription';
import { RelatedPodcastList } from './RelatedPodcastList';

export function PodcastDetailScreen() {
  const { podcastId } = useLocalSearchParams<{ podcastId: string }>();
  const { bottom } = useSafeAreaInsets();

  const {
    podcast,
    relatedPodcasts,
    formattedDuration,
    isLoading,
    isError,
    refetch,
  } = usePodcastDetail(podcastId);

  // Calculate initial position from saved progress
  const initialPosition = podcast?.progress?.currentPositionSec
    ? podcast.progress.currentPositionSec * 1000
    : 0;

  const {
    isPlaying,
    isLoading: isAudioLoading,
    togglePlayPause,
    rewind,
    forward,
    seekTo,
    progressRef,
    formatTime,
  } = useAudioPlayer(podcast?.fileUrl, {
    autoPlay: true,
    initialPosition,
  });

  // Handle saving progress when leaving
  const { handleBack } = useSaveMediaProgress(podcastId, progressRef);

  const handleRewind = useCallback(() => rewind(10), [rewind]);
  const handleForward = useCallback(() => forward(10), [forward]);

  // Loading state
  if (isLoading) {
    return (
      <UScreenLayout>
        <UHeader
          title="Podcast"
          leftControl={<UBackButton variant="glass-md" />}
        />
        <YStack flex={1} ai="center" jc="center">
          <AppLoader bg="transparent" />
        </YStack>
      </UScreenLayout>
    );
  }

  // Error state
  if (isError || !podcast) {
    return (
      <UScreenLayout>
        <UHeader
          title="Podcast"
          leftControl={<UBackButton variant="glass-md" />}
        />
        <UScreenError
          message="Unable to load podcast. Please try again."
          onRetry={refetch}
        />
      </UScreenLayout>
    );
  }

  return (
    <UScreenLayout>
      <UHeader
        title="Podcast"
        leftControl={<UBackButton variant="glass-md" onPress={handleBack} />}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottom + 24 }}
      >
        <YStack px={20}>
          <PodcastHero
            title={podcast.name}
            duration={formattedDuration}
            thumbnail={podcast.thumbnail}
          />

          <UAnimatedView animation="fadeInUp" delay={200}>
            <PodcastPlayer
              isPlaying={isPlaying}
              isLoading={isAudioLoading}
              progressRef={progressRef}
              formatTime={formatTime}
              onPlayPause={togglePlayPause}
              onRewind={handleRewind}
              onForward={handleForward}
              onSeek={seekTo}
            />
          </UAnimatedView>

          {podcast.description && (
            <PodcastDescription description={podcast.description} />
          )}

          <RelatedPodcastList podcasts={relatedPodcasts} />
        </YStack>
      </ScrollView>
    </UScreenLayout>
  );
}
