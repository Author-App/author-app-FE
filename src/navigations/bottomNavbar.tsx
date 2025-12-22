import React, { useCallback, useMemo } from 'react';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, XStack, YStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

type IoniconsName = keyof typeof Ionicons.glyphMap;

type TabConfig = {
  icon: IoniconsName;
  iconFocused: IoniconsName;
  label: string;
};

const TAB_CONFIG: Record<string, TabConfig> = {
  '(home)': { icon: 'home-outline', iconFocused: 'home', label: 'Home' },
  library: { icon: 'book-outline', iconFocused: 'book', label: 'Library' },
  explore: { icon: 'compass-outline', iconFocused: 'compass', label: 'Explore' },
  profile: { icon: 'person-outline', iconFocused: 'person', label: 'Profile' },
  settings: { icon: 'settings-outline', iconFocused: 'settings', label: 'Settings' },
};

const DEFAULT_TAB: TabConfig = {
  icon: 'ellipse-outline',
  iconFocused: 'ellipse',
  label: 'Tab',
};

const TAB_ICON_SIZE = 24;
const CENTER_ICON_SIZE = 28;
const CENTER_BUTTON_SIZE = 60;
const CENTER_LIFT = 28;
const NAVBAR_HEIGHT = 70;

// Extracted constant objects to prevent recreation on each render
const TAB_PRESS_STYLE = { opacity: 0.7, scale: 0.96 } as const;
const CENTER_PRESS_STYLE = { scale: 0.95, opacity: 0.9 } as const;
const CENTER_SHADOW_OFFSET = { width: 0, height: 4 } as const;
const NAVBAR_SHADOW_OFFSET = { width: 0, height: 4 } as const;
const POINTER_EVENTS_BOX_NONE = { pointerEvents: 'box-none' } as const;

interface TabItemProps {
  routeName: string;
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  accessibilityLabel?: string;
}

const TabItem = React.memo(({ routeName, focused, onPress, onLongPress, accessibilityLabel }: TabItemProps) => {
  const config = TAB_CONFIG[routeName] ?? DEFAULT_TAB;
  const iconName = focused ? config.iconFocused : config.icon;
  const color = getTokenValue(focused ? '$accent' : '$neutral6');

  return (
    <YStack
      flex={1}
      ai="center"
      jc="center"
      gap="$1"
      onPress={onPress}
      onLongPress={onLongPress}
      pressStyle={TAB_PRESS_STYLE}
      animation="quick"
      cursor="pointer"
      accessibilityRole="button"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={accessibilityLabel ?? config.label}
    >
      <Ionicons name={iconName} size={TAB_ICON_SIZE} color={color} />
      <Text fontSize={11} fontWeight={focused ? '600' : '400'} color={focused ? '$accent' : '$neutral6'}>
        {config.label}
      </Text>
    </YStack>
  );
});

TabItem.displayName = 'TabItem';
interface CenterTabProps {
  routeName: string;
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

const CenterTab = React.memo(({ routeName, focused, onPress, onLongPress }: CenterTabProps) => {
  const config = TAB_CONFIG[routeName] ?? DEFAULT_TAB;
  const iconName = focused ? config.iconFocused : config.icon;
  const iconColor = getTokenValue(focused ? '$white' : '$neutral7');

  return (
    <YStack
      w={CENTER_BUTTON_SIZE}
      h={CENTER_BUTTON_SIZE}
      ai="center"
      jc="center"
      bg={focused ? '$accent' : '$bg2'}
      borderRadius={CENTER_BUTTON_SIZE / 2}
      shadowColor="$shadow"
      shadowOffset={CENTER_SHADOW_OFFSET}
      shadowOpacity={0.25}
      shadowRadius={8}
      elevation={8}
      onPress={onPress}
      onLongPress={onLongPress}
      pressStyle={CENTER_PRESS_STYLE}
      animation="quick"
      cursor="pointer"
      accessibilityRole="button"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={config.label}
    >
      <Ionicons name={iconName} size={CENTER_ICON_SIZE} color={iconColor} />
    </YStack>
  );
});

CenterTab.displayName = 'CenterTab';

const BottomNavbar = React.memo(({ state, navigation }: BottomTabBarProps) => {
  const { bottom } = useSafeAreaInsets();

  // Split routes into left (first 2), center (middle), right (last 2)
  const { leftRoutes, centerRoute, rightRoutes } = useMemo(() => {
    const routes = state.routes;
    if (routes.length < 3) {
      return { leftRoutes: routes, centerRoute: null, rightRoutes: [] };
    }

    const centerIndex = Math.floor(routes.length / 2);
    return {
      leftRoutes: routes.slice(0, centerIndex),
      centerRoute: routes[centerIndex],
      rightRoutes: routes.slice(centerIndex + 1),
    };
  }, [state.routes]);

  const handleTabPress = useCallback(
    (route: (typeof state.routes)[number], isFocused: boolean) => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name, route.params);
      } else if (isFocused) {
        // Scroll to top or reset stack on double tap
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

  const renderTabItem = useCallback(
    (route: (typeof state.routes)[number]) => {
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
    },
    [handleTabLongPress, handleTabPress, state.index, state.routes]
  );

  const renderCenterTab = useCallback(() => {
    if (!centerRoute) return null;

    const globalIndex = state.routes.findIndex((r) => r.key === centerRoute.key);
    const isFocused = state.index === globalIndex;

    return (
      <CenterTab
        routeName={centerRoute.name}
        focused={isFocused}
        onPress={() => handleTabPress(centerRoute, isFocused)}
        onLongPress={() => handleTabLongPress(centerRoute)}
      />
    );
  }, [centerRoute, handleTabLongPress, handleTabPress, state.index, state.routes]);

  return (
    <YStack w="100%" ai="center" jc="center" bottom={0} h={90}>
      {/* Main Navbar */}
      <YStack
        w="100%"
        bottom={0}
        jc="center"
        ai="center"
        style={POINTER_EVENTS_BOX_NONE}
        bg="$neutral0"
        shadowColor="$black"
        shadowOffset={NAVBAR_SHADOW_OFFSET}
        shadowOpacity={0.25}
        shadowRadius={33}
        elevationAndroid={11}
        h={NAVBAR_HEIGHT + bottom}
      >
        <XStack w="100%" mb={bottom + 4} mt={16} px={16}>
          {/* Left Tabs */}
          <XStack flex={1} ai="center" jc="space-around" gap={12}>
            {leftRoutes.map(renderTabItem)}
          </XStack>

          {/* Center Spacer */}
          <XStack w={CENTER_BUTTON_SIZE + 24} />

          {/* Right Tabs */}
          <XStack flex={1} ai="center" jc="space-around" gap={12}>
            {rightRoutes.map(renderTabItem)}
          </XStack>
        </XStack>
      </YStack>

      {/* Floating Center Button */}
      <XStack jc="center" pos="absolute" bottom={55} zIndex={10} bg="$neutral0" borderRadius={40} p={5}>
        {renderCenterTab()}
      </XStack>
    </YStack>
  );
});

BottomNavbar.displayName = 'BottomNavbar';

export default BottomNavbar;
