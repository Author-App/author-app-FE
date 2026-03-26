import { memo, useRef, useMemo, useEffect } from 'react';
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
  const hasText = useMemo(() => search.length > 0, [search]);

  const neutral1 = getTokenValue('$neutral1', 'color');
  const crimson = getTokenValue('$brandCrimson', 'color');

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
    onSearchChange('');
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <XStack
      ai="center"
      bg="$searchbarBg"
      borderWidth={1}
      borderColor="$searchbarBorder"
      br={999}
      h={52}
      px={18}
      gap={12}
      opacity={disabled ? 0.5 : 1}
      pressStyle={{ opacity: 0.85, scale: 0.995 }}
      onPress={() => inputRef.current?.focus()}
    >
      <Feather name="search" size={20} color={neutral1} />

      <Input
        ref={inputRef}
        flex={1}
        value={search}
        onChangeText={onSearchChange}
        placeholder={placeholder}
        placeholderTextColor={neutral1}
        editable={!disabled}
        unstyled
        bg="transparent"
        color="$neutral1"
        fontSize={15}
        fontFamily="$body"
        h="100%"
        p={0}
      />

      <YStack w={26} h={26} ai="center" jc="center">
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
        >
          <Feather name="x" size={16} color={crimson} />
        </UAnimatedYStack>
      </YStack>
    </XStack>
  );
};

export default memo(USearchbar);
