# Empty States Improvements

## Current Problems

1. **Generic "No results found"** text without context or illustration
2. **No empty state for notifications** - screen is just a placeholder
3. **No CTA buttons** in empty states to guide users
4. **Library shows basic "No results"** without helpful message
5. **Search results** show nothing when empty

## Required Components

### Task 1: Create Empty State Component

**File to create:** `src/components/core/display/uEmptyState.tsx`

```tsx
import React from 'react';
import { YStack } from 'tamagui';
import { UText } from '../text/uText';
import { UTextButton } from '../buttons/uTextButton';
import { SvgProps } from 'react-native-svg';

interface UEmptyStateProps {
  icon?: React.FC<SvgProps>;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export const UEmptyState = React.memo(({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}: UEmptyStateProps) => {
  return (
    <YStack 
      flex={1} 
      alignItems="center" 
      justifyContent="center" 
      padding="$6"
      gap="$4"
    >
      {Icon && (
        <YStack 
          width={120} 
          height={120} 
          alignItems="center" 
          justifyContent="center"
          backgroundColor="$neutral2"
          borderRadius={60}
          marginBottom="$2"
        >
          <Icon width={60} height={60} color="#8A9A95" />
        </YStack>
      )}
      
      <UText 
        variant="headingMd" 
        textAlign="center"
        color="$neutral9"
      >
        {title}
      </UText>
      
      {description && (
        <UText 
          variant="bodyMd" 
          textAlign="center"
          color="$neutral7"
          maxWidth={280}
        >
          {description}
        </UText>
      )}
      
      {actionLabel && onAction && (
        <UTextButton
          variant="primary"
          size="md"
          onPress={onAction}
          marginTop="$2"
        >
          {actionLabel}
        </UTextButton>
      )}
      
      {secondaryActionLabel && onSecondaryAction && (
        <UTextButton
          variant="tertiary"
          size="sm"
          onPress={onSecondaryAction}
        >
          {secondaryActionLabel}
        </UTextButton>
      )}
    </YStack>
  );
});

UEmptyState.displayName = 'UEmptyState';
```

### Task 2: Create Empty State Icons

**File to create:** `assets/icons/emptyStates/index.tsx`

```tsx
import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { SvgProps } from 'react-native-svg';

export const EmptyNotificationsIcon: React.FC<SvgProps> = (props) => (
  <Svg width={60} height={60} viewBox="0 0 60 60" fill="none" {...props}>
    <Path
      d="M30 10C23.373 10 18 15.373 18 22v8l-4 4v2h32v-2l-4-4v-8c0-6.627-5.373-12-12-12z"
      stroke={props.color || '#8A9A95'}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M26 44h8"
      stroke={props.color || '#8A9A95'}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Circle cx="30" cy="22" r="3" fill={props.color || '#8A9A95'} opacity={0.3} />
  </Svg>
);

export const EmptySearchIcon: React.FC<SvgProps> = (props) => (
  <Svg width={60} height={60} viewBox="0 0 60 60" fill="none" {...props}>
    <Circle
      cx="26"
      cy="26"
      r="14"
      stroke={props.color || '#8A9A95'}
      strokeWidth={2}
    />
    <Path
      d="M36 36l12 12"
      stroke={props.color || '#8A9A95'}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

export const EmptyLibraryIcon: React.FC<SvgProps> = (props) => (
  <Svg width={60} height={60} viewBox="0 0 60 60" fill="none" {...props}>
    <Rect
      x="12"
      y="8"
      width="36"
      height="44"
      rx="4"
      stroke={props.color || '#8A9A95'}
      strokeWidth={2}
    />
    <Path
      d="M20 20h20M20 28h16M20 36h12"
      stroke={props.color || '#8A9A95'}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

export const EmptyEventsIcon: React.FC<SvgProps> = (props) => (
  <Svg width={60} height={60} viewBox="0 0 60 60" fill="none" {...props}>
    <Rect
      x="8"
      y="14"
      width="44"
      height="38"
      rx="4"
      stroke={props.color || '#8A9A95'}
      strokeWidth={2}
    />
    <Path
      d="M8 24h44M20 8v12M40 8v12"
      stroke={props.color || '#8A9A95'}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

export const EmptyContentIcon: React.FC<SvgProps> = (props) => (
  <Svg width={60} height={60} viewBox="0 0 60 60" fill="none" {...props}>
    <Rect
      x="10"
      y="10"
      width="40"
      height="40"
      rx="8"
      stroke={props.color || '#8A9A95'}
      strokeWidth={2}
    />
    <Path
      d="M20 25l8 8 12-12"
      stroke={props.color || '#8A9A95'}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={0.5}
    />
  </Svg>
);
```

### Task 3: Implement Notifications Empty State

**File to modify:** `app/(app)/notifications/index.tsx`

Replace the placeholder with proper implementation:

```tsx
import React from 'react';
import { YStack, ScrollView } from 'tamagui';
import { UHeader } from '@/src/components/core/layout/uHeader';
import { UEmptyState } from '@/src/components/core/display/uEmptyState';
import { EmptyNotificationsIcon } from '@/assets/icons/emptyStates';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  
  // TODO: Replace with actual notifications data
  const notifications: any[] = [];
  
  const handleEnableNotifications = () => {
    // Navigate to settings or request permission
  };

  return (
    <YStack flex={1} backgroundColor="$background">
      <UHeader title="Notifications" showBackButton />
      
      {notifications.length === 0 ? (
        <UEmptyState
          icon={EmptyNotificationsIcon}
          title="No notifications yet"
          description="When you get notifications about your content, purchases, or community activity, they'll show up here."
          actionLabel="Enable Notifications"
          onAction={handleEnableNotifications}
        />
      ) : (
        <ScrollView 
          flex={1}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        >
          {/* Notification list items */}
        </ScrollView>
      )}
    </YStack>
  );
}
```

### Task 4: Update Library Empty State

**File to modify:** `app/(app)/(tabs)/library/index.tsx`

Update the empty state section:

```tsx
// Replace the current empty state with:
{filteredBooks.length === 0 && !isLoading && (
  <UEmptyState
    icon={EmptyLibraryIcon}
    title="Your library is empty"
    description="Books and content you purchase or save will appear here. Start exploring to build your collection!"
    actionLabel="Browse Content"
    onAction={() => router.push('/(app)/(tabs)/explore')}
  />
)}
```

### Task 5: Update Explore Search Empty State

**File to modify:** `app/(app)/(tabs)/explore/index.tsx`

Add empty state for search results:

```tsx
// In each tab's content, add after the list:
{!isLoading && data.length === 0 && searchQuery && (
  <UEmptyState
    icon={EmptySearchIcon}
    title="No results found"
    description={`We couldn't find anything matching "${searchQuery}". Try adjusting your search terms.`}
    actionLabel="Clear Search"
    onAction={() => setSearchQuery('')}
  />
)}

{!isLoading && data.length === 0 && !searchQuery && (
  <UEmptyState
    icon={EmptyContentIcon}
    title="No content available"
    description="Check back soon for new content!"
  />
)}
```

### Task 6: Empty State for Events

**File to modify:** `app/(app)/events/index.tsx`

```tsx
{events.length === 0 && !isLoading && (
  <UEmptyState
    icon={EmptyEventsIcon}
    title="No upcoming events"
    description="There are no scheduled events at the moment. Check back soon for new events and workshops!"
    actionLabel="Explore Content"
    onAction={() => router.push('/(app)/(tabs)/explore')}
  />
)}
```

## Empty State Messages Guide

Use these message patterns for consistency:

| Scenario | Title | Description Pattern |
|----------|-------|---------------------|
| Search no results | "No results found" | "We couldn't find anything matching '[query]'..." |
| Empty list | "[Content type] is empty" | "When you [action], they'll appear here." |
| No content | "No [content] available" | "Check back soon for new [content]!" |
| Error state | "Something went wrong" | "We couldn't load [content]. Please try again." |
| Offline | "You're offline" | "Connect to the internet to see [content]." |

## Testing Checklist

- [ ] Notifications screen shows proper empty state
- [ ] Library empty state has CTA to browse content
- [ ] Search shows empty state with clear search option
- [ ] Each empty state has appropriate icon
- [ ] CTAs navigate to correct screens
- [ ] Empty states are vertically centered
- [ ] Text is readable and helpful
