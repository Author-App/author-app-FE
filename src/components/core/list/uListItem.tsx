import React, { memo } from 'react';
import { ColorTokens, Token, XStack, XStackProps, YStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

import UText from '@/src/components/core/text/uText';

type ListItemVariant = 'checkmark' | 'bullet' | 'number';

interface UListItemProps extends XStackProps {
  text: string;
  variant?: ListItemVariant;
  index?: number;
  iconColor?: Token;
  iconBgColor?: ColorTokens;
  textColor?: ColorTokens;
}

const UListItem: React.FC<UListItemProps> = ({
  text,
  variant = 'checkmark',
  index = 0,
  iconColor = '$neutral1',
  iconBgColor = '$brandOcean',
  textColor = '$neutral1',
  ...props
}) => {
  const resolvedIconColor = getTokenValue(iconColor, 'color');

  const renderIcon = () => {
    switch (variant) {
      case 'checkmark':
        return <Ionicons name="checkmark" size={12} color={resolvedIconColor} />;
      case 'bullet':
        return <YStack w={6} h={6} br={3} bg={iconColor as ColorTokens} />;
      case 'number':
        return (
          <UText variant="text-xs" color="$white" fontWeight="600">
            {index + 1}
          </UText>
        );
      default:
        return <Ionicons name="checkmark" size={12} color={resolvedIconColor} />;
    }
  };

  return (
    <XStack gap={10} ai="flex-start" {...props}>
      <YStack
        w={20}
        h={20}
        br={10}
        bg={iconBgColor}
        ai="center"
        jc="center"
        mt={2}
      >
        {renderIcon()}
      </YStack>
      <UText
        variant="text-sm"
        color={textColor}
        flex={1}
        lineHeight={22}
      >
        {text}
      </UText>
    </XStack>
  );
};

export default memo(UListItem);
