import React, { memo } from 'react';
import { ActivityIndicator } from 'react-native';
import { XStack, YStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import UText from '@/src/components/core/text/uText';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import UCtaGradient from '@/src/components/core/display/uCtaGradient';
import type { CommunityResponse } from '@/src/explore/types/explore.types';

interface CommunityCardProps {
  data: CommunityResponse;
  onPress: (data: CommunityResponse) => void;
  onToggleJoin: (data: CommunityResponse) => void;
  isToggling?: boolean;
}

const CommunityCard: React.FC<CommunityCardProps> = ({
  data,
  onPress,
  onToggleJoin,
  isToggling,
}) => {
  const threads = `${data.threadCount} ${data.threadCount === 1 ? 'thread' : 'threads'}`;

  return (
    <XStack
      mb={14}
      p={12}
      gap={12}
      ai="center"
      br={20}
      bg="$glass"
      borderWidth={1}
      borderColor="$glassBorder"
    >
      {/* Siblings, not nested: an accessible card would hide the Join button from VoiceOver */}
      <XStack
        flex={1}
        gap={12}
        ai="center"
        onPress={() => onPress(data)}
        pressStyle={{ scale: 0.98, opacity: 0.9 }}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`${data.title}, ${threads}`}
      >
        <YStack w={56} h={56} br={16} overflow="hidden" bg="$glassSolid">
          {data.thumbnail && (
            <ULocalImage source={{ uri: data.thumbnail }} width="100%" height="100%" contentFit="cover" />
          )}
        </YStack>

        <YStack flex={1} w={0} gap={4}>
          <UText variant="display-s" color="$textPrimary" numberOfLines={2} reserveLines={2}>
            {data.title}
          </UText>
          <UText variant="body-s" color="$textMuted">
            {threads}
          </UText>
        </YStack>
      </XStack>

      <JoinButton
        joined={data.isJoined}
        pending={!!isToggling}
        title={data.title}
        onPress={() => onToggleJoin(data)}
      />
    </XStack>
  );
};

interface JoinButtonProps {
  joined: boolean;
  pending: boolean;
  title: string;
  onPress: () => void;
}

/** Join (gradient), pending (spinner, ignores presses), Joined (cyan outline, press to leave). */
const JoinButton = ({ joined, pending, title, onPress }: JoinButtonProps) => (
  <XStack
    h={44}
    minWidth={88}
    px={joined ? 14 : 16}
    gap={6}
    br={999}
    ai="center"
    jc="center"
    borderWidth={1}
    borderColor={pending ? 'rgba(255,255,255,0.15)' : joined ? 'rgba(103,232,249,0.55)' : 'transparent'}
    bg={pending ? 'rgba(255,255,255,0.06)' : joined ? 'rgba(0,240,255,0.08)' : 'transparent'}
    boxShadow={pending || joined ? 'none' : '0 0 14px rgba(135,54,247,0.4)'}
    onPress={pending ? undefined : onPress}
    pressStyle={{ opacity: 0.7 }}
    accessible
    accessibilityRole="button"
    accessibilityLabel={joined ? `Leave ${title}` : `Join ${title}`}
    accessibilityState={{ busy: pending, disabled: pending }}
  >
    {!pending && !joined && <UCtaGradient radius={999} />}
    {pending ? (
      <ActivityIndicator size="small" color={getTokenValue('$accentCyan', 'color')} />
    ) : (
      <>
        {joined && <Ionicons name="checkmark" size={14} color={getTokenValue('$accentCyan', 'color')} />}
        <UText
          variant="label-button"
          fontSize={11}
          lineHeight={14}
          letterSpacing={0.66}
          color={joined ? '$accentCyan' : '$textPrimary'}
        >
          {joined ? 'Joined' : 'Join'}
        </UText>
      </>
    )}
  </XStack>
);

export default memo(CommunityCard);
