import React from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet } from 'react-native';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { YStack } from 'tamagui';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ULocalImage from '@/src/components/core/image/uLocalImage';
import UBackButton from '@/src/components/core/buttons/uBackButton';
import UStickyTitleBar, { STICKY_BAR_HEIGHT } from '@/src/components/core/layout/uStickyTitleBar';
import USkeleton from '@/src/components/core/display/uSkeleton';
import UScreenError from '@/src/components/core/feedback/UScreenError';
import { useURefreshControl } from '@/src/components/core/feedback/URefreshControl';

import { useArticleData } from '@/src/article/hooks/useArticleData';
import { ArticleHeader } from './ArticleHeader';
import { ArticleContent } from './ArticleContent';

const HERO_HEIGHT = 320;

/** The calm reading surface: no glow, no haze, just the hero image fading into the page. */
export function ArticleScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { article, isLoading, isRefreshing, isError, refetch } = useArticleData(id);

  const { refreshControl, refreshProps } = useURefreshControl({
    refreshing: isRefreshing,
    onRefresh: refetch,
  });

  // The bar shows the title once the header block has scrolled under it
  const scrollY = useSharedValue(0);
  const contentY = useSharedValue(0);
  const headerBottom = useSharedValue(400);
  const showTitleAt = useDerivedValue(() => contentY.value + headerBottom.value - (top + STICKY_BAR_HEIGHT));

  // One JS handler for both: pull-to-refresh already listens on onScroll
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollY.value = e.nativeEvent.contentOffset.y;
    refreshProps.onScroll(e);
  };

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
        <USkeleton width="100%" height={HERO_HEIGHT} radius={0} />
        <YStack px={24} mt={-40} gap={14}>
          <USkeleton width={140} height={12} radius={6} />
          <USkeleton width="90%" height={24} radius={8} />
          <USkeleton width="60%" height={24} radius={8} />
          <USkeleton width="100%" height={14} radius={7} mt={16} />
          <USkeleton width="100%" height={14} radius={7} />
          <USkeleton width="80%" height={14} radius={7} />
        </YStack>
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

  return (
    <YStack flex={1} bg="$bgReading">
      <UStickyTitleBar scrollY={scrollY} showTitleAt={showTitleAt} title={article.title} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: bottom + 60 }}
        showsVerticalScrollIndicator={false}
        {...refreshProps}
        onScroll={handleScroll}
      >
        {refreshControl}

        {article.thumbnail && (
          <YStack h={HERO_HEIGHT}>
            <ULocalImage source={{ uri: article.thumbnail }} width="100%" height={HERO_HEIGHT} contentFit="cover" />
            {/* Fades the image into the reading surface */}
            <LinearGradient colors={['rgba(5,3,12,0)', '#05030C']} style={styles.heroFade} pointerEvents="none" />
          </YStack>
        )}

        {/* Overlaps the fade when there is a hero; clears the back button when there is not */}
        <YStack
          px={24}
          gap={18}
          mt={article.thumbnail ? -70 : top + 68}
          onLayout={(e) => (contentY.value = e.nativeEvent.layout.y)}
        >
          <YStack onLayout={(e) => (headerBottom.value = e.nativeEvent.layout.y + e.nativeEvent.layout.height)}>
            <ArticleHeader article={article} />
          </YStack>
          <YStack h={1} bg="$borderSoft" />
          <ArticleContent content={article.content} />
        </YStack>
      </ScrollView>
    </YStack>
  );
}

const styles = StyleSheet.create({
  heroFade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 180 },
});
