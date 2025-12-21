# Home Screen Improvements

## Current Location
`app/(app)/(tabs)/index.tsx` - Main home screen

## Current State Analysis

The home screen is the first impression users get after login. It needs to feel premium and engaging.

## Improvements Required

### 1. Welcome Section Enhancement

**Current:** Generic greeting
**Improved:** Personalized, time-aware greeting with user name

```tsx
// src/components/home/welcomeSection.tsx
import React, { useMemo } from 'react';
import { YStack, XStack, Text, Avatar } from 'tamagui';

interface WelcomeSectionProps {
  userName: string;
  avatarUrl?: string;
}

export const WelcomeSection = React.memo(({ userName, avatarUrl }: WelcomeSectionProps) => {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const firstName = userName?.split(' ')[0] || 'Reader';

  return (
    <XStack 
      paddingHorizontal="$4" 
      paddingVertical="$4" 
      alignItems="center" 
      justifyContent="space-between"
    >
      <YStack>
        <Text fontSize={14} color="$neutral9">
          {greeting}
        </Text>
        <Text fontSize={24} fontWeight="700" color="$neutral12">
          {firstName}
        </Text>
      </YStack>
      
      <Avatar circular size="$5">
        {avatarUrl ? (
          <Avatar.Image src={avatarUrl} accessibilityLabel={`${userName}'s profile`} />
        ) : (
          <Avatar.Fallback backgroundColor="$primary7">
            <Text color="white" fontSize={18} fontWeight="600">
              {firstName.charAt(0).toUpperCase()}
            </Text>
          </Avatar.Fallback>
        )}
      </Avatar>
    </XStack>
  );
});
```

### 2. Featured Content Carousel

**Current:** Static banner
**Improved:** Auto-scrolling featured carousel with pagination dots

```tsx
// src/components/home/featuredCarousel.tsx
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Dimensions, FlatList, ViewToken } from 'react-native';
import { YStack, XStack, Image, Text } from 'tamagui';
import { UPressableButton } from '@/src/components/core/buttons/uPressableButton';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 32;
const AUTO_SCROLL_INTERVAL = 5000;

interface FeaturedItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  type: 'book' | 'podcast' | 'video';
}

interface FeaturedCarouselProps {
  items: FeaturedItem[];
  onItemPress: (item: FeaturedItem) => void;
}

export const FeaturedCarousel = React.memo(({ items, onItemPress }: FeaturedCarouselProps) => {
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-scroll
  useEffect(() => {
    if (items.length <= 1) return;

    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % items.length;
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * ITEM_WIDTH,
        animated: true,
      });
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(interval);
  }, [activeIndex, items.length]);

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0]) {
      setActiveIndex(viewableItems[0].index || 0);
    }
  }, []);

  const renderItem = useCallback(({ item }: { item: FeaturedItem }) => (
    <UPressableButton
      onPress={() => onItemPress(item)}
      style={{ width: ITEM_WIDTH, marginHorizontal: 16 }}
    >
      <YStack height={180} borderRadius={16} overflow="hidden">
        <Image
          source={{ uri: item.imageUrl }}
          width={ITEM_WIDTH}
          height={180}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 100,
            justifyContent: 'flex-end',
            padding: 16,
          }}
        >
          <Text fontSize={12} color="$primary7" fontWeight="600" textTransform="uppercase">
            {item.type}
          </Text>
          <Text fontSize={18} fontWeight="700" color="white" numberOfLines={2}>
            {item.title}
          </Text>
        </LinearGradient>
      </YStack>
    </UPressableButton>
  ), [onItemPress]);

  return (
    <YStack>
      <FlatList
        ref={flatListRef}
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        decelerationRate="fast"
        snapToInterval={ITEM_WIDTH}
      />
      
      {/* Pagination Dots */}
      <XStack justifyContent="center" gap="$2" marginTop="$3">
        {items.map((_, index) => (
          <YStack
            key={index}
            width={index === activeIndex ? 24 : 8}
            height={8}
            borderRadius={4}
            backgroundColor={index === activeIndex ? '$primary7' : '$neutral5'}
          />
        ))}
      </XStack>
    </YStack>
  );
});
```

### 3. Quick Actions Section

Add quick access buttons for common actions:

```tsx
// src/components/home/quickActions.tsx
import React from 'react';
import { XStack, YStack, Text } from 'tamagui';
import { UPressableButton } from '@/src/components/core/buttons/uPressableButton';
import { Book, Headphones, Video, Calendar } from 'lucide-react-native';

interface QuickActionsProps {
  onNavigate: (screen: string) => void;
}

const actions = [
  { id: 'books', label: 'Books', icon: Book, screen: 'library' },
  { id: 'podcasts', label: 'Podcasts', icon: Headphones, screen: 'library' },
  { id: 'videos', label: 'Videos', icon: Video, screen: 'library' },
  { id: 'events', label: 'Events', icon: Calendar, screen: 'events' },
];

export const QuickActions = React.memo(({ onNavigate }: QuickActionsProps) => {
  return (
    <XStack paddingHorizontal="$4" justifyContent="space-between">
      {actions.map((action) => (
        <UPressableButton
          key={action.id}
          onPress={() => onNavigate(action.screen)}
          hapticType="light"
        >
          <YStack alignItems="center" gap="$2">
            <YStack
              width={56}
              height={56}
              borderRadius={16}
              backgroundColor="$primary2"
              alignItems="center"
              justifyContent="center"
            >
              <action.icon size={24} color="#B4975A" />
            </YStack>
            <Text fontSize={12} color="$neutral11">
              {action.label}
            </Text>
          </YStack>
        </UPressableButton>
      ))}
    </XStack>
  );
});
```

### 4. Continue Reading Section

Show users their in-progress books/content:

```tsx
// src/components/home/continueReading.tsx
import React from 'react';
import { YStack, XStack, Text, Image } from 'tamagui';
import { UPressableButton } from '@/src/components/core/buttons/uPressableButton';
import { Play } from 'lucide-react-native';

interface ContinueItem {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  progress: number; // 0-100
  type: 'book' | 'podcast' | 'video';
}

interface ContinueReadingProps {
  items: ContinueItem[];
  onItemPress: (item: ContinueItem) => void;
}

export const ContinueReading = React.memo(({ items, onItemPress }: ContinueReadingProps) => {
  if (items.length === 0) return null;

  return (
    <YStack gap="$3">
      <XStack paddingHorizontal="$4" justifyContent="space-between" alignItems="center">
        <Text fontSize={18} fontWeight="700" color="$neutral12">
          Continue Reading
        </Text>
        <Text fontSize={14} color="$primary7">
          See All
        </Text>
      </XStack>

      {items.slice(0, 2).map((item) => (
        <UPressableButton
          key={item.id}
          onPress={() => onItemPress(item)}
          style={{ marginHorizontal: 16 }}
        >
          <XStack
            backgroundColor="$neutral2"
            borderRadius={12}
            padding="$3"
            gap="$3"
            alignItems="center"
          >
            <Image
              source={{ uri: item.coverUrl }}
              width={60}
              height={80}
              borderRadius={8}
            />
            
            <YStack flex={1} gap="$1">
              <Text fontSize={14} fontWeight="600" color="$neutral12" numberOfLines={1}>
                {item.title}
              </Text>
              <Text fontSize={12} color="$neutral9">
                {item.author}
              </Text>
              
              {/* Progress Bar */}
              <YStack marginTop="$2">
                <XStack
                  height={4}
                  backgroundColor="$neutral4"
                  borderRadius={2}
                  overflow="hidden"
                >
                  <YStack
                    width={`${item.progress}%`}
                    height={4}
                    backgroundColor="$primary7"
                  />
                </XStack>
                <Text fontSize={10} color="$neutral8" marginTop="$1">
                  {item.progress}% complete
                </Text>
              </YStack>
            </YStack>

            <YStack
              width={40}
              height={40}
              borderRadius={20}
              backgroundColor="$primary7"
              alignItems="center"
              justifyContent="center"
            >
              <Play size={16} color="white" fill="white" />
            </YStack>
          </XStack>
        </UPressableButton>
      ))}
    </YStack>
  );
});
```

### 5. Section Headers Consistency

```tsx
// src/components/home/sectionHeader.tsx
import React from 'react';
import { XStack, Text } from 'tamagui';
import { UPressableButton } from '@/src/components/core/buttons/uPressableButton';

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
}

export const SectionHeader = React.memo(({ title, onSeeAll }: SectionHeaderProps) => (
  <XStack paddingHorizontal="$4" justifyContent="space-between" alignItems="center">
    <Text fontSize={18} fontWeight="700" color="$neutral12">
      {title}
    </Text>
    {onSeeAll && (
      <UPressableButton onPress={onSeeAll} hapticType="light">
        <Text fontSize={14} color="$primary7" fontWeight="500">
          See All
        </Text>
      </UPressableButton>
    )}
  </XStack>
));
```

## Home Screen Structure

After improvements, the home screen should have this structure:

```tsx
// app/(app)/(tabs)/index.tsx
<ScrollView refreshControl={<RefreshControl />}>
  <WelcomeSection userName={user.name} avatarUrl={user.avatar} />
  
  <FeaturedCarousel items={featuredContent} onItemPress={handleFeaturedPress} />
  
  <QuickActions onNavigate={handleNavigate} />
  
  <ContinueReading items={inProgressItems} onItemPress={handleContinue} />
  
  <SectionHeader title="New Releases" onSeeAll={() => {}} />
  <HorizontalBookList books={newReleases} />
  
  <SectionHeader title="Trending Podcasts" onSeeAll={() => {}} />
  <HorizontalPodcastList podcasts={trendingPodcasts} />
  
  <SectionHeader title="Upcoming Events" onSeeAll={() => {}} />
  <EventsList events={upcomingEvents} />
</ScrollView>
```

## Testing Checklist

- [ ] Greeting changes based on time of day
- [ ] User's first name displayed correctly
- [ ] Avatar shows initials when no image
- [ ] Featured carousel auto-scrolls
- [ ] Pagination dots update on scroll
- [ ] Quick actions navigate correctly
- [ ] Continue reading shows progress bar
- [ ] Pull-to-refresh works
- [ ] Skeleton loading on first load
- [ ] All touch targets are 44x44 minimum
- [ ] Haptic feedback on all interactive elements
