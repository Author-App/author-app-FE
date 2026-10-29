import React from 'react';
import { ScrollView } from 'react-native';
import { XStack, YStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ULocalImage from '@/src/components/core/image/uLocalImage';
import UBackButton from '@/src/components/core/buttons/uBackButton';
import USkeleton from '@/src/components/core/display/uSkeleton';
import { useLayoutClass } from '@/src/components/core/layout/useLayoutClass';
import { PANE_GAP, READ_MAX_LONG, paneWidth } from '@/src/components/core/layout/layout';
import { ArticleHeader } from '../ArticleHeader';
import { ArticleContent } from '../ArticleContent';
import type { ArticleLayoutProps } from './article.types';

// Clears the floating back button
const PANE_TOP = 68;

/** Two panes: the article's identity stays put on the left, the text scrolls on the right. */
const ArticleExpanded = ({ article, refreshControl, refreshProps }: ArticleLayoutProps) => {
  const { top, bottom } = useSafeAreaInsets();
  const { side, contentWidth } = useLayoutClass();
  const pane = paneWidth(contentWidth);

  return (
    <>
      <XStack flex={1} px={side} gap={PANE_GAP}>
        {/* Its own scroll only matters when a long title or Larger Text makes it taller than the window */}
        <ScrollView
          style={{ width: pane, flexGrow: 0 }}
          contentContainerStyle={{ paddingTop: top + PANE_TOP, paddingBottom: bottom + 24, gap: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {article.thumbnail && (
            <YStack aspectRatio={4 / 3} br={20} overflow="hidden" borderWidth={1} borderColor="$glassBorder">
              <ULocalImage source={{ uri: article.thumbnail }} width="100%" height="100%" contentFit="cover" />
            </YStack>
          )}
          <ArticleHeader article={article} />
        </ScrollView>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingTop: top + PANE_TOP, paddingBottom: bottom + 60 }}
          showsVerticalScrollIndicator={false}
          {...refreshProps}
        >
          {refreshControl}
          <YStack maw={READ_MAX_LONG}>
            <ArticleContent content={article.content} />
          </YStack>
        </ScrollView>
      </XStack>
      <YStack pos="absolute" top={top + 8} left={16} zIndex={2}>
        <UBackButton variant="glass-md" />
      </YStack>
    </>
  );
};

export default ArticleExpanded;

/** The loading shape of ArticleExpanded. */
export const ArticleExpandedSkeleton = () => {
  const { top } = useSafeAreaInsets();
  const { side, contentWidth } = useLayoutClass();

  return (
    <XStack flex={1} px={side} gap={PANE_GAP} pt={top + PANE_TOP}>
      <YStack w={paneWidth(contentWidth)} gap={18}>
        <USkeleton width="100%" height={(paneWidth(contentWidth) * 3) / 4} radius={20} />
        <USkeleton width="90%" height={24} radius={8} />
        <USkeleton width="70%" height={24} radius={8} />
        <USkeleton width={160} height={12} radius={6} mt={6} />
      </YStack>
      <YStack flex={1} maw={READ_MAX_LONG} gap={14}>
        {[100, 100, 92, 100, 96, 70, 100, 100, 85].map((w, i) => (
          <USkeleton key={i} width={`${w}%`} height={16} radius={8} />
        ))}
      </YStack>
    </XStack>
  );
};
