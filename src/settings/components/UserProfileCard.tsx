/**
 * UserProfileCard Component
 *
 * Compact horizontal profile card with edit button.
 * Handles error state gracefully with inline retry option.
 */

import React, { memo } from 'react';
import { YStack, XStack, getTokenValue } from 'tamagui';
import { Pressable, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';

import UText from '@/src/components/core/text/uText';
import UImage from '@/src/components/core/image/uImage';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import type { UserData } from '../types/settings.types';

interface UserProfileCardProps {
  user?: UserData | null;
  isError?: boolean;
  onRetry?: () => void;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user, isError, onRetry }) => {
  const router = useRouter();
  const teal = getTokenValue('$brandTeal', 'color');

  const handleEditProfile = () => {
    router.push('/(app)/editProfile' as Href);
  };

  // Error state - show inline error with retry
  if (isError || !user) {
    return (
      <UAnimatedView animation="fadeInUp" duration={400} delay={100}>
        <XStack
          mx={20}
          p={16}
          bg="$searchbarBg"
          borderRadius={20}
          borderWidth={1}
          borderColor="rgba(255,107,107,0.3)"
          ai="center"
          gap={16}
        >
          {/* Error Icon */}
          <YStack
            w={72}
            h={72}
            borderRadius={36}
            bg="rgba(255,107,107,0.1)"
            jc="center"
            ai="center"
          >
            <Ionicons name="person-outline" size={28} color="#FF6B6B" />
          </YStack>

          {/* Error Info */}
          <YStack flex={1} gap={4}>
            <UText variant="text-md" color="$white" fontWeight="600">
              Couldn't load profile
            </UText>
            <UText variant="text-sm" color="$neutral1" opacity={0.7}>
              Tap to try again
            </UText>
          </YStack>

          {/* Retry Button */}
          <TouchableOpacity onPress={onRetry} activeOpacity={0.7}>
            <YStack
              w={36}
              h={36}
              br={18}
              bg="rgba(255,107,107,0.15)"
              ai="center"
              jc="center"
            >
              <Ionicons name="refresh-outline" size={18} color="#FF6B6B" />
            </YStack>
          </TouchableOpacity>
        </XStack>
      </UAnimatedView>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <UAnimatedView animation="fadeInUp" duration={400} delay={100}>
      <Pressable onPress={handleEditProfile}>
        {({ pressed }) => (
          <XStack
            mx={20}
            p={16}
            bg="$searchbarBg"
            borderRadius={20}
            borderWidth={1}
            borderColor="$searchbarBorder"
            ai="center"
            gap={16}
            opacity={pressed ? 0.9 : 1}
          >
            {/* Profile Image */}
            <YStack
              w={72}
              h={72}
              borderRadius={36}
              overflow="hidden"
              borderWidth={2}
              borderColor="$brandTeal"
            >
              <UImage
                imageSource={user.profileImageUrl}
                fallBackText={fullName}
                w={68}
                h={68}
                borderRadius={34}
              />
            </YStack>

            {/* User Info */}
            <YStack flex={1} gap={4}>
              <UText variant="heading-h2" color="$white" fontWeight="600">
                {fullName}
              </UText>
              <UText variant="text-sm" color="$neutral1" numberOfLines={1}>
                {user.email}
              </UText>
              {user.role && (
                <XStack ai="center" gap={4} mt={4}>
                  <YStack
                    bg="$brandOcean"
                    px={8}
                    py={2}
                    br={8}
                  >
                    <UText variant="text-xs" color="$brandTeal" fontWeight="600">
                      {user.role}
                    </UText>
                  </YStack>
                  {user.isEmailVerified && (
                    <YStack
                      bg="rgba(16, 185, 129, 0.15)"
                      px={8}
                      py={2}
                      br={8}
                      flexDirection="row"
                      ai="center"
                      gap={4}
                    >
                      <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                      <UText variant="text-xs" color="#10B981" fontWeight="500">
                        Verified
                      </UText>
                    </YStack>
                  )}
                </XStack>
              )}
            </YStack>

            {/* Edit Arrow */}
            <YStack
              w={36}
              h={36}
              br={18}
              bg="$brandOcean"
              ai="center"
              jc="center"
            >
              <Ionicons name="chevron-forward" size={18} color={teal} />
            </YStack>
          </XStack>
        )}
      </Pressable>
    </UAnimatedView>
  );
};

export default memo(UserProfileCard);
