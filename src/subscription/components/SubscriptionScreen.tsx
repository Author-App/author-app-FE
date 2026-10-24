import React from 'react';
import { ScrollView } from 'react-native';
import { XStack, YStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UHeader from '@/src/components/core/layout/uHeader';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import UBackButton from '@/src/components/core/buttons/uBackButton';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import UCtaGradient from '@/src/components/core/display/uCtaGradient';
import UText from '@/src/components/core/text/uText';
import UGradientText from '@/src/components/core/text/uGradientText';

const COMING_FEATURES = [
  { icon: 'book-outline', title: 'Unlimited Access', desc: 'Read all books without limits' },
  { icon: 'headset-outline', title: 'Premium Audiobooks', desc: 'Listen to exclusive content' },
  { icon: 'cloud-download-outline', title: 'Offline Reading', desc: 'Download for offline access' },
  { icon: 'sparkles-outline', title: 'Early Access', desc: 'Get new releases first' },
] as const;

/** Live until RevenueCat is wired. The plans screen waits in SubscriptionPlansScreen. */
export function SubscriptionScreen() {
  const { bottom } = useSafeAreaInsets();
  const cyan = getTokenValue('$accentCyan', 'color');

  return (
    <UScreenLayout>
      <UHeader
        variant="premium"
        title="Premium"
        textProps={{ variant: 'display-l' }}
        leftControl={<UBackButton variant="glass-md" />}
        pb={8}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: bottom + 32 }}>
        <UAnimatedView animation="fadeInUp" delay={100}>
          <YStack ai="center" gap={18} pt={24}>
            <YStack w={112} h={112} br={56} ai="center" jc="center" boxShadow="0 0 48px rgba(135,54,247,0.55), 0 0 24px rgba(0,240,255,0.25)">
              <UCtaGradient radius={56} />
              <Ionicons name="rocket-outline" size={48} color={getTokenValue('$textPrimary', 'color')} />
            </YStack>

            <YStack ai="center" gap={4} mt={8}>
              <UText variant="display-l" color="$textPrimary" textAlign="center">
                Something amazing
              </UText>
              <UGradientText variant="display-l" textAlign="center">
                is coming
              </UGradientText>
            </YStack>

            <UText variant="body" color="$textSecondary" textAlign="center" px={12}>
              We are crafting a premium experience just for you. Get ready to unlock the full potential of your
              reading journey.
            </UText>
          </YStack>
        </UAnimatedView>

        <UAnimatedView animation="fadeInUp" delay={300}>
          <YStack mt={36} gap={12}>
            <UText variant="meta-pill" fontWeight="600" color="$accentCyan" textAlign="center">
              What's coming
            </UText>
            {COMING_FEATURES.map((feature) => (
              <XStack
                key={feature.title}
                p={16}
                gap={14}
                ai="center"
                br={20}
                bg="$glass"
                borderWidth={1}
                borderColor="$glassBorder"
              >
                <YStack w={44} h={44} br={12} ai="center" jc="center" bg="$glassCyan" borderWidth={1} borderColor="$glassCyanBorder">
                  <Ionicons name={feature.icon} size={22} color={cyan} />
                </YStack>
                <YStack flex={1} gap={2}>
                  <UText variant="display-s" color="$textPrimary">
                    {feature.title}
                  </UText>
                  <UText variant="body-s" color="$textSecondary">
                    {feature.desc}
                  </UText>
                </YStack>
              </XStack>
            ))}
          </YStack>
        </UAnimatedView>

        <UAnimatedView animation="fadeInUp" delay={500}>
          <YStack
            mt={24}
            p={20}
            gap={8}
            ai="center"
            br={24}
            bg="rgba(18,14,42,0.75)"
            borderWidth={1}
            borderColor="rgba(135,54,247,0.5)"
            boxShadow="0 0 36px rgba(135,54,247,0.3)"
          >
            <Ionicons name="notifications-outline" size={28} color={getTokenValue('$accentPurple', 'color')} />
            <UText variant="display-m" color="$textPrimary" textAlign="center">
              Stay tuned
            </UText>
            <UText variant="body-s" color="$textSecondary" textAlign="center">
              We will notify you when premium launches
            </UText>
          </YStack>
        </UAnimatedView>
      </ScrollView>
    </UScreenLayout>
  );
}
