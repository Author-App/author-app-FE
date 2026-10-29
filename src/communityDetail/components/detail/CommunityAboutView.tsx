import React from 'react';
import { YStack } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import UBadge from '@/src/components/core/display/uBadge';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import { UDetailScaffold } from '@/src/components/core/layout/UDetailScaffold';
import { NeonButton } from '@/src/components/core/buttons/neonButton';
import type { CommunityDetailResponse } from '@/src/types/api/community.types';

interface CommunityAboutViewProps {
  community: CommunityDetailResponse;
  onJoin: () => void;
  isJoining: boolean;
  /** Joined members came here from the chat, so back and the CTA both return to it */
  onShowChat?: () => void;
}

export function CommunityAboutView({ community, onJoin, isJoining, onShowChat }: CommunityAboutViewProps) {
  const threadCount = community.threads.length;

  return (
    <UDetailScaffold
      title={community.title}
      thumbnail={community.thumbnail}
      icon="people-outline"
      onBack={onShowChat}
      badges={
        <>
          <UBadge label={`${threadCount} ${threadCount === 1 ? 'discussion' : 'discussions'}`} tone="purple" onImage />
          {community.isJoined && <UBadge label="Joined" tone="cyan" onImage />}
        </>
      }
      action={
        community.isJoined ? (
          <NeonButton onPress={onShowChat} title="View Discussions" />
        ) : (
          <NeonButton onPress={onJoin} loading={isJoining} title="Join Community" />
        )
      }
    >
      {community.description && (
        <UAnimatedView animation="fadeInUp" delay={200}>
          <YStack gap={10}>
            <UText variant="display-m" color="$textPrimary" accessibilityRole="header">
              About
            </UText>
            <UText variant="body" color="$textSecondary">
              {community.description}
            </UText>
          </YStack>
        </UAnimatedView>
      )}
    </UDetailScaffold>
  );
}
