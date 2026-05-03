import React, { memo } from 'react';
import { YStack, XStack } from 'tamagui';
import { Feather } from '@expo/vector-icons';

import UText from '@/src/components/core/text/uText';

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
}

const QuantitySelector = memo(({ quantity, onChange, min = 1, max = 10 }: QuantitySelectorProps) => {
  const canDecrement = quantity > min;
  const canIncrement = quantity < max;

  return (
    <XStack ai="center" jc="space-between">
      {/* Left side - Label */}
      <YStack>
        <UText variant="text-sm" color="$neutral3">
          Select quantity
        </UText>
        <UText variant="text-xs" color="$neutral4">
          Max {max} per order
        </UText>
      </YStack>

      {/* Right side - Controls */}
      <XStack ai="center" gap={4}>
        {/* Decrement Button */}
        <XStack
          w={40}
          h={40}
          borderRadius={10}
          bg={canDecrement ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)'}
          ai="center"
          jc="center"
          pressStyle={{ 
            opacity: canDecrement ? 0.7 : 1,
            scale: canDecrement ? 0.95 : 1,
          }}
          onPress={() => canDecrement && onChange(quantity - 1)}
          opacity={canDecrement ? 1 : 0.4}
          borderWidth={1}
          borderColor={canDecrement ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}
        >
          <Feather name="minus" size={18} color={canDecrement ? 'white' : '#666'} />
        </XStack>

        {/* Quantity Display */}
        <XStack
          w={56}
          h={40}
          borderRadius={10}
          bg="rgba(59, 151, 151, 0.15)"
          borderWidth={1}
          borderColor="rgba(59, 151, 151, 0.3)"
          ai="center"
          jc="center"
        >
          <UText variant="text-md" color="$brandTeal" fontWeight="700">
            {quantity}
          </UText>
        </XStack>

        {/* Increment Button */}
        <XStack
          w={40}
          h={40}
          borderRadius={10}
          bg={canIncrement ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)'}
          ai="center"
          jc="center"
          pressStyle={{ 
            opacity: canIncrement ? 0.7 : 1,
            scale: canIncrement ? 0.95 : 1,
          }}
          onPress={() => canIncrement && onChange(quantity + 1)}
          opacity={canIncrement ? 1 : 0.4}
          borderWidth={1}
          borderColor={canIncrement ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}
        >
          <Feather name="plus" size={18} color={canIncrement ? 'white' : '#666'} />
        </XStack>
      </XStack>
    </XStack>
  );
});

QuantitySelector.displayName = 'QuantitySelector';

export default QuantitySelector;
