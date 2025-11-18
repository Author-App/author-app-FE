import { PropsWithChildren, useCallback, useMemo, useRef } from 'react';
import { LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  GetProps,
  isWeb,
  ScrollView,
  ScrollViewProps,
  View,
  XStack,
  XStackProps,
  YStack,
} from 'tamagui';

import UButtonTabItem, {
  ButtonTabItemVariant,
} from '@/src/components/core/buttons/uButtonTabItem';

interface UButtonTabsProps<T extends string = string>
  extends PropsWithChildren<ScrollViewProps> {
  items: T[];
  selectedItem: T;
  onItemSelect: (item: T) => void;
  variant?: ButtonTabItemVariant;
  innerContainerProps?: XStackProps;
  tabItemProps?: Omit<
    Partial<GetProps<typeof UButtonTabItem>>,
    | 'item'
    | 'isSelected'
    | 'variant'
    | 'onPress'
    | 'onLayout'
    | 'useInternalBorder'
    | 'ref'
  >;
  disabledItems?: T[];
}

const UButtonTabs = <T extends string = string>({
  items,
  selectedItem,
  onItemSelect,
  variant = 'style-1',
  innerContainerProps,
  tabItemProps,
  disabledItems = [],
  ...props
}: UButtonTabsProps<T>) => {
  const tabPositions = useRef<{ [key: string]: { x: number; width: number } }>(
    {}
  );
  const tabRefs = useRef<{
    [key: string]: React.ElementRef<typeof UButtonTabItem>;
  }>({});
  const containerRef = useRef<React.ElementRef<typeof XStack>>(null);

  const underlinePosition = useSharedValue(0);
  const underlineWidth = useSharedValue(0);

  const onTabSelected = useCallback(
    (item: T) => {
      onItemSelect(item);

      // Animate underline to new position for style-2
      if (variant === 'style-2') {
        const position = tabPositions.current[item];
        if (position) {
          underlinePosition.value = withTiming(position.x, { duration: 200 });
          underlineWidth.value = withTiming(position.width, { duration: 200 });
        }
      }
    },
    [onItemSelect, variant, underlinePosition, underlineWidth]
  );

  const onTabLayout = useCallback(
    (item: T, event: LayoutChangeEvent) => {
      if (variant === 'style-1') {
        return;
      }
      if (isWeb) {
        const tabNode = tabRefs.current[item] as unknown as HTMLElement;
        const containerNode = containerRef.current as unknown as HTMLElement;
        if (tabNode && containerNode) {
          const tabRect = tabNode.getBoundingClientRect();
          const containerRect = containerNode.getBoundingClientRect();
          const left = tabRect.left - containerRect.left;
          tabPositions.current[item] = { x: left, width: tabRect.width };
        }
      } else {
        const { x, width } = event.nativeEvent.layout;
        tabPositions.current[item] = { x, width };
      }

      if (item === selectedItem) {
        underlinePosition.value = tabPositions.current[item].x;
        underlineWidth.value = tabPositions.current[item].width;
      }
    },
    [variant, selectedItem, underlinePosition, underlineWidth]
  );

  const animatedUnderlineStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: underlinePosition.value }],
      width: underlineWidth.value,
    };
  });

  const renderTabs = useMemo(
    () => () => (
      <XStack ref={containerRef} position="relative" {...innerContainerProps}>
        {items.map((item) => (
          <UButtonTabItem
            key={item}
            ref={(el: React.ElementRef<typeof UButtonTabItem>) => {
              tabRefs.current[item] = el;
            }}
            item={item}
            isSelected={selectedItem === item}
            variant={variant}
            disabled={disabledItems.includes(item)}
            onPress={() => onTabSelected(item)}
            onLayout={(event) => onTabLayout(item, event)}
            useInternalBorder={false}
            {...tabItemProps}
          />
        ))}
      </XStack>
    ),
    [
      items,
      selectedItem,
      variant,
      disabledItems,
      tabItemProps,
      onTabSelected,
      onTabLayout,
      innerContainerProps,
    ]
  );

  const renderWithUnderline = useMemo(
    () => () => (
      <YStack>
        {renderTabs()}
        {variant === 'style-2' && (
          <AnimatedView h={2} bg="$primary7" style={animatedUnderlineStyle} />
        )}
      </YStack>
    ),
    [variant, renderTabs, animatedUnderlineStyle]
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      overScrollMode="never"
      bounces={false}
      contentContainerStyle={{
        alignItems: 'center',
        paddingHorizontal: 10,
      }}
      style={{
        flexGrow: 0,
      }}
      {...props}
    >
      {variant === 'style-2' ? renderWithUnderline() : renderTabs()}
    </ScrollView>
  );
};

const AnimatedView = Animated.createAnimatedComponent(View);

export default UButtonTabs;
