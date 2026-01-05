import React, { memo, useCallback, useRef } from 'react';
import { ScrollView, LayoutChangeEvent, Dimensions } from 'react-native';
import { XStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';

import UText from '@/src/components/core/text/uText';
import haptics from '@/src/utils/haptics';

type IoniconsName = keyof typeof Ionicons.glyphMap;

export interface TabItem<T extends string = string> {
  label: T;
  icon?: IoniconsName;
}

interface UButtonTabItemProps<T extends string> {
  item: TabItem<T>;
  isActive: boolean;
  onPress: () => void;
  onLayout?: (event: LayoutChangeEvent) => void;
  showIcon?: boolean;
}

const AnimatedXStack = Animated.createAnimatedComponent(XStack);

const UButtonTabItem = memo(<T extends string>({
  item,
  isActive,
  onPress,
  onLayout,
  showIcon = true,
}: UButtonTabItemProps<T>) => {
  const scale = useSharedValue(1);
  const crimson = getTokenValue('$brandCrimson', 'color');
  const teal = getTokenValue('$brandTeal', 'color');
  const white = getTokenValue('$white', 'color');

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(scale.value, { damping: 15, stiffness: 200 }) }],
    };
  });

  const handlePressIn = useCallback(() => {
    scale.value = 0.95;
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = 1;
  }, []);

  return (
    <AnimatedXStack
      style={animatedStyle}
      ai="center"
      jc="center"
      gap={6}
      px={16}
      py={10}
      br={999}
      borderWidth={1}
      backgroundColor={isActive ? '$brandCrimson' : 'transparent'}
      borderColor={isActive ? '$brandCrimson' : '$searchbarBorder'}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLayout={onLayout}
      shadowColor={isActive ? '$brandCrimson' : 'transparent'}
      shadowOffset={{ width: 0, height: 0 }}
      shadowOpacity={isActive ? 0.4 : 0}
      shadowRadius={isActive ? 12 : 0}
      elevation={isActive ? 8 : 0}
    >
      {showIcon && item.icon && (
        <Ionicons
          name={item.icon}
          size={16}
          color={isActive ? white : teal}
        />
      )}
      <UText
        variant="text-sm"
        color={isActive ? '$white' : '$brandTeal'}
        fontWeight="500"
      >
        {item.label}
      </UText>
    </AnimatedXStack>
  );
}) as (<T extends string>(props: UButtonTabItemProps<T>) => React.ReactElement) & { displayName?: string };

UButtonTabItem.displayName = 'UButtonTabItem';

interface UButtonTabsProps<T extends string = string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  showIcons?: boolean;
  gap?: number;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCROLL_PADDING = 40; // Extra padding to show next tab hint

const UButtonTabs = <T extends string = string>({
  tabs,
  activeTab,
  onTabChange,
  showIcons = true,
  gap = 10,
}: UButtonTabsProps<T>) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const tabPositions = useRef<Record<string, { x: number; width: number }>>({});
  const scrollViewWidth = useRef(SCREEN_WIDTH - 40); // Default minus padding

  const handleTabLayout = useCallback((label: string, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    tabPositions.current[label] = { x, width };
  }, []);

  const handleScrollViewLayout = useCallback((event: LayoutChangeEvent) => {
    scrollViewWidth.current = event.nativeEvent.layout.width;
  }, []);

  const handleTabPress = useCallback((tab: TabItem<T>) => {
    haptics.selection();
    onTabChange(tab.label);

    // Get the position of the selected tab
    const position = tabPositions.current[tab.label];
    if (!position || !scrollViewRef.current) return;

    const tabIndex = tabs.findIndex(t => t.label === tab.label);
    const isFirstTab = tabIndex === 0;
    const isLastTab = tabIndex === tabs.length - 1;

    // Calculate scroll position to keep selected tab centered with hints of adjacent tabs
    let scrollX = 0;

    if (isFirstTab) {
      // For first tab, scroll to start
      scrollX = 0;
    } else if (isLastTab) {
      // For last tab, scroll to show it fully at the end
      scrollX = position.x - scrollViewWidth.current + position.width + SCROLL_PADDING;
    } else {
      // For middle tabs, center the tab with space for both prev and next tabs
      // Calculate scroll to put the tab roughly centered, showing hints of neighbors
      const centerOffset = (scrollViewWidth.current - position.width) / 2;
      scrollX = position.x - centerOffset;

      // Also check if previous tab would be hidden and adjust
      const prevTabPosition = tabPositions.current[tabs[tabIndex - 1]?.label];
      if (prevTabPosition) {
        const prevTabStart = prevTabPosition.x;
        // Make sure previous tab is at least partially visible
        if (scrollX > prevTabStart) {
          scrollX = Math.max(0, prevTabStart - SCROLL_PADDING / 2);
        }
      }
    }

    // Don't scroll negative
    scrollX = Math.max(0, scrollX);

    scrollViewRef.current.scrollTo({ x: scrollX, animated: true });
  }, [tabs, onTabChange]);

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap }}
      onLayout={handleScrollViewLayout}
    >
      {tabs.map((tab) => (
        <UButtonTabItem
          key={tab.label}
          item={tab}
          isActive={activeTab === tab.label}
          onPress={() => handleTabPress(tab)}
          onLayout={(e) => handleTabLayout(tab.label, e)}
          showIcon={showIcons}
        />
      ))}
    </ScrollView>
  );
};

export default memo(UButtonTabs) as typeof UButtonTabs;
