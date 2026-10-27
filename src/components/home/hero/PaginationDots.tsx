import { memo } from "react";
import { XStack, YStack } from "tamagui";

interface PaginationDotsProps {
  total: number;
  activeIndex: number;
}

const PaginationDots = memo(({ total, activeIndex }: PaginationDotsProps) => (
  <XStack
    gap={6}
    jc="center"
    accessible
    accessibilityRole="text"
    accessibilityLabel={`Slide ${activeIndex + 1} of ${total}`}
  >
    {Array.from({ length: total }).map((_, index) => {
      const active = index === activeIndex;
      return (
        <YStack
          key={index}
          w={active ? 20 : 6}
          h={6}
          br={3}
          bg={active ? '$accentCyan' : '$dotInactive'}
          // Both states set a value: an animated prop that goes undefined keeps its old value
          boxShadow={active ? '0 0 8px rgba(0,240,255,0.6)' : 'none'}
        />
      );
    })}
  </XStack>
));

PaginationDots.displayName = 'PaginationDots';

export default PaginationDots;
