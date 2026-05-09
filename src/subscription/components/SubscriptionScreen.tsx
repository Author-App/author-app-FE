import React from 'react';
import { YStack, XStack, ScrollView } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import UHeader from '@/src/components/core/layout/uHeader';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import UBackButton from '@/src/components/core/buttons/uBackButton';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import UText from '@/src/components/core/text/uText';

// Raw color values for non-Tamagui components (LinearGradient, Ionicons)
// These match tamagui.config.ts tokens: secondary0, premiumTeal, premiumCoral, etc.
const COLORS = {
  gold: '#FFD700',        // $secondary0
  teal: '#14B8A6',        // $premiumTeal
  coral: '#FF6B6B',       // $premiumCoral
  navyLight: '#1A4D7A',   // $premiumNavyLight
  navyDark: '#132440',    // $brandNavy
} as const;

// Feature list for "What's Coming" section
const COMING_FEATURES = [
  { icon: 'book', title: 'Unlimited Access', desc: 'Read all books without limits' },
  { icon: 'headset', title: 'Premium Audiobooks', desc: 'Listen to exclusive content' },
  { icon: 'cloud-download', title: 'Offline Reading', desc: 'Download for offline access' },
  { icon: 'sparkles', title: 'Early Access', desc: 'Get new releases first' },
] as const;

// Gradient styles (memoized outside component)
const GLOW_GRADIENT = {
  colors: [COLORS.gold, COLORS.coral, COLORS.teal] as const,
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
};

const CIRCLE_GRADIENT = {
  colors: [COLORS.navyLight, COLORS.navyDark] as const,
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
};

// Feature card component
function FeatureCard({ icon, title, desc }: typeof COMING_FEATURES[number]) {
  return (
    <XStack
      bc="$premiumCardBg"
      br={16}
      p={16}
      ai="center"
      gap={14}
      borderWidth={1}
      borderColor="$premiumCardBorder"
    >
      <YStack
        w={44}
        h={44}
        br={12}
        ai="center"
        jc="center"
        bc="$premiumIconBg"
        flexShrink={0}
      >
        <Ionicons name={icon as any} size={22} color={COLORS.teal} />
      </YStack>
      <YStack f={1} gap={2}>
        <UText variant="label-sm" color="$white">{title}</UText>
        <UText variant="text-xs" color="$neutral5">{desc}</UText>
      </YStack>
      <Ionicons name="checkmark-circle" size={18} color={COLORS.gold} />
    </XStack>
  );
}

export function SubscriptionScreen() {
  return (
    <UScreenLayout>
      <UHeader
        title="Premium"
        leftControl={<UBackButton variant="glass-md" />}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <YStack ai="center" px={24} pt={20}>
          {/* Hero Section */}
          <UAnimatedView animation="fadeInUp" delay={100}>
            <YStack ai="center" gap={20}>
              {/* Rocket Icon with Glow */}
              <YStack ai="center" jc="center" position="relative">
                {/* Outer glow */}
                <YStack position="absolute" w={160} h={160} br={80} opacity={0.3} overflow="hidden">
                  <LinearGradient
                    {...GLOW_GRADIENT}
                    style={{ width: '100%', height: '100%', borderRadius: 80 }}
                  />
                </YStack>

                {/* Inner circle with rocket */}
                <YStack w={120} h={120} br={60} ai="center" jc="center" overflow="hidden">
                  <LinearGradient
                    {...CIRCLE_GRADIENT}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 60,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="rocket" size={56} color={COLORS.gold} />
                  </LinearGradient>
                </YStack>

                {/* Decorative elements */}
                <YStack position="absolute" top={0} right={10}>
                  <Ionicons name="sparkles" size={24} color={COLORS.gold} />
                </YStack>
                <YStack position="absolute" bottom={10} left={0}>
                  <Ionicons name="star" size={16} color={COLORS.teal} />
                </YStack>
              </YStack>

              {/* Heading */}
              <YStack ai="center" gap={4}>
                <UText variant="heading-h1" color="$white" textAlign="center">
                  Something Amazing
                </UText>
                <XStack ai="center" gap={8}>
                  <UText variant="heading-h1" color="$secondary0" textAlign="center">
                    Is Coming
                  </UText>
                  <Ionicons name="sparkles" size={28} color={COLORS.gold} />
                </XStack>
              </YStack>

              {/* Subtitle */}
              <UText variant="text-md" color="$neutral4" textAlign="center" px={20}>
                We're crafting an incredible premium experience just for you. Get ready to unlock the full potential of your reading journey.
              </UText>
            </YStack>
          </UAnimatedView>

          {/* Features Section */}
          <UAnimatedView animation="fadeInUp" delay={300} w="100%">
            <YStack mt={40} gap={12}>
              <XStack ai="center" gap={8} mb={4} jc="center">
                <Ionicons name="gift" size={18} color={COLORS.teal} />
                <UText variant="label-sm" color="$premiumTeal">WHAT'S COMING</UText>
              </XStack>

              <YStack gap={12}>
                {COMING_FEATURES.map((feature) => (
                  <FeatureCard key={feature.title} {...feature} />
                ))}
              </YStack>
            </YStack>
          </UAnimatedView>

          {/* Bottom CTA */}
          <UAnimatedView animation="fadeInUp" delay={500} w="100%">
            <YStack mt={32} p={20} br={20} ai="center" overflow="hidden">
              <LinearGradient
                colors={['rgba(255, 215, 0, 0.15)', 'rgba(20, 184, 166, 0.1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ position: 'absolute', inset: 0, borderRadius: 20 }}
              />
              <Ionicons name="notifications" size={32} color={COLORS.gold} />
              <UText variant="label-md" color="$white" mt={12} textAlign="center">
                Stay Tuned!
              </UText>
              <UText variant="text-xs" color="$neutral5" mt={4} textAlign="center">
                We'll notify you when premium launches
              </UText>
            </YStack>
          </UAnimatedView>
        </YStack>
      </ScrollView>
    </UScreenLayout>
  );
}