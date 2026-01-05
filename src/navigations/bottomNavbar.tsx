import React, { useCallback } from 'react';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { XStack, YStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import haptics from '@/src/utils/haptics';

type IoniconsName = keyof typeof Ionicons.glyphMap;

type TabConfig = {
  icon: IoniconsName;
  label: string;
};

// Always use outline icons for premium minimal look
const TAB_CONFIG: Record<string, TabConfig> = {
  '(home)': { icon: 'home-outline', label: 'Home' },
  library: { icon: 'book-outline', label: 'Library' },
  explore: { icon: 'compass-outline', label: 'Explore' },
  profile: { icon: 'person-outline', label: 'Profile' },
  settings: { icon: 'settings-outline', label: 'Settings' },
};

const DEFAULT_TAB: TabConfig = {
  icon: 'ellipse-outline',
  label: 'Tab',
};

// Premium sizing
const TAB_ICON_SIZE = 22;
const ACTIVE_INDICATOR_SIZE = 48;
const NAVBAR_HEIGHT = 64;
const NAVBAR_MARGIN_BOTTOM = 24;
const NAVBAR_MARGIN_HORIZONTAL = 20;
const NAVBAR_BORDER_RADIUS = 32;

// Press animations
const TAB_PRESS_STYLE = { opacity: 0.7, scale: 0.92 } as const;
const NAVBAR_SHADOW_OFFSET = { width: 0, height: 8 } as const;

interface TabItemProps {
  routeName: string;
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  accessibilityLabel?: string;
}

const TabItem = React.memo(({ routeName, focused, onPress, onLongPress, accessibilityLabel }: TabItemProps) => {
  const config = TAB_CONFIG[routeName] ?? DEFAULT_TAB;
  
  // Active: white icon on crimson circle | Inactive: ocean blue icon
  const iconColor = getTokenValue(focused ? '$white' : '$brandOcean');

  return (
    <YStack
      flex={1}
      ai="center"
      jc="center"
      h={NAVBAR_HEIGHT}
      onPress={onPress}
      onLongPress={onLongPress}
      pressStyle={TAB_PRESS_STYLE}
      animation="quick"
      cursor="pointer"
    >
      {/* Active indicator circle */}
      <YStack
        w={ACTIVE_INDICATOR_SIZE}
        h={ACTIVE_INDICATOR_SIZE}
        ai="center"
        jc="center"
        borderRadius={9999}
        overflow="hidden"
        bg={focused ? '$brandCrimson' : 'transparent'}
      >
        <Ionicons name={config.icon} size={TAB_ICON_SIZE} color={iconColor} />
      </YStack>
    </YStack>
  );
});

TabItem.displayName = 'TabItem';

const BottomNavbar = React.memo(({ state, navigation }: BottomTabBarProps) => {
  const { bottom } = useSafeAreaInsets();

  const handleTabPress = useCallback(
    (route: (typeof state.routes)[number], isFocused: boolean) => {
      haptics.selection();
      
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name, route.params);
      } else if (isFocused) {
        // Reset navigation when tapping already active route
        navigation.reset({ index: 0, routes: [{ name: route.name }] });
      }
    },
    [navigation]
  );

  const handleTabLongPress = useCallback(
    (route: (typeof state.routes)[number]) => {
      navigation.emit({ type: 'tabLongPress', target: route.key });
    },
    [navigation]
  );

  return (
    <UAnimatedView animation="fadeInUp" duration={400}>
      <YStack
        pos="absolute"
        bottom={Math.max(bottom, NAVBAR_MARGIN_BOTTOM)}
        left={NAVBAR_MARGIN_HORIZONTAL}
        right={NAVBAR_MARGIN_HORIZONTAL}
        h={NAVBAR_HEIGHT}
        bg="$white"
        borderRadius={NAVBAR_BORDER_RADIUS}
        shadowColor="$black"
        shadowOffset={NAVBAR_SHADOW_OFFSET}
        shadowOpacity={0.15}
        shadowRadius={24}
        elevation={12}
      >
        <XStack flex={1} ai="center" jc="space-evenly" px={8}>
          {state.routes.map((route) => {
            const globalIndex = state.routes.findIndex((r) => r.key === route.key);
            const isFocused = state.index === globalIndex;

            return (
              <TabItem
                key={route.key}
                routeName={route.name}
                focused={isFocused}
                onPress={() => handleTabPress(route, isFocused)}
                onLongPress={() => handleTabLongPress(route)}
              />
            );
          })}
        </XStack>
      </YStack>
    </UAnimatedView>
  );
});

BottomNavbar.displayName = 'BottomNavbar';

export default BottomNavbar;
