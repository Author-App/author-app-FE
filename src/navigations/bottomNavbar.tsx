import React, { useCallback } from 'react';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { useWindowDimensions } from 'react-native';
import { styled, XStack } from 'tamagui';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import haptics from '@/src/utils/haptics';
import TabItem from './tabItem';
import { TAB_BAR_HEIGHT, useTabBarInset } from './hooks/useTabBarInset';
import { getSizeClass } from '@/src/components/core/layout/layout';

const WIDE_TAB_BAR_WIDTH = 600;

const Capsule = styled(XStack, {
  pos: 'absolute',
  left: 12,
  right: 12,
  h: TAB_BAR_HEIGHT,
  px: 10,
  ai: 'center',
  jc: 'space-between',
  br: TAB_BAR_HEIGHT / 2,
  bg: '$tabBarBg',
  borderWidth: 1,
  borderColor: '$borderSoft',
  // boxShadow, not shadowColor, so the shadow also shows on Android (new architecture)
  boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
});

const BottomNavbar = React.memo(({ state, navigation }: BottomTabBarProps) => {
  const { offset } = useTabBarInset();
  const { width } = useWindowDimensions();
  const isWide = getSizeClass(width) !== 'compact';
  const inset = isWide ? (width - WIDE_TAB_BAR_WIDTH) / 2 : 12;

  const handleTabPress = useCallback(
    (route: (typeof state.routes)[number], isFocused: boolean) => {
      haptics.selection();

      if (isFocused) {
        // Re-tapping the active tab resets every tab, not just this one
        navigation.reset({ index: 0, routes: [{ name: route.name }] });
      } else {
        navigation.navigate(route.name, route.params);
      }
    },
    [navigation]
  );

  return (
    // A real box, not zero height: iOS accessibility (VoiceOver, XCUITest, Maestro) skipped the tabs
    // while every child was absolutely positioned inside an empty wrapper
    <UAnimatedView animation="fadeInUp" duration={400} pos="absolute" left={0} right={0} bottom={0} h={150} pointerEvents="box-none">
      <Capsule bottom={offset} left={inset} right={inset} gap={isWide ? 4 : 0}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          return (
            <TabItem
              key={route.key}
              routeName={route.name}
              focused={isFocused}
              wide={isWide}
              onPress={() => handleTabPress(route, isFocused)}
            />
          );
        })}
      </Capsule>
    </UAnimatedView>
  );
});

BottomNavbar.displayName = 'BottomNavbar';

export default BottomNavbar;
