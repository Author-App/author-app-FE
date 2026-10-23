import React, { memo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { YStack, XStack, XStackProps } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import type { ContinueReadingBook } from '@/src/types/api/home.types';
import { formatPagesLeft, formatTimeLeft } from '@/src/utils/helper';

export const CARD_WIDTH = 320;
export const CARD_GAP = 12;

export interface ContinueReadingCardProps extends XStackProps {
  item: ContinueReadingBook;
  index: number;
  onPress: () => void;
}

const ContinueReadingCard = memo(({ item, index, onPress, ...props }: ContinueReadingCardProps) => {
  const progress = item.progress;
  const percentage = progress?.percentage ?? 0;
  // Audiobooks count seconds, every other type counts pages
  const isAudio = item.type === 'audiobook';
  const done = (isAudio ? progress?.currentPositionSec : progress?.currentPage) ?? 0;
  const total = (isAudio ? progress?.durationSec : progress?.totalPages) ?? 0;
  const remaining = total ? (isAudio ? formatTimeLeft(done, total) : formatPagesLeft(done, total)) : '';
  const isComplete = total > 0 && done >= total;

  return (
    <UAnimatedView animation="fadeInUp" delay={index * 100} duration={400}>
      <XStack
        w={CARD_WIDTH}
        h={144}
        p={10}
        gap={12}
        br={20}
        bg="$glass"
        borderWidth={1}
        borderColor="$glassBorder"
        pressStyle={{ scale: 0.98, opacity: 0.9 }}
        animation="quick"
        onPress={onPress}
        accessible
        accessibilityRole="button"
        accessibilityLabel={remaining ? `${item.title}, ${remaining}` : item.title}
        {...props}
      >
        {/* Shadow on the outer view: overflow hidden on the same view would clip it */}
        <YStack w={82} h={124} br={8} boxShadow="0 8px 16px rgba(0,0,0,0.6)">
          <YStack flex={1} br={8} overflow="hidden" borderWidth={1} borderColor="$glassBorder">
            <ULocalImage source={{ uri: item.image }} width="100%" height="100%" contentFit="cover" />
          </YStack>
        </YStack>

        <YStack flex={1} w={0} py={4} jc="space-between">
          <YStack gap={2}>
            <UText variant="display-s" color="$textPrimary" numberOfLines={2}>
              {item.title}
            </UText>
            {!isComplete && (
              <UText variant="body-s" fontSize={12} lineHeight={16} color="$textMuted">
                Stanley Paden
              </UText>
            )}
          </YStack>

          {isComplete ? (
            <UText variant="meta-s" color="$accentPurple">
              {remaining}
            </UText>
          ) : (
            <YStack gap={6}>
              <YStack h={4} br={2} bg="$track">
                <LinearGradient
                  colors={['#8736F7', '#22D3EE']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.fill, { width: `${percentage}%` }]}
                />
              </YStack>
              {remaining !== '' && (
                <UText variant="meta-s" color="$accentCyan">
                  {remaining}
                </UText>
              )}
            </YStack>
          )}
        </YStack>
      </XStack>
    </UAnimatedView>
  );
});

ContinueReadingCard.displayName = 'ContinueReadingCard';

const styles = StyleSheet.create({
  fill: { height: 4, borderRadius: 2, boxShadow: '0 0 8px rgba(0,240,255,0.5)' },
});

export default ContinueReadingCard;
