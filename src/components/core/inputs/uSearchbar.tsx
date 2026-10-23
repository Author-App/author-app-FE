import { memo, useRef, useEffect } from 'react';
import { TextInput } from 'react-native';
import { XStack, YStack, Input, getTokenValue } from 'tamagui';
import { Feather } from '@expo/vector-icons';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import UAnimatedYStack from '../animated/uAnimatedYStack';

interface USearchbarProps {
  search: string;
  onSearchChange: (search: string) => void;
  onClear?: () => void;
  placeholder?: string;
  disabled?: boolean;
}


const USearchbar = ({
  search,
  onSearchChange,
  onClear,
  placeholder = 'Search...',
  disabled = false,
}: USearchbarProps) => {
  const inputRef = useRef<TextInput>(null);
  const hasText =  search.length > 0;

  const muted = getTokenValue('$textMuted', 'color');
  const secondary = getTokenValue('$textSecondary', 'color');

  const xIconOpacity = useSharedValue(0);
  const xIconTranslateY = useSharedValue(10);

  const xIconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: xIconOpacity.value,
    transform: [{ translateY: xIconTranslateY.value }],
  }));

  useEffect(() => {
    if (hasText) {
      xIconOpacity.value = withTiming(1, { duration: 200 });
      xIconTranslateY.value = withTiming(0, { duration: 200 });
    } else {
      xIconOpacity.value = withTiming(0, { duration: 200 });
      xIconTranslateY.value = withTiming(10, { duration: 200 });
    }
  }, [hasText, xIconOpacity, xIconTranslateY]);

  const handleClear = () => {
    // The icon is hidden with pointerEvents, which is a style, not a rule.
    // Guard here so clearing is impossible when disabled or already empty.
    if (disabled || !hasText) return;

    onSearchChange('');
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <XStack
      ai="center"
      bg="$glass"
      borderWidth={1}
      borderColor="$borderSoft"
      br={999}
      h={48}
      pl={16}
      pr={6}
      gap={10}
      opacity={disabled ? 0.5 : 1}
      pressStyle={{ opacity: 0.85, scale: 0.995 }}
      onPress={() => inputRef.current?.focus()}
    >
      <Feather name="search" size={20} color={muted} />

      <Input
        ref={inputRef}
        flex={1}
        value={search}
        onChangeText={onSearchChange}
        placeholder={placeholder}
        placeholderTextColor={muted}
        editable={!disabled}
        unstyled
        bg="transparent"
        color="$textPrimary"
        fontSize={15}
        fontFamily="$inter"
        h="100%"
        p={0}
      />

      <YStack w={36} h={36} ai="center" jc="center">
        <UAnimatedYStack
          style={xIconAnimatedStyle}
          pointerEvents={hasText ? 'auto' : 'none'}
          ai="center"
          jc="center"
          w={26}
          h={26}
          br={13}
          bg="$searchbarClearBg"
          pressStyle={{ opacity: 0.7 }}
          onPress={handleClear}
          // 26pt circle, 44pt touch target
          hitSlop={9}
          // Icon-only button. Announces nothing without these.
          accessible
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <Feather name="x" size={16} color={secondary} />
        </UAnimatedYStack>
      </YStack>
    </XStack>
  );
};

export default memo(USearchbar);
