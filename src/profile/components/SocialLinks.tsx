import React, { memo, useCallback } from 'react';
import { Alert, Linking } from 'react-native';
import { XStack, YStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

import type { SocialLink } from '../types/profile.types';
import haptics from '@/src/utils/haptics';

interface SocialLinksProps {
  links: SocialLink[];
}

const PLATFORM_ICONS: Record<SocialLink['platform'], keyof typeof Ionicons.glyphMap> = {
  linkedin: 'logo-linkedin',
  instagram: 'logo-instagram',
  facebook: 'logo-facebook',
  twitter: 'logo-twitter',
  website: 'globe-outline',
};

const SocialLinks: React.FC<SocialLinksProps> = ({ links }) => {
  const openLink = useCallback(async (url: string) => {
    haptics.medium();
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open this link');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  }, []);

  return (
    <XStack gap={10} mt={4}>
      {links.map((link) => (
        <YStack
          key={link.id}
          w={44}
          h={44}
          br={22}
          ai="center"
          jc="center"
          bg="rgba(255,255,255,0.05)"
          borderWidth={1}
          borderColor="rgba(255,255,255,0.12)"
          onPress={() => openLink(link.url)}
          pressStyle={{ scale: 0.95, opacity: 0.8 }}
          accessible
          accessibilityRole="link"
          accessibilityLabel={link.label}
        >
          <Ionicons name={PLATFORM_ICONS[link.platform]} size={20} color={getTokenValue('$accentPurple', 'color')} />
        </YStack>
      ))}
    </XStack>
  );
};

export default memo(SocialLinks);
