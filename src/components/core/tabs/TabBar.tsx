import React, { useCallback, useState } from 'react';
import { YStack, XStack, Token, getTokenValue } from 'tamagui';
import Animated, {
  SharedValue,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LayoutChangeEvent, Pressable } from 'react-native';

import UText from '@/src/components/core/text/uText';

export interface Tab<T extends string> {
  key: T;
  label: string;
}

interface TabMeasurement {
  x: number;
  width: number;
}

interface TabBarProps<T extends string> {
  tabs: Tab<T>[];
  activeTab: T;
  onTabPress: (key: T) => void;
  tabMeasurements: Record<T, TabMeasurement>;
  onTabLayout: (key: T, event: LayoutChangeEvent) => void;
  indicatorX: SharedValue<number>;
  indicatorWidth: SharedValue<number>;
  indicatorColor?: Token;
}

export function TabBar<T extends string>({
  tabs,
  activeTab,
  onTabPress,
  onTabLayout,
  indicatorX,
  indicatorWidth,
  indicatorColor = '$brandCrimson',
}: TabBarProps<T>) {
  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: indicatorWidth.value,
  }));

  return (
    <YStack>
      <XStack>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => onTabPress(tab.key)}
              onLayout={(e) => onTabLayout(tab.key, e)}
              style={{ flex: 1, alignItems: 'center', paddingVertical: 12 }}
            >
              <UText
                variant="text-md"
                color={isActive ? '$white' : '$neutral3'}
                fontWeight={isActive ? '600' : '400'}
              >
                {tab.label}
              </UText>
            </Pressable>
          );
        })}
      </XStack>

      {/* Tab line with animated indicator */}
      <YStack h={2} bg="rgba(255, 255, 255, 0.15)" mt={4}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              height: 2,
              backgroundColor: getTokenValue(indicatorColor),
              borderRadius: 1,
            },
            indicatorStyle,
          ]}
        />
      </YStack>
    </YStack>
  );
}

export function useTabBar<T extends string>(
  tabs: Tab<T>[],
  defaultTab: T
) {
  const [activeTab, setActiveTab] = useState<T>(defaultTab);
  const [tabMeasurements, setTabMeasurements] = useState<Record<T, TabMeasurement>>(
    () => tabs.reduce((acc, tab) => ({ ...acc, [tab.key]: { x: 0, width: 0 } }), {} as Record<T, TabMeasurement>)
  );

  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  const handleTabLayout = useCallback((key: T, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    setTabMeasurements((prev) => ({
      ...prev,
      [key]: { x, width },
    }));

    // Set initial indicator position for default tab
    if (key === defaultTab && indicatorWidth.value === 0) {
      indicatorX.value = x;
      indicatorWidth.value = width;
    }
  }, [defaultTab, indicatorX, indicatorWidth]);

  const handleTabPress = useCallback((key: T) => {
    setActiveTab(key);
    const measurement = tabMeasurements[key];
    if (measurement && measurement.width > 0) {
      indicatorX.value = withTiming(measurement.x, {
        duration: 250,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });
      indicatorWidth.value = withTiming(measurement.width, {
        duration: 250,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });
    }
  }, [tabMeasurements, indicatorX, indicatorWidth]);

  return {
    activeTab,
    tabMeasurements,
    indicatorX,
    indicatorWidth,
    handleTabLayout,
    handleTabPress,
  };
}
