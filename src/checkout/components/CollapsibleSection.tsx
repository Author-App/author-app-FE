import React, { memo, useEffect } from 'react';
import { YStack, XStack } from 'tamagui';
import { Feather } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';

import UText from '@/src/components/core/text/uText';

interface CollapsibleSectionProps {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
  completedText?: string;
  isCompleted?: boolean;
  hasError?: boolean;
}

const AnimatedYStack = Animated.createAnimatedComponent(YStack);

const CollapsibleSection = memo(({
  id,
  title,
  icon,
  isOpen,
  onToggle,
  children,
  completedText,
  isCompleted = false,
  hasError = false,
}: CollapsibleSectionProps) => {
  const progress = useSharedValue(isOpen ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isOpen ? 1 : 0, {
      duration: 250,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }, [isOpen, progress]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(progress.value, [0, 1], [0, 180])}deg` }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    maxHeight: interpolate(progress.value, [0, 1], [0, 1000]),
    overflow: 'hidden' as const,
  }));

  // Determine border and icon colors based on state
  const getBorderColor = () => {
    if (hasError) return 'rgba(231, 76, 60, 0.4)';
    if (isOpen) return 'rgba(59, 151, 151, 0.3)';
    return 'rgba(255, 255, 255, 0.08)';
  };
  
  const getIconBgColor = () => {
    if (hasError) return 'rgba(231, 76, 60, 0.2)';
    if (isCompleted) return 'rgba(59, 151, 151, 0.2)';
    return 'rgba(59, 151, 151, 0.15)';
  };
  
  const getIconColor = () => {
    if (hasError) return '#E74C3C';
    return '#3B9797';
  };

  return (
    <YStack
      bg="rgba(255, 255, 255, 0.03)"
      borderRadius={16}
      borderWidth={1}
      borderColor={getBorderColor()}
      overflow="hidden"
    >
      {/* Header - Always visible */}
      <XStack
        ai="center"
        jc="space-between"
        p={16}
        pressStyle={{ opacity: 0.8 }}
        onPress={() => onToggle(id)}
      >
        <XStack ai="center" gap={12} flex={1}>
          <XStack
            w={36}
            h={36}
            borderRadius={10}
            bg={getIconBgColor()}
            ai="center"
            jc="center"
          >
            {hasError && !isOpen ? (
              <Feather name="alert-circle" size={18} color="#E74C3C" />
            ) : isCompleted && !isOpen ? (
              <Feather name="check" size={18} color="#3B9797" />
            ) : (
              <Feather name={icon as any} size={18} color={getIconColor()} />
            )}
          </XStack>
          <YStack flex={1}>
            <XStack ai="center" gap={6}>
              <UText variant="text-md" color="$white" fontWeight="600">
                {title}
              </UText>
              {hasError && !isOpen && (
                <XStack
                  px={6}
                  py={2}
                  borderRadius={4}
                  bg="rgba(231, 76, 60, 0.2)"
                >
                  <UText variant="text-2xs" color="#E74C3C" fontWeight="600">
                    Fix errors
                  </UText>
                </XStack>
              )}
            </XStack>
            {!isOpen && completedText && !hasError && (
              <UText variant="text-xs" color="$neutral4" numberOfLines={1}>
                {completedText}
              </UText>
            )}
          </YStack>
        </XStack>

        <Animated.View style={chevronStyle}>
          <XStack
            w={28}
            h={28}
            borderRadius={8}
            bg="rgba(255, 255, 255, 0.05)"
            ai="center"
            jc="center"
          >
            <Feather name="chevron-down" size={16} color="#8E8E93" />
          </XStack>
        </Animated.View>
      </XStack>

      {/* Content - Collapsible */}
      <AnimatedYStack style={contentStyle}>
        <YStack px={16} pb={16} pt={0} gap={16}>
          {children}
        </YStack>
      </AnimatedYStack>
    </YStack>
  );
});

CollapsibleSection.displayName = 'CollapsibleSection';

export default CollapsibleSection;
