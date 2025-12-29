import React, { memo } from 'react';
import { YStack, XStack, YStackProps } from 'tamagui';

import type { ExploreTabType } from '@/src/explore/types/explore.types';

import UText from '@/src/components/core/text/uText';
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
    <YStack px={20} gap={20} mb={16} {...props}>
      <UAnimatedView animation="fadeInUp" duration={400}>
        <YStack gap={4}>
          <XStack ai="center" gap={12}>
            <YStack w={4} h={28} bg="$brandCrimson" br={2} />
            <UText variant="playfair-xl" color="$white">
              Explore
            </UText>
          </XStack>
          <XStack pl={16}>
            <UText variant="text-sm" color="$brandTeal" opacity={0.8}>
              Discover amazing content
            </UText>
          </XStack>
        </YStack>
      </UAnimatedView>

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
  );
};

export default memo(ExploreHeader);
