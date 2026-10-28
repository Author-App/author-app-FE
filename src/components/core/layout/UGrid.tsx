import { Children, ReactNode } from 'react';
import { XStack, YStack } from 'tamagui';

interface UGridProps {
  columns: number;
  gap: number;
  width: number;
  children: ReactNode;
}

/** A short fixed grid for sections that never scroll sideways. Endless lists use FlashList. */
export const UGrid = ({ columns, gap, width, children }: UGridProps) => {
  const itemWidth = (width - gap * (columns - 1)) / columns;
  return (
    <XStack flexWrap="wrap" gap={gap} w={width}>
      {Children.map(children, (child) => (
        <YStack w={itemWidth}>{child}</YStack>
      ))}
    </XStack>
  );
};
