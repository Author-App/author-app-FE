import React, { memo } from 'react';
import { XStack, YStack, YStackProps } from 'tamagui';

import type { ExploreTabType } from '@/src/explore/types/explore.types';

import UHeader from '@/src/components/core/layout/uHeader';
import USearchbar from '@/src/components/core/inputs/uSearchbar';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import UButtonTabs, { TabItem } from '@/src/components/core/buttons/uButtonTabs';

export const EXPLORE_TABS: TabItem<ExploreTabType>[] = [
  { label: 'Blogs', icon: 'book-outline' },
  { label: 'Podcasts', icon: 'headset-outline' },
  { label: 'Videos', icon: 'play-circle-outline' },
  { label: 'Events', icon: 'calendar-outline' },
  { label: 'Community', icon: 'people-outline' },
];

const SEARCH_WIDTH = 420;

interface ExploreHeaderProps extends YStackProps {
  search: string;
  onSearchChange: (text: string) => void;
  activeTab: ExploreTabType;
  onTabChange: (tab: ExploreTabType) => void;
  inset?: number;
  wide?: boolean;
  chipsBeside?: boolean;
}

const ExploreHeader: React.FC<ExploreHeaderProps> = ({
  search,
  onSearchChange,
  activeTab,
  onTabChange,
  inset = 16,
  wide,
  chipsBeside,
  ...props
}) => {
  const searchbar = (
    <USearchbar
      search={search}
      onSearchChange={onSearchChange}
      placeholder={`Search ${activeTab.toLowerCase()}...`}
      onClear={() => onSearchChange('')}
    />
  );
  const chips = (
    <UButtonTabs tabs={EXPLORE_TABS} activeTab={activeTab} onTabChange={onTabChange} inset={chipsBeside ? 0 : inset} />
  );

  return (
    <YStack gap={16} mb={16} {...props}>
      <UHeader
        variant="premium"
        title="Explore"
        subtitle="Discover amazing content"
        safeAreaDisabled
        pb={0}
        {...(wide && { px: inset })}
      />

      {chipsBeside ? (
        <UAnimatedView animation="fadeInUp" duration={400} delay={100}>
          <XStack px={inset} gap={16} ai="center">
            <YStack w={SEARCH_WIDTH}>{searchbar}</YStack>
            <YStack flex={1}>{chips}</YStack>
          </XStack>
        </UAnimatedView>
      ) : (
        <>
          <UAnimatedView animation="fadeInUp" duration={400} delay={100}>
            <YStack px={inset}>
              <YStack maw={wide ? SEARCH_WIDTH : undefined}>{searchbar}</YStack>
            </YStack>
          </UAnimatedView>

          {/* No side padding: the pills scroll edge to edge from the gutter */}
          <UAnimatedView animation="fadeInUp" duration={400} delay={200}>
            {chips}
          </UAnimatedView>
        </>
      )}
    </YStack>
  );
};

export default memo(ExploreHeader);
