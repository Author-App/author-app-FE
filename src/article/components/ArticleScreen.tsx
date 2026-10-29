import React from 'react';
import { YStack } from 'tamagui';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UBackButton from '@/src/components/core/buttons/uBackButton';
import USkeleton from '@/src/components/core/display/uSkeleton';
import UScreenError from '@/src/components/core/feedback/UScreenError';
import { useURefreshControl } from '@/src/components/core/feedback/URefreshControl';
import { useLayoutClass } from '@/src/components/core/layout/useLayoutClass';

import { useArticleData } from '@/src/article/hooks/useArticleData';
import ArticleCompact, { HERO_HEIGHT } from './layouts/ArticleCompact';
import ArticleExpanded, { ArticleExpandedSkeleton } from './layouts/ArticleExpanded';

/** The calm reading surface: no glow, no haze, just the hero image fading into the page. */
export function ArticleScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { article, isLoading, isRefreshing, isError, refetch } = useArticleData(id);

  const { size, side } = useLayoutClass();
  const refresh = useURefreshControl({
    refreshing: isRefreshing,
    onRefresh: refetch,
  });

  // Floats over the hero at the top inset in every state
  const backButton = (
    <YStack pos="absolute" top={top + 8} left={16} zIndex={2}>
      <UBackButton variant="glass-md" />
    </YStack>
  );

  if (isLoading) {
    return (
      <YStack flex={1} bg="$bgReading">
        {backButton}
        {size === 'expanded' ? (
          <ArticleExpandedSkeleton />
        ) : (
          <>
            <USkeleton width="100%" height={HERO_HEIGHT} radius={0} />
            <YStack px={size === 'compact' ? 24 : side} mt={-40} gap={14}>
              <USkeleton width={140} height={12} radius={6} />
              <USkeleton width="90%" height={24} radius={8} />
              <USkeleton width="60%" height={24} radius={8} />
              <USkeleton width="100%" height={14} radius={7} mt={16} />
              <USkeleton width="100%" height={14} radius={7} />
              <USkeleton width="80%" height={14} radius={7} />
            </YStack>
          </>
        )}
      </YStack>
    );
  }

  if (isError || !article) {
    return (
      <YStack flex={1} bg="$bgReading" pt={top} pb={bottom}>
        {backButton}
        <UScreenError message="We couldn't load this article. Please try again." onRetry={refetch} />
      </YStack>
    );
  }

  const Layout = size === 'expanded' ? ArticleExpanded : ArticleCompact;

  return (
    <YStack flex={1} bg="$bgReading">
      <Layout article={article} {...refresh} />
    </YStack>
  );
}
