import { memo } from "react";
import { XStack, YStack } from "tamagui";

interface PaginationDotsProps {
  total: number;
  activeIndex: number;
}

const PaginationDots = memo(({ total, activeIndex }: PaginationDotsProps) => (
  <XStack gap={8} jc="center" mt={16}>
    {Array.from({ length: total }).map((_, index) => (
      <YStack
        key={index}
        w={index === activeIndex ? 24 : 8}
        h={8}
        borderRadius={4}
        bg={index === activeIndex ? '$brandCrimson' : '$neutralAlphaLight3'}
        animation="quick"
      />
    ))}
  </XStack>
));

PaginationDots.displayName = 'PaginationDots';

export default PaginationDots;