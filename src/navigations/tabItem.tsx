import React from 'react';
import { styled, XStack, YStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import UText from '@/src/components/core/text/uText';
import { TAB_BAR_HEIGHT } from './hooks/useTabBarInset';

type IoniconsName = keyof typeof Ionicons.glyphMap;

type TabConfig = {
  icon: IoniconsName;
  label: string;
};

const TAB_CONFIG: Record<string, TabConfig> = {
  '(home)': { icon: 'home-outline', label: 'Home' },
  library: { icon: 'book-outline', label: 'Library' },
  explore: { icon: 'compass-outline', label: 'Explore' },
  profile: { icon: 'person-outline', label: 'Profile' },
  settings: { icon: 'settings-outline', label: 'Settings' },
};

const TabPill = styled(XStack, {
  h: 44,
  minWidth: 44,
  gap: 6,
  ai: 'center',
  jc: 'center',
  br: 22,
  borderWidth: 1,
  borderColor: 'transparent',

  variants: {
    active: {
      true: {
        px: 14,
        bg: '$pillActiveBg',
        borderColor: '$pillActiveBorder',
        boxShadow: '0 0 18px rgba(135,54,247,0.45)',
      },
    },
  } as const,
});

interface TabItemProps {
  routeName: string;
  focused: boolean;
  wide?: boolean;
  onPress: () => void;
}

const TabItem = ({ routeName, focused, wide, onPress }: TabItemProps) => {
  const config = TAB_CONFIG[routeName];
  const iconColor = getTokenValue(focused ? '$accentCyan' : '$textMuted');

  return (
    // Animate the wrapper only: the pill's variant has no "off" values, so its colors would stick
    <YStack
      flex={wide ? 1 : undefined}
      h={TAB_BAR_HEIGHT}
      jc="center"
      onPress={onPress}
      pressStyle={{ opacity: 0.7, scale: 0.92 }}
      // Inactive tabs are icon only: the label is the only name a screen reader has
      accessible
      accessibilityRole="button"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={config.label}
      testID={`tab-${routeName}`}
    >
      <TabPill active={focused} h={wide ? 48 : 44} px={wide ? 10 : undefined}>
        <Ionicons name={config.icon} size={wide ? 22 : 24} color={iconColor} />
        {(focused || wide) && (
          <UText variant="meta" color={focused ? '$accentCyan' : '$textSecondary'} numberOfLines={1}>
            {config.label}
          </UText>
        )}
      </TabPill>
    </YStack>
  );
};

export default React.memo(TabItem);
