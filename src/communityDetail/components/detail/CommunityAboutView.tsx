import React from 'react';
import { ScrollView } from 'react-native';
import { YStack, XStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UText from '@/src/components/core/text/uText';
import { NeonButton } from '@/src/components/core/buttons/neonButton';
import { CommunityHero } from './CommunityHero';
import { CommunityDescription } from './CommunityDescription';
import type { CommunityDetailResponse } from '@/src/types/api/community.types';

interface CommunityAboutViewProps {
  community: CommunityDetailResponse;
  onJoin?: () => void;
  onViewDiscussions?: () => void;
  isJoining?: boolean;
}

export const CommunityAboutView: React.FC<CommunityAboutViewProps> = ({
  community,
  onJoin,
  onViewDiscussions,
  isJoining,
}) => {
  const { bottom } = useSafeAreaInsets();

  // Show action button at bottom if not joined or if can view discussions
  const showBottomAction = !community.isJoined || onViewDiscussions;
  const scrollPaddingBottom = showBottomAction ? bottom + 100 : bottom + 20;

  return (
    <YStack flex={1} backgroundColor="$brandNavy">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: scrollPaddingBottom }}
        showsVerticalScrollIndicator={false}
      >
        <CommunityHero
          title={community.title}
          thumbnail={community.thumbnail}
          threadCount={community.threads.length}
          isJoined={community.isJoined}
        />

        <YStack px={20} pt={20}>
          <CommunityDescription description={community.description} />

          {/* Stats section */}
          <YStack
            bg="rgba(255, 255, 255, 0.08)"
            borderWidth={1}
            borderColor="rgba(255, 255, 255, 0.12)"
            br={16}
            p={16}
            mb={20}
          >
            <UText variant="heading-h2" color="$white" mb={12}>
              Community Stats
            </UText>
            <XStack gap={20}>
              <YStack flex={1} ai="center">
                <UText variant="heading-h1" color="$brandCrimson">
                  {community.threads.length}
                </UText>
                <UText variant="text-xs" color="$neutral4">
                  Discussions
                </UText>
              </YStack>
              <YStack
                w={1}
                bg="rgba(255, 255, 255, 0.1)"
              />
              <YStack flex={1} ai="center">
                <UText variant="heading-h1" color="$brandCrimson">
                  {community.isJoined ? '✓' : '—'}
                </UText>
                <UText variant="text-xs" color="$neutral4">
                  {community.isJoined ? 'Joined' : 'Not Joined'}
                </UText>
              </YStack>
            </XStack>
          </YStack>
        </YStack>
      </ScrollView>

      {/* Bottom action */}
      {showBottomAction && (
        <YStack
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          bg="$brandNavy"
          borderTopWidth={1}
          borderColor="rgba(255, 255, 255, 0.1)"
          px={20}
          pt={16}
          pb={bottom + 16}
        >
          {community.isJoined ? (
            <NeonButton onPress={onViewDiscussions} title='View Discussions' />
          ) : (
            <NeonButton onPress={onJoin} loading={isJoining} title='Join Community' />
          )}
        </YStack>
      )}
    </YStack>
  );
};
