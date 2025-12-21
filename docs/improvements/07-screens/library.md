# Library Screen Improvements

## Current Location
`app/(app)/(tabs)/library.tsx` or `app/(app)/library/index.tsx`

## Current Problems

1. No tab/segment for content types (Books/Podcasts/Videos)
2. No sorting options
3. No filter options (status, format, etc.)
4. No progress tracking visible
5. No download management
6. Empty library not handled gracefully

## Improvements Required

### 1. Content Type Tabs

```tsx
// src/components/library/contentTabs.tsx
import React from 'react';
import { XStack, Text } from 'tamagui';
import { UPressableButton } from '@/src/components/core/buttons/uPressableButton';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';

type ContentType = 'all' | 'books' | 'podcasts' | 'videos';

interface ContentTabsProps {
  activeTab: ContentType;
  onTabChange: (tab: ContentType) => void;
  counts: { all: number; books: number; podcasts: number; videos: number };
}

const tabs: { id: ContentType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'books', label: 'Books' },
  { id: 'podcasts', label: 'Podcasts' },
  { id: 'videos', label: 'Videos' },
];

export const ContentTabs = React.memo(({
  activeTab,
  onTabChange,
  counts,
}: ContentTabsProps) => {
  return (
    <XStack 
      paddingHorizontal="$4" 
      gap="$2" 
      borderBottomWidth={1} 
      borderBottomColor="$neutral4"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <UPressableButton
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            hapticType="selection"
          >
            <YStack
              paddingVertical="$3"
              paddingHorizontal="$3"
              borderBottomWidth={2}
              borderBottomColor={isActive ? '$primary7' : 'transparent'}
            >
              <XStack alignItems="center" gap="$1.5">
                <Text
                  fontSize={14}
                  fontWeight={isActive ? '600' : '400'}
                  color={isActive ? '$primary7' : '$neutral9'}
                >
                  {tab.label}
                </Text>
                <Text
                  fontSize={12}
                  color={isActive ? '$primary7' : '$neutral7'}
                >
                  ({counts[tab.id]})
                </Text>
              </XStack>
            </YStack>
          </UPressableButton>
        );
      })}
    </XStack>
  );
});
```

### 2. Sort & Filter Bar

```tsx
// src/components/library/sortFilterBar.tsx
import React from 'react';
import { XStack, Text } from 'tamagui';
import { UPressableButton } from '@/src/components/core/buttons/uPressableButton';
import { ArrowUpDown, Filter, Grid, List } from 'lucide-react-native';

type SortOption = 'recent' | 'title' | 'author' | 'progress';
type ViewMode = 'grid' | 'list';

interface SortFilterBarProps {
  sortBy: SortOption;
  onSortPress: () => void;
  onFilterPress: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  activeFiltersCount: number;
}

export const SortFilterBar = React.memo(({
  sortBy,
  onSortPress,
  onFilterPress,
  viewMode,
  onViewModeChange,
  activeFiltersCount,
}: SortFilterBarProps) => {
  const sortLabels: Record<SortOption, string> = {
    recent: 'Recently Added',
    title: 'Title A-Z',
    author: 'Author',
    progress: 'Progress',
  };

  return (
    <XStack 
      paddingHorizontal="$4" 
      paddingVertical="$3" 
      justifyContent="space-between"
      alignItems="center"
    >
      <XStack gap="$3">
        {/* Sort Button */}
        <UPressableButton onPress={onSortPress} hapticType="light">
          <XStack 
            alignItems="center" 
            gap="$2" 
            paddingHorizontal="$3" 
            paddingVertical="$2"
            backgroundColor="$neutral2"
            borderRadius={8}
          >
            <ArrowUpDown size={16} color="#6B7280" />
            <Text fontSize={13} color="$neutral11">
              {sortLabels[sortBy]}
            </Text>
          </XStack>
        </UPressableButton>

        {/* Filter Button */}
        <UPressableButton onPress={onFilterPress} hapticType="light">
          <XStack 
            alignItems="center" 
            gap="$2" 
            paddingHorizontal="$3" 
            paddingVertical="$2"
            backgroundColor={activeFiltersCount > 0 ? '$primary2' : '$neutral2'}
            borderRadius={8}
          >
            <Filter size={16} color={activeFiltersCount > 0 ? '#B4975A' : '#6B7280'} />
            <Text 
              fontSize={13} 
              color={activeFiltersCount > 0 ? '$primary7' : '$neutral11'}
            >
              Filters{activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ''}
            </Text>
          </XStack>
        </UPressableButton>
      </XStack>

      {/* View Toggle */}
      <XStack 
        backgroundColor="$neutral2" 
        borderRadius={8} 
        padding="$1"
      >
        <UPressableButton 
          onPress={() => onViewModeChange('grid')} 
          hapticType="selection"
        >
          <XStack
            padding="$2"
            borderRadius={6}
            backgroundColor={viewMode === 'grid' ? 'white' : 'transparent'}
          >
            <Grid size={16} color={viewMode === 'grid' ? '#B4975A' : '#6B7280'} />
          </XStack>
        </UPressableButton>
        <UPressableButton 
          onPress={() => onViewModeChange('list')} 
          hapticType="selection"
        >
          <XStack
            padding="$2"
            borderRadius={6}
            backgroundColor={viewMode === 'list' ? 'white' : 'transparent'}
          >
            <List size={16} color={viewMode === 'list' ? '#B4975A' : '#6B7280'} />
          </XStack>
        </UPressableButton>
      </XStack>
    </XStack>
  );
});
```

### 3. Library Item Card with Progress

```tsx
// src/components/library/libraryItemCard.tsx
import React from 'react';
import { YStack, XStack, Text, Image } from 'tamagui';
import { UPressableButton } from '@/src/components/core/buttons/uPressableButton';
import { MoreHorizontal, Download, CheckCircle } from 'lucide-react-native';

interface LibraryItem {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  type: 'book' | 'podcast' | 'video';
  progress: number; // 0-100
  isDownloaded: boolean;
  isCompleted: boolean;
}

interface LibraryItemCardProps {
  item: LibraryItem;
  onPress: () => void;
  onMenuPress: () => void;
  viewMode: 'grid' | 'list';
}

export const LibraryItemCard = React.memo(({
  item,
  onPress,
  onMenuPress,
  viewMode,
}: LibraryItemCardProps) => {
  if (viewMode === 'grid') {
    return (
      <UPressableButton onPress={onPress} hapticType="light">
        <YStack width={110}>
          {/* Cover */}
          <YStack position="relative">
            <Image
              source={{ uri: item.coverUrl }}
              width={110}
              height={160}
              borderRadius={8}
            />
            
            {/* Completed Badge */}
            {item.isCompleted && (
              <YStack
                position="absolute"
                top={6}
                right={6}
                backgroundColor="$green10"
                borderRadius={12}
                padding="$1"
              >
                <CheckCircle size={14} color="white" />
              </YStack>
            )}

            {/* Download Status */}
            {item.isDownloaded && (
              <YStack
                position="absolute"
                top={6}
                left={6}
                backgroundColor="$primary7"
                borderRadius={12}
                padding="$1"
              >
                <Download size={14} color="white" />
              </YStack>
            )}

            {/* Progress Bar */}
            {item.progress > 0 && item.progress < 100 && (
              <YStack
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                height={3}
                backgroundColor="rgba(0,0,0,0.3)"
              >
                <YStack
                  width={`${item.progress}%`}
                  height={3}
                  backgroundColor="$primary7"
                />
              </YStack>
            )}
          </YStack>

          {/* Info */}
          <YStack marginTop="$2">
            <Text fontSize={12} fontWeight="500" numberOfLines={1}>
              {item.title}
            </Text>
            <Text fontSize={11} color="$neutral9" numberOfLines={1}>
              {item.author}
            </Text>
          </YStack>
        </YStack>
      </UPressableButton>
    );
  }

  // List View
  return (
    <UPressableButton onPress={onPress} hapticType="light">
      <XStack
        backgroundColor="$neutral2"
        borderRadius={12}
        padding="$3"
        marginHorizontal="$4"
        alignItems="center"
        gap="$3"
      >
        <Image
          source={{ uri: item.coverUrl }}
          width={60}
          height={85}
          borderRadius={6}
        />

        <YStack flex={1} gap="$1">
          <Text fontSize={14} fontWeight="600" numberOfLines={1}>
            {item.title}
          </Text>
          <Text fontSize={12} color="$neutral9" numberOfLines={1}>
            {item.author}
          </Text>
          
          {/* Progress */}
          <XStack alignItems="center" gap="$2" marginTop="$1">
            <YStack flex={1} height={4} backgroundColor="$neutral4" borderRadius={2}>
              <YStack
                width={`${item.progress}%`}
                height={4}
                backgroundColor={item.isCompleted ? '$green10' : '$primary7'}
                borderRadius={2}
              />
            </YStack>
            <Text fontSize={11} color="$neutral9">
              {item.progress}%
            </Text>
          </XStack>
        </YStack>

        {/* Status Icons */}
        <XStack gap="$2" alignItems="center">
          {item.isDownloaded && <Download size={16} color="#B4975A" />}
          <UPressableButton onPress={onMenuPress} hapticType="light">
            <MoreHorizontal size={20} color="#6B7280" />
          </UPressableButton>
        </XStack>
      </XStack>
    </UPressableButton>
  );
});
```

### 4. Filter Bottom Sheet

```tsx
// src/components/library/filterBottomSheet.tsx
import React from 'react';
import { YStack, XStack, Text, Sheet } from 'tamagui';
import { UPressableButton } from '@/src/components/core/buttons/uPressableButton';
import { Check } from 'lucide-react-native';

interface FilterOption {
  id: string;
  label: string;
}

interface FilterGroup {
  title: string;
  key: string;
  options: FilterOption[];
  multiSelect: boolean;
}

const filterGroups: FilterGroup[] = [
  {
    title: 'Status',
    key: 'status',
    options: [
      { id: 'all', label: 'All' },
      { id: 'in-progress', label: 'In Progress' },
      { id: 'completed', label: 'Completed' },
      { id: 'not-started', label: 'Not Started' },
    ],
    multiSelect: false,
  },
  {
    title: 'Download Status',
    key: 'download',
    options: [
      { id: 'all', label: 'All' },
      { id: 'downloaded', label: 'Downloaded' },
      { id: 'not-downloaded', label: 'Not Downloaded' },
    ],
    multiSelect: false,
  },
];

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Record<string, string[]>;
  onFiltersChange: (filters: Record<string, string[]>) => void;
}

export const FilterBottomSheet = React.memo(({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
}: FilterBottomSheetProps) => {
  const handleOptionSelect = (groupKey: string, optionId: string, multiSelect: boolean) => {
    const currentValues = filters[groupKey] || [];
    let newValues: string[];

    if (multiSelect) {
      newValues = currentValues.includes(optionId)
        ? currentValues.filter(v => v !== optionId)
        : [...currentValues, optionId];
    } else {
      newValues = [optionId];
    }

    onFiltersChange({ ...filters, [groupKey]: newValues });
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Sheet.Frame padding="$4">
        <YStack gap="$5">
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={18} fontWeight="700">
              Filters
            </Text>
            <UPressableButton 
              onPress={() => onFiltersChange({})} 
              hapticType="light"
            >
              <Text fontSize={14} color="$primary7">
                Reset All
              </Text>
            </UPressableButton>
          </XStack>

          {filterGroups.map((group) => (
            <YStack key={group.key} gap="$3">
              <Text fontSize={14} fontWeight="600" color="$neutral11">
                {group.title}
              </Text>
              
              <XStack flexWrap="wrap" gap="$2">
                {group.options.map((option) => {
                  const isSelected = (filters[group.key] || ['all']).includes(option.id);
                  
                  return (
                    <UPressableButton
                      key={option.id}
                      onPress={() => handleOptionSelect(group.key, option.id, group.multiSelect)}
                      hapticType="selection"
                    >
                      <XStack
                        paddingHorizontal="$4"
                        paddingVertical="$2.5"
                        borderRadius={20}
                        backgroundColor={isSelected ? '$primary7' : '$neutral2'}
                        alignItems="center"
                        gap="$2"
                      >
                        {isSelected && <Check size={14} color="white" />}
                        <Text
                          fontSize={14}
                          color={isSelected ? 'white' : '$neutral11'}
                        >
                          {option.label}
                        </Text>
                      </XStack>
                    </UPressableButton>
                  );
                })}
              </XStack>
            </YStack>
          ))}

          <UPressableButton onPress={onClose} hapticType="medium">
            <XStack
              backgroundColor="$primary7"
              paddingVertical="$4"
              borderRadius={12}
              justifyContent="center"
            >
              <Text color="white" fontWeight="600">
                Apply Filters
              </Text>
            </XStack>
          </UPressableButton>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
});
```

### 5. Empty Library State

```tsx
// src/components/library/emptyLibrary.tsx
import React from 'react';
import { YStack, Text } from 'tamagui';
import { BookOpen, Search } from 'lucide-react-native';
import { UPressableButton } from '@/src/components/core/buttons/uPressableButton';
import { router } from 'expo-router';

interface EmptyLibraryProps {
  contentType: 'all' | 'books' | 'podcasts' | 'videos';
}

export const EmptyLibrary = React.memo(({ contentType }: EmptyLibraryProps) => {
  const labels = {
    all: 'content',
    books: 'books',
    podcasts: 'podcasts',
    videos: 'videos',
  };

  return (
    <YStack flex={1} alignItems="center" justifyContent="center" padding="$8">
      <YStack
        width={80}
        height={80}
        borderRadius={40}
        backgroundColor="$neutral2"
        alignItems="center"
        justifyContent="center"
        marginBottom="$4"
      >
        <BookOpen size={32} color="#B4975A" />
      </YStack>

      <Text fontSize={18} fontWeight="600" textAlign="center" marginBottom="$2">
        Your library is empty
      </Text>
      
      <Text 
        fontSize={14} 
        color="$neutral9" 
        textAlign="center" 
        marginBottom="$6"
        paddingHorizontal="$4"
      >
        Start building your collection by exploring {labels[contentType]} and adding them to your library.
      </Text>

      <UPressableButton 
        onPress={() => router.push('/(app)/(tabs)/explore')}
        hapticType="medium"
      >
        <XStack
          backgroundColor="$primary7"
          paddingHorizontal="$6"
          paddingVertical="$3"
          borderRadius={12}
          alignItems="center"
          gap="$2"
        >
          <Search size={18} color="white" />
          <Text color="white" fontWeight="600">
            Explore Content
          </Text>
        </XStack>
      </UPressableButton>
    </YStack>
  );
});
```

## Screen Structure

```tsx
// app/(app)/(tabs)/library.tsx
<YStack flex={1} backgroundColor="$background">
  <ContentTabs
    activeTab={activeTab}
    onTabChange={setActiveTab}
    counts={contentCounts}
  />

  <SortFilterBar
    sortBy={sortBy}
    onSortPress={openSortSheet}
    onFilterPress={openFilterSheet}
    viewMode={viewMode}
    onViewModeChange={setViewMode}
    activeFiltersCount={activeFiltersCount}
  />

  {items.length === 0 ? (
    <EmptyLibrary contentType={activeTab} />
  ) : (
    <FlashList
      data={sortedAndFilteredItems}
      renderItem={({ item }) => (
        <LibraryItemCard
          item={item}
          onPress={() => handleItemPress(item)}
          onMenuPress={() => handleMenuPress(item)}
          viewMode={viewMode}
        />
      )}
      numColumns={viewMode === 'grid' ? 3 : 1}
      estimatedItemSize={viewMode === 'grid' ? 200 : 120}
      refreshControl={<RefreshControl />}
    />
  )}

  <FilterBottomSheet
    isOpen={filterSheetOpen}
    onClose={() => setFilterSheetOpen(false)}
    filters={filters}
    onFiltersChange={setFilters}
  />
</YStack>
```

## Testing Checklist

- [ ] Tab switching shows correct content
- [ ] Item counts in tabs are accurate
- [ ] Sort options work correctly
- [ ] Filters apply correctly
- [ ] Filter count badge updates
- [ ] Grid/List toggle works with animation
- [ ] Progress bars show accurate %
- [ ] Downloaded items show icon
- [ ] Completed items show checkmark
- [ ] Empty state shows when no items
- [ ] Empty state CTA navigates to explore
- [ ] Pull-to-refresh works
- [ ] Menu opens for item options
- [ ] Haptic feedback on all interactions
