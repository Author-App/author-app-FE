import React, { memo } from 'react';
import { YStack, XStack } from 'tamagui';
import { Feather } from '@expo/vector-icons';

import UText from '@/src/components/core/text/uText';
import { SHIPPING_OPTIONS, type ShippingOption } from '@/src/types/api/print.types';

interface ShippingOptionsProps {
  selected: ShippingOption;
  onSelect: (option: ShippingOption) => void;
}

// Shipping icon based on type
const getShippingIcon = (value: ShippingOption): string => {
  if (value === 'MAIL') return 'mail';
  if (value === 'PRIORITY_MAIL') return 'zap';
  if (value.includes('EXPRESS')) return 'send';
  return 'truck';
};

const ShippingOptions = memo(({ selected, onSelect }: ShippingOptionsProps) => {
  return (
    <YStack gap={10}>
      {SHIPPING_OPTIONS.map((option) => {
        const isSelected = selected === option.value;
        const iconName = getShippingIcon(option.value);
        
        return (
          <XStack
            key={option.value}
            px={14}
            py={12}
            borderRadius={12}
            borderWidth={1.5}
            borderColor={isSelected ? '$brandTeal' : 'rgba(255, 255, 255, 0.1)'}
            bg={isSelected ? 'rgba(59, 151, 151, 0.12)' : 'rgba(255, 255, 255, 0.02)'}
            ai="center"
            gap={12}
            pressStyle={{ 
              opacity: 0.85,
              scale: 0.99,
            }}
            onPress={() => onSelect(option.value)}
          >
            {/* Icon */}
            <XStack
              w={36}
              h={36}
              borderRadius={10}
              bg={isSelected ? 'rgba(59, 151, 151, 0.2)' : 'rgba(255, 255, 255, 0.05)'}
              ai="center"
              jc="center"
            >
              <Feather 
                name={iconName as any} 
                size={18} 
                color={isSelected ? '#3B9797' : '#8E8E93'} 
              />
            </XStack>

            {/* Text */}
            <YStack flex={1}>
              <UText 
                variant="text-sm" 
                color={isSelected ? '$white' : '$neutral3'} 
                fontWeight="600"
              >
                {option.label}
              </UText>
              <UText variant="text-xs" color="$neutral4">
                {option.description}
              </UText>
            </YStack>

            {/* Radio indicator */}
            <XStack
              w={22}
              h={22}
              borderRadius={11}
              borderWidth={2}
              borderColor={isSelected ? '$brandTeal' : 'rgba(255, 255, 255, 0.2)'}
              bg={isSelected ? '$brandTeal' : 'transparent'}
              ai="center"
              jc="center"
            >
              {isSelected && (
                <XStack w={8} h={8} borderRadius={4} bg="$white" />
              )}
            </XStack>
          </XStack>
        );
      })}
    </YStack>
  );
});

ShippingOptions.displayName = 'ShippingOptions';

export default ShippingOptions;
