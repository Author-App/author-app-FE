import React from 'react';
import { YStack } from 'tamagui';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UBackButton from '@/src/components/core/buttons/uBackButton';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import { STICKY_BAR_HEIGHT } from '@/src/components/core/layout/uStickyTitleBar';
import { useLayoutClass } from '@/src/components/core/layout/useLayoutClass';
import UScreenError from '@/src/components/core/feedback/UScreenError';

import { AudioSkeleton, useAudioPlayer } from '@/src/components/core/audio';
import { usePodcastDetail } from '../hooks/usePodcastDetail';
import { useSaveMediaProgress } from '@/src/hooks/useSaveMediaProgress';
import PodcastCompact from './layouts/PodcastCompact';
import PodcastExpanded, { PodcastExpandedSkeleton } from './layouts/PodcastExpanded';

export function PodcastDetailScreen() {
  const { podcastId } = useLocalSearchParams<{ podcastId: string }>();
  const { top, bottom } = useSafeAreaInsets();
  const { size, side } = useLayoutClass();

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

  const backButton = (
    <YStack pos="absolute" top={top + 8} left={16} zIndex={2}>
      <UBackButton variant="glass-md" />
    </YStack>
  );

  if (isLoading && size === 'expanded') {
    return (
      <UScreenLayout>
        {backButton}
        <PodcastExpandedSkeleton />
      </UScreenLayout>
    );
  }

  if (isLoading) {
    return (
      <UScreenLayout pt={top + STICKY_BAR_HEIGHT} px={size === 'compact' ? 20 : side}>
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

  const Layout = size === 'expanded' ? PodcastExpanded : PodcastCompact;

  return (
    <UScreenLayout>
      <Layout
        podcast={podcast}
        relatedPodcasts={relatedPodcasts}
        formattedDuration={formattedDuration}
        audio={audio}
        onBack={handleBack}
      />
    </UScreenLayout>
  );
}
