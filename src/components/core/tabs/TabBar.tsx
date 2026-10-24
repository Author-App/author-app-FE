import React from 'react';
import { StyleSheet, LayoutChangeEvent, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { YStack, XStack } from 'tamagui';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import UText from '@/src/components/core/text/uText';
import { Tab, TabMeasurement } from './hooks/useTabBar';

interface TabBarProps<T extends string> {
  tabs: Tab<T>[];
  activeTab: T;
  onTabPress: (key: T) => void;
  tabMeasurements: Record<T, TabMeasurement>;
  onTabLayout: (key: T, event: LayoutChangeEvent) => void;
  indicatorX: SharedValue<number>;
  indicatorWidth: SharedValue<number>;
}

/** Underline tabs: Jura labels on a 1pt track, a glowing purple-to-cyan indicator under the active one. */
export function TabBar<T extends string>({
  tabs,
  activeTab,
  onTabPress,
  onTabLayout,
  indicatorX,
  indicatorWidth,
}: TabBarProps<T>) {
  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: indicatorWidth.value,
  }));

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      accessibilityRole="tablist"
    >
      {/* Spread edge to edge, so the first and last tabs line up with the ends of the track */}
      <XStack flex={1} gap={22} jc="space-between">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <Pressable
              key={tab.key}
              onPress={() => onTabPress(tab.key)}
              onLayout={(e) => onTabLayout(tab.key, e)}
              style={styles.tab}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
            >
              <UText variant="meta-pill" color={isActive ? '$textPrimary' : '$textMuted'}>
                {tab.label}
              </UText>
            </Pressable>
          );
        })}
      </XStack>

      <YStack h={1} bg="$borderSoft" pos="absolute" bottom={0} left={16} right={16}>
        <Animated.View style={[styles.indicator, indicatorStyle]}>
          <LinearGradient
            colors={['#8736F7', '#00F0FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </YStack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: 16 },
  tab: { height: 44, justifyContent: 'center' },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    borderRadius: 1,
    overflow: 'hidden',
    boxShadow: '0 0 8px rgba(0,240,255,0.7)',
  },
});
