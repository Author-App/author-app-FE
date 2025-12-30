import React from 'react';
import { ScrollView } from 'react-native';
import { YStack, XStack, getTokenValue } from 'tamagui';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ULocalImage from '@/src/components/core/image/uLocalImage';
import UBackButton from '@/src/components/core/buttons/uBackButton';
import AppLoader from '@/src/components/core/loaders/AppLoader';
import UScreenError from '@/src/components/core/feedback/UScreenError';
import { useURefreshControl } from '@/src/components/core/feedback/URefreshControl';

import { useArticleData } from '@/src/article/hooks/useArticleData';
import { ArticleHeader } from './ArticleHeader';
import { ArticleContent } from './ArticleContent';

export function ArticleScreen() {
  const { top } = useSafeAreaInsets();

  const { id } = useLocalSearchParams<{ id: string }>();
  const { article, isLoading, isRefreshing, isError, refetch } = useArticleData(id);

  // Custom refresh control
  const { refreshControl, refreshProps } = useURefreshControl({
    refreshing: isRefreshing,
    onRefresh: refetch,
  });

  // Get brandNavy for gradient
  const brandNavy = getTokenValue('$brandNavy', 'color') as string;
  const gradientColors = [`${brandNavy}00`, `${brandNavy}CC`, brandNavy] as const;

  // Loading state
  if (isLoading) {
    return (
      <YStack flex={1} backgroundColor="$brandNavy">
            <XStack
                pt={top + 8}
                pb={12}
                px={16}
                backgroundColor='$brandNavy'
                >
                <UBackButton variant='glass-md' />
            </XStack>
        <AppLoader size={150} />
      </YStack>
    );
  }

  // Error state
  if (isError || !article) {
    return (
      <YStack flex={1} backgroundColor="$brandNavy">
            <XStack
                pt={top + 8}
                pb={12}
                px={16}
                backgroundColor='$brandNavy'
                >
                <UBackButton variant='glass-md' />
            </XStack>
        <UScreenError 
          message="We couldn't load this article. Please try again." 
          onRetry={refetch} 
        />
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$brandNavy">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        {...refreshProps}
      >
        {/* Custom Refresh Indicator */}
        {refreshControl}
        {/* Hero Image */}
        {article.thumbnail ? (
          <YStack height={280} position="relative">
            <ULocalImage
              source={{ uri: article.thumbnail }}
              width="100%"
              height={280}
              contentFit="cover"
            />
            <LinearGradient
              colors={gradientColors}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: 120,
              }}
            />
            {/* Back button overlay */}
            <YStack position="absolute" top={0} left={0} right={0}>
              <XStack
                pt={top + 8}
                pb={12}
                px={16}
                backgroundColor='transparent'
                >
                <UBackButton variant='glass-md' />
               </XStack>
            </YStack>
          </YStack>
        ) : (
            <XStack
                pt={top + 8}
                pb={12}
                px={16}
                backgroundColor='transparent'
                >
                <UBackButton variant='glass-md' />
            </XStack>
        )}

        {/* Content Card */}
        <YStack
          px={20}
          py={24}
          marginTop={article.thumbnail ? -40 : 0}
          gap={24}
        >
          <ArticleHeader article={article} />

          <YStack height={1} backgroundColor="$color4" />

          <ArticleContent content={article.content} />

          <YStack height={40} />
        </YStack>
      </ScrollView>
    </YStack>
  );
}
