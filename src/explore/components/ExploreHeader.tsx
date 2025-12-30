import React, { memo } from 'react';
import { YStack, YStackProps } from 'tamagui';

import type { ExploreTabType } from '@/src/explore/types/explore.types';

import UHeader from '@/src/components/core/layout/uHeader';
import USearchbar from '@/src/components/core/inputs/uSearchbar';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import UButtonTabs, { TabItem } from '@/src/components/core/buttons/uButtonTabs';

const EXPLORE_TABS: TabItem<ExploreTabType>[] = [
  { label: 'Blogs', icon: 'book-outline' },
  { label: 'Podcasts', icon: 'headset-outline' },
  { label: 'Videos', icon: 'play-circle-outline' },
  { label: 'Events', icon: 'calendar-outline' },
  { label: 'Community', icon: 'people-outline' },
];

interface ExploreHeaderProps extends YStackProps {
  search: string;
  onSearchChange: (text: string) => void;
  activeTab: ExploreTabType;
  onTabChange: (tab: ExploreTabType) => void;
}

const ExploreHeader: React.FC<ExploreHeaderProps> = ({
  search,
  onSearchChange,
  activeTab,
  onTabChange,
  ...props
}) => {
  return (
    <YStack gap={20} mb={16} {...props}>
      <UHeader
        variant="premium"
        title="Explore"
        subtitle="Discover amazing content"
        safeAreaDisabled
        pb={0}
      />

      <YStack px={20} gap={20}>
        <UAnimatedView animation="fadeInUp" duration={400} delay={100}>
          <USearchbar
            search={search}
            onSearchChange={onSearchChange}
            placeholder={`Search ${activeTab.toLowerCase()}...`}
            onClear={() => onSearchChange('')}
          />
        </UAnimatedView>

        <UAnimatedView animation="fadeInUp" duration={400} delay={200}>
          <UButtonTabs
            tabs={EXPLORE_TABS}
            activeTab={activeTab}
            onTabChange={onTabChange}
          />
        </UAnimatedView>
      </YStack>
    </YStack>
  );
};

export default memo(ExploreHeader);
