import React, { memo } from 'react';
import { YStack, YStackProps } from 'tamagui';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import UButtonTabs, { TabItem } from '@/src/components/core/buttons/uButtonTabs';
import type { LibraryTab } from '@/src/library/types/library.types';

const LIBRARY_TABS: TabItem<string>[] = [
  { label: 'All Books' },
  { label: 'My Books' },
  { label: 'E-Books' },
  { label: 'Audiobooks' },
  { label: 'Hardcover' },
  { label: 'Paperback' },
];

const TAB_TO_TYPE: Record<string, LibraryTab> = {
  'All Books': 'all',
  'My Books': 'owned',
  'E-Books': 'ebook',
  'Audiobooks': 'audiobook',
  'Hardcover': 'hardcover',
  'Paperback': 'paperback',
};

const TYPE_TO_TAB: Record<LibraryTab, string> = {
  'all': 'All Books',
  'owned': 'My Books',
  ebook: 'E-Books',
  audiobook: 'Audiobooks',
  hardcover: 'Hardcover',
  paperback: 'Paperback',
};

interface LibraryFiltersProps extends YStackProps {
  activeTab: LibraryTab;
  onTabChange: (value: LibraryTab) => void;
  inset?: number;
}

const LibraryFilters: React.FC<LibraryFiltersProps> = ({
  activeTab,
  onTabChange,
  inset,
  ...props
}) => {

  const activeTabLabel = TYPE_TO_TAB[activeTab];

  const handleTabChange = (tabLabel: string) => {
    const tabValue = TAB_TO_TYPE[tabLabel] ?? 'all';
    onTabChange(tabValue);
  };

  return (
    <YStack gap={16} {...props}>
      <UAnimatedView animation="fadeInUp" duration={400} delay={100}>
        <UButtonTabs
          tabs={LIBRARY_TABS}
          activeTab={activeTabLabel}
          onTabChange={handleTabChange}
          showIcons={false}
          inset={inset}
        />
      </UAnimatedView>
    </YStack>
  );
};

export default memo(LibraryFilters);