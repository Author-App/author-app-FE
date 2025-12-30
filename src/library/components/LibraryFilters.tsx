import React, { memo } from 'react';
import { YStack, YStackProps } from 'tamagui';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import UButtonTabs, { TabItem } from '@/src/components/core/buttons/uButtonTabs';
import type { BookType } from '@/src/library/types/library.types';

const LIBRARY_TABS: TabItem<string>[] = [
  { label: 'All Books', icon: 'library-outline' },
  { label: 'E-Books', icon: 'book-outline' },
  { label: 'Audiobooks', icon: 'headset-outline' },
];

const TAB_TO_TYPE: Record<string, BookType> = {
  'All Books': '',
  'E-Books': 'ebook',
  'Audiobooks': 'audiobook',
};

const TYPE_TO_TAB: Record<BookType, string> = {
  '': 'All Books',
  ebook: 'E-Books',
  audiobook: 'Audiobooks',
};

interface LibraryFiltersProps extends YStackProps {
  activeType: BookType;
  onTypeChange: (value: string) => void;
}

const LibraryFilters: React.FC<LibraryFiltersProps> = ({
  activeType,
  onTypeChange,
  ...props
}) => {

  const activeTab = TYPE_TO_TAB[activeType];

  const handleTabChange = (tabLabel: string) => {
    const typeValue = TAB_TO_TYPE[tabLabel] ?? '';
    onTypeChange(typeValue);
  };

  return (
    <YStack gap={16} {...props}>
      <UAnimatedView animation="fadeInUp" duration={400} delay={100}>
        <UButtonTabs
          tabs={LIBRARY_TABS}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </UAnimatedView>
    </YStack>
  );
};

export default memo(LibraryFilters);