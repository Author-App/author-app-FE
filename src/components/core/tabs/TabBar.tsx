import React from 'react';
import { YStack, XStack, Token, getTokenValue } from 'tamagui';
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { LayoutChangeEvent, Pressable, ScrollView } from 'react-native';

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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <XStack>
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.key;

            return (
              <Pressable
                key={tab.key}
                onPress={() => onTabPress(tab.key)}
                onLayout={(e) => onTabLayout(tab.key, e)}
                style={{
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  // paddingLeft: isFirst ? 20 : 16,
                  // paddingRight: isLast ? 20 : 16,
                }}
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
        <YStack
          h={2}
          bg="rgba(255, 255, 255, 0.15)"
          mt={4}
          position="absolute"
          bottom={0}
          left={0}
          right={0}
        >
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
      </ScrollView>
    </YStack>
  );
}