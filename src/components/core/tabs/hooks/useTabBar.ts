import React, { useCallback, useState } from 'react';
import {
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LayoutChangeEvent } from 'react-native';
import haptics from '@/src/utils/haptics';

export interface Tab<T extends string> {
  key: T;
  label: string;
}

export interface TabMeasurement {
  x: number;
  width: number;
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
    haptics.selection();
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