import React from 'react';
import { ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { YStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UHeader from '@/src/components/core/layout/uHeader';
import UBackButton from '@/src/components/core/buttons/uBackButton';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import AppLoader from '@/src/components/core/loaders/AppLoader';
import UScreenError from '@/src/components/core/feedback/UScreenError';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';

import { AudioPlayer, AudioHero } from '@/src/components/core/audio';
import { useAudiobookPlayer } from '../hooks/useAudiobookPlayer';

export function AudiobookPlayerScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const { bottom } = useSafeAreaInsets();

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

  // Loading state
  if (isLoading || (!isAudioReady && !isError)) {
    return (
      <UScreenLayout>
        <UHeader
          title="Audiobook"
          leftControl={<UBackButton variant="glass-md" />}
        />
        <YStack flex={1} ai="center" jc="center">
          <AppLoader bg="transparent" />
        </YStack>
      </UScreenLayout>
    );
  }

  // Error state
  if (isError || !book) {
    return (
      <UScreenLayout>
        <UHeader
          title="Audiobook"
          leftControl={<UBackButton variant="glass-md" />}
        />
        <UScreenError
          message="Unable to load audiobook. Please try again."
          onRetry={refetch}
        />
      </UScreenLayout>
    );
  }

  return (
    <UScreenLayout>
      <UHeader
        title="Now Playing"
        leftControl={<UBackButton variant="glass-md" onPress={handleBack} />}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottom + 24 }}
      >
        <YStack px={20}>
          {/* Hero: Cover, Title, Author, Duration */}
          <AudioHero
            title={book.title}
            subtitle={book.author}
            duration={formattedDuration}
            thumbnail={book.thumbnail}
          />

          {/* Audio Player */}
          <UAnimatedView animation="fadeInUp" delay={200}>
            <AudioPlayer
              audioUrl={audioUrl}
              autoPlay
              initialPosition={initialPosition}
              onProgressUpdate={handleProgressUpdate}
            />
          </UAnimatedView>
        </YStack>
      </ScrollView>
    </UScreenLayout>
  );
}
