/**
 * SocialLinks Component
 *
 * Displays author's social media links.
 */

import React, { memo, useCallback } from 'react';
import { Alert, Linking } from 'react-native';
import { XStack, YStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

import UText from '@/src/components/core/text/uText';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import type { SocialLink } from '../types/profile.types';

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
  const white = getTokenValue('$white', 'color');

  const openLink = useCallback(async (url: string) => {
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
    <UAnimatedView animation="fadeInUp" duration={400} delay={200}>
      <YStack gap={12}>
        <UText variant="text-sm" color="$neutral1" fontWeight="500">
          Connect with the Author
        </UText>

        <XStack gap={12}>
          {links.map((link) => (
            <YStack
              key={link.id}
              w={48}
              h={48}
              br={24}
              bg="$brandOcean"
              ai="center"
              jc="center"
              onPress={() => openLink(link.url)}
              pressStyle={{ scale: 0.95, opacity: 0.8 }}
              animation="quick"
            >
              <Ionicons
                name={PLATFORM_ICONS[link.platform]}
                size={22}
                color={white}
              />
            </YStack>
          ))}
        </XStack>
      </YStack>
    </UAnimatedView>
  );
};

export default memo(SocialLinks);
