import React from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet } from 'react-native';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { YStack } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ULocalImage from '@/src/components/core/image/uLocalImage';
import UStickyTitleBar, { STICKY_BAR_HEIGHT } from '@/src/components/core/layout/uStickyTitleBar';
import { useLayoutClass } from '@/src/components/core/layout/useLayoutClass';
import { READ_MAX_LONG } from '@/src/components/core/layout/layout';
import { ArticleHeader } from '../ArticleHeader';
import { ArticleContent } from '../ArticleContent';
import type { ArticleLayoutProps } from './article.types';

export const HERO_HEIGHT = 320;

/** One scroll: hero, header, text. iPhone as designed; medium keeps it and caps the text. */
const ArticleCompact = ({ article, refreshControl, refreshProps }: ArticleLayoutProps) => {
  const { top, bottom } = useSafeAreaInsets();
  const { size, side } = useLayoutClass();
  const isCompact = size === 'compact';

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

  return (
    <>
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
          px={isCompact ? 24 : side}
          maw={isCompact ? undefined : side * 2 + READ_MAX_LONG}
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
    </>
  );
};

const styles = StyleSheet.create({
  heroFade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 180 },
});

export default ArticleCompact;
