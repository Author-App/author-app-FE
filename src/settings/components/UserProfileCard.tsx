import React, { memo } from 'react';
import { YStack, XStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';

import UText from '@/src/components/core/text/uText';
import UImage from '@/src/components/core/image/uImage';
import UCtaGradient from '@/src/components/core/display/uCtaGradient';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import type { UserData } from '../types/settings.types';
import { getInitials } from '@/src/utils/helper';

interface UserProfileCardProps {
  user?: UserData | null;
  isError?: boolean;
  onRetry?: () => void;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user, isError, onRetry }) => {
  const router = useRouter();

  if (isError || !user) {
    return (
      <UAnimatedView animation="fadeInUp" duration={400} delay={100}>
        <XStack
          p={16}
          gap={14}
          ai="center"
          br={24}
          borderWidth={1}
          bg="rgba(45,10,10,0.7)"
          borderColor="rgba(255,60,60,0.3)"
        >
          <YStack w={56} h={56} br={28} ai="center" jc="center" bg="rgba(248,113,113,0.16)">
            <Ionicons name="person-outline" size={24} color={getTokenValue('$danger', 'color')} />
          </YStack>
          <YStack flex={1} gap={2}>
            <UText variant="display-s" fontSize={15} lineHeight={20} color="$textPrimary">
              Couldn't load profile
            </UText>
            <UText variant="body-s" color="$errorText">
              Tap to try again
            </UText>
          </YStack>
          <YStack
            w={44}
            h={44}
            br={22}
            ai="center"
            jc="center"
            bg="rgba(248,113,113,0.16)"
            onPress={onRetry}
            pressStyle={{ opacity: 0.7 }}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Retry loading profile"
          >
            <Ionicons name="refresh-outline" size={18} color={getTokenValue('$danger', 'color')} />
          </YStack>
        </XStack>
      </UAnimatedView>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <UAnimatedView animation="fadeInUp" duration={400} delay={100}>
      <XStack
        p={16}
        gap={14}
        ai="center"
        br={24}
        borderWidth={1}
        bg="rgba(18,14,42,0.7)"
        borderColor="$glassGlowBorder"
        boxShadow="0 0 30px rgba(135,54,247,0.2)"
        onPress={() => router.push('/(app)/editProfile' as Href)}
        pressStyle={{ opacity: 0.9 }}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`${fullName}, ${user.email}. Edit profile`}
      >
        {/* 2pt gradient ring around the avatar */}
        <YStack w={56} h={56} br={28} p={2} overflow="hidden">
          <UCtaGradient radius={28} />
          <UImage imageSource={user.profileImageUrl} fallBackText={getInitials(fullName)} w={52} h={52} br={26} />
        </YStack>

        <YStack flex={1} gap={2}>
          <UText variant="display-s" fontSize={15} lineHeight={20} color="$textPrimary" numberOfLines={1}>
            {fullName}
          </UText>
          <UText variant="body-s" color="$textMuted" numberOfLines={1}>
            {user.email}
          </UText>
        </YStack>
      </XStack>
    </UAnimatedView>
  );
};

export default memo(UserProfileCard);
