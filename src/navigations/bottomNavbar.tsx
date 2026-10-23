import React, { useCallback } from 'react';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styled, XStack } from 'tamagui';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import haptics from '@/src/utils/haptics';
import TabItem from './tabItem';
import { TAB_BAR_HEIGHT, useTabBarInset } from './hooks/useTabBarInset';

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
    <UAnimatedView animation="fadeInUp" duration={400}>
      {/* Fades scrolling content out behind the bar on every tab */}
      <LinearGradient
        colors={['rgba(2,1,3,0)', 'rgba(2,1,3,0.92)']}
        locations={[0, 0.55]}
        style={styles.scrim}
        pointerEvents="none"
      />
      <Capsule bottom={offset}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          return (
            <TabItem
              key={route.key}
              routeName={route.name}
              focused={isFocused}
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

const styles = StyleSheet.create({
  scrim: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 150 },
});
