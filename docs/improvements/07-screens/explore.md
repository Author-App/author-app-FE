# Explore Screen Improvements

## Current Location
`app/(app)/(tabs)/explore.tsx` or `app/(app)/(tabs)/explore/index.tsx`

## Current Problems

1. Shows "Loading..." text instead of skeletons
2. Search may not have debounce
3. No recent searches feature
4. Category filters not prominent
5. Empty search results not handled well
6. No trending/popular section

## Improvements Required

### 1. Enhanced Search Bar

```tsx
// src/components/explore/searchBar.tsx
import React, { useState, useCallback, useRef } from 'react';
import { TextInput, Pressable, Keyboard } from 'react-native';
import { XStack, YStack, Text } from 'tamagui';
import { Search, X, Mic } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { useHaptics } from '@/src/hooks/useHaptics';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  placeholder?: string;
}

export const SearchBar = React.memo(({
  value,
  onChangeText,
  onSubmit,
  onClear,
  placeholder = 'Search books, podcasts, videos...',
}: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const haptics = useHaptics();
  const borderColor = useSharedValue('#E5E5E5');

  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: withTiming(borderColor.value, { duration: 200 }),
  }));

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    borderColor.value = '#B4975A';
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    borderColor.value = '#E5E5E5';
  }, []);

  const handleClear = useCallback(() => {
    haptics.lightTap();
    onClear();
    inputRef.current?.focus();
  }, [onClear]);

  return (
    <Animated.View style={[{
      borderWidth: 1,
      borderRadius: 12,
      marginHorizontal: 16,
    }, animatedStyle]}>
      <XStack alignItems="center" paddingHorizontal="$3" height={48}>
        <Search size={20} color="#9CA3AF" />
        
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={onSubmit}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          returnKeyType="search"
          autoCorrect={false}
          style={{
            flex: 1,
            marginHorizontal: 12,
            fontSize: 16,
            color: '#1F2937',
          }}
          accessibilityLabel="Search"
          accessibilityRole="search"
        />

        {value.length > 0 && (
          <Pressable
            onPress={handleClear}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Clear search"
          >
            <X size={20} color="#9CA3AF" />
          </Pressable>
        )}
      </XStack>
    </Animated.View>
  );
});
```

### 2. Search with Debounce Hook

```tsx
// src/hooks/useDebounce.ts
import { useEffect, useState } from 'react';

export const useDebounce = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
```

### 3. Recent Searches Component

```tsx
// src/components/explore/recentSearches.tsx
import React, { useCallback } from 'react';
import { YStack, XStack, Text } from 'tamagui';
import { UPressableButton } from '@/src/components/core/buttons/uPressableButton';
import { Clock, X, TrendingUp } from 'lucide-react-native';

interface RecentSearchesProps {
  searches: string[];
  onSelect: (query: string) => void;
  onRemove: (query: string) => void;
  onClearAll: () => void;
}

export const RecentSearches = React.memo(({
  searches,
  onSelect,
  onRemove,
  onClearAll,
}: RecentSearchesProps) => {
  if (searches.length === 0) return null;

  return (
    <YStack paddingHorizontal="$4" gap="$3">
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize={16} fontWeight="600" color="$neutral12">
          Recent Searches
        </Text>
        <UPressableButton onPress={onClearAll} hapticType="light">
          <Text fontSize={14} color="$primary7">
            Clear All
          </Text>
        </UPressableButton>
      </XStack>

      {searches.slice(0, 5).map((query, index) => (
        <XStack key={index} justifyContent="space-between" alignItems="center">
          <UPressableButton
            onPress={() => onSelect(query)}
            style={{ flex: 1 }}
            hapticType="light"
          >
            <XStack alignItems="center" gap="$3">
              <Clock size={16} color="#9CA3AF" />
              <Text fontSize={14} color="$neutral11">
                {query}
              </Text>
            </XStack>
          </UPressableButton>
          
          <UPressableButton onPress={() => onRemove(query)} hapticType="light">
            <X size={16} color="#9CA3AF" />
          </UPressableButton>
        </XStack>
      ))}
    </YStack>
  );
});
```

### 4. Category Filter Pills

```tsx
// src/components/explore/categoryFilters.tsx
import React from 'react';
import { ScrollView } from 'react-native';
import { XStack, Text } from 'tamagui';
import { UPressableButton } from '@/src/components/core/buttons/uPressableButton';

interface Category {
  id: string;
  label: string;
}

interface CategoryFiltersProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export const CategoryFilters = React.memo(({
  categories,
  selectedId,
  onSelect,
}: CategoryFiltersProps) => {
  const allCategories: Category[] = [{ id: 'all', label: 'All' }, ...categories];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
    >
      {allCategories.map((category) => {
        const isSelected = category.id === 'all' 
          ? selectedId === null 
          : selectedId === category.id;

        return (
          <UPressableButton
            key={category.id}
            onPress={() => onSelect(category.id === 'all' ? null : category.id)}
            hapticType="selection"
          >
            <XStack
              paddingHorizontal="$4"
              paddingVertical="$2"
              borderRadius={20}
              backgroundColor={isSelected ? '$primary7' : '$neutral3'}
            >
              <Text
                fontSize={14}
                fontWeight="500"
                color={isSelected ? 'white' : '$neutral11'}
              >
                {category.label}
              </Text>
            </XStack>
          </UPressableButton>
        );
      })}
    </ScrollView>
  );
});
```

### 5. Trending Section

```tsx
// src/components/explore/trendingSection.tsx
import React from 'react';
import { YStack, XStack, Text } from 'tamagui';
import { TrendingUp, ArrowRight } from 'lucide-react-native';
import { UPressableButton } from '@/src/components/core/buttons/uPressableButton';

interface TrendingItem {
  id: string;
  title: string;
  searchCount: number;
}

interface TrendingSectionProps {
  items: TrendingItem[];
  onSelect: (query: string) => void;
}

export const TrendingSection = React.memo(({ items, onSelect }: TrendingSectionProps) => {
  if (items.length === 0) return null;

  return (
    <YStack paddingHorizontal="$4" gap="$3">
      <XStack alignItems="center" gap="$2">
        <TrendingUp size={20} color="#B4975A" />
        <Text fontSize={16} fontWeight="600" color="$neutral12">
          Trending Now
        </Text>
      </XStack>

      <XStack flexWrap="wrap" gap="$2">
        {items.slice(0, 8).map((item, index) => (
          <UPressableButton
            key={item.id}
            onPress={() => onSelect(item.title)}
            hapticType="light"
          >
            <XStack
              paddingHorizontal="$3"
              paddingVertical="$2"
              borderRadius={8}
              backgroundColor="$neutral2"
              borderWidth={1}
              borderColor="$neutral4"
              alignItems="center"
              gap="$2"
            >
              <Text fontSize={12} color="$primary7" fontWeight="600">
                #{index + 1}
              </Text>
              <Text fontSize={14} color="$neutral11">
                {item.title}
              </Text>
            </XStack>
          </UPressableButton>
        ))}
      </XStack>
    </YStack>
  );
});
```

### 6. Search Results with Sections

```tsx
// src/components/explore/searchResults.tsx
import React from 'react';
import { YStack, Text } from 'tamagui';
import { SectionHeader } from '@/src/components/home/sectionHeader';
import { HorizontalBookList } from '@/src/components/library/horizontalBookList';
import { UEmptyState } from '@/src/components/core/uEmptyState';
import { Search } from 'lucide-react-native';

interface SearchResultsProps {
  query: string;
  results: {
    books: any[];
    podcasts: any[];
    videos: any[];
    events: any[];
  };
  isLoading: boolean;
}

export const SearchResults = React.memo(({
  query,
  results,
  isLoading,
}: SearchResultsProps) => {
  const hasResults = 
    results.books.length > 0 || 
    results.podcasts.length > 0 || 
    results.videos.length > 0 ||
    results.events.length > 0;

  if (!hasResults && !isLoading) {
    return (
      <UEmptyState
        icon={Search}
        title="No results found"
        description={`We couldn't find anything matching "${query}". Try different keywords.`}
      />
    );
  }

  return (
    <YStack gap="$4">
      {results.books.length > 0 && (
        <YStack gap="$3">
          <SectionHeader title={`Books (${results.books.length})`} />
          <HorizontalBookList books={results.books} />
        </YStack>
      )}

      {results.podcasts.length > 0 && (
        <YStack gap="$3">
          <SectionHeader title={`Podcasts (${results.podcasts.length})`} />
          {/* Podcast list component */}
        </YStack>
      )}

      {results.videos.length > 0 && (
        <YStack gap="$3">
          <SectionHeader title={`Videos (${results.videos.length})`} />
          {/* Video list component */}
        </YStack>
      )}

      {results.events.length > 0 && (
        <YStack gap="$3">
          <SectionHeader title={`Events (${results.events.length})`} />
          {/* Events list component */}
        </YStack>
      )}
    </YStack>
  );
});
```

### 7. Explore Screen Controller Update

```tsx
// src/controllers/useExploreController.tsx
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useDebounce } from '@/src/hooks/useDebounce';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_SEARCHES_KEY = 'recent_searches';
const MAX_RECENT_SEARCHES = 10;

export const useExploreController = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState({ books: [], podcasts: [], videos: [], events: [] });

  const debouncedQuery = useDebounce(searchQuery, 300);

  // Load recent searches on mount
  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load recent searches:', e);
    }
  };

  const saveRecentSearch = async (query: string) => {
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, MAX_RECENT_SEARCHES);
    setRecentSearches(updated);
    await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const removeRecentSearch = async (query: string) => {
    const updated = recentSearches.filter(s => s !== query);
    setRecentSearches(updated);
    await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const clearRecentSearches = async () => {
    setRecentSearches([]);
    await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  // Search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      performSearch(debouncedQuery);
    } else {
      setResults({ books: [], podcasts: [], videos: [], events: [] });
    }
  }, [debouncedQuery, selectedCategory]);

  const performSearch = async (query: string) => {
    setIsLoading(true);
    try {
      // API call here
      saveRecentSearch(query);
    } catch (e) {
      // Error handling
    } finally {
      setIsLoading(false);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    recentSearches,
    removeRecentSearch,
    clearRecentSearches,
    isLoading,
    results,
    debouncedQuery,
  };
};
```

## Screen Structure

```tsx
// app/(app)/(tabs)/explore.tsx
<YStack flex={1} backgroundColor="$background">
  <SearchBar
    value={searchQuery}
    onChangeText={setSearchQuery}
    onSubmit={performSearch}
    onClear={() => setSearchQuery('')}
  />

  <CategoryFilters
    categories={categories}
    selectedId={selectedCategory}
    onSelect={setSelectedCategory}
  />

  <ScrollView>
    {searchQuery.length === 0 ? (
      <>
        <RecentSearches
          searches={recentSearches}
          onSelect={(q) => setSearchQuery(q)}
          onRemove={removeRecentSearch}
          onClearAll={clearRecentSearches}
        />
        <TrendingSection items={trending} onSelect={(q) => setSearchQuery(q)} />
        <BrowseCategories categories={categories} />
      </>
    ) : (
      <SearchResults
        query={debouncedQuery}
        results={results}
        isLoading={isLoading}
      />
    )}
  </ScrollView>
</YStack>
```

## Testing Checklist

- [ ] Search debounces (300ms delay)
- [ ] Recent searches save and load
- [ ] Recent searches can be removed individually
- [ ] "Clear All" removes all recent searches
- [ ] Category filters apply to search
- [ ] Trending section shows popular searches
- [ ] Empty state shows when no results
- [ ] Search input has clear button
- [ ] Keyboard shows search return key
- [ ] Search bar has focus animation
- [ ] Skeleton loading during search
- [ ] Results grouped by type
- [ ] All items have proper touch targets
