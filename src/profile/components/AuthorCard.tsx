import React, { memo, ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { YStack } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';

const authorProfilePicture = require('@/assets/images/padden.jpg');

interface AuthorCardProps {
  name: string;
  title: string;
  image?: string;
  /** Rendered under the title: the social links */
  children?: ReactNode;
}

const AuthorCard: React.FC<AuthorCardProps> = ({ name, title, image, children }) => (
  <UAnimatedView animation="fadeInUp" duration={400}>
    <YStack
      pt={28}
      px={20}
      pb={22}
      gap={12}
      ai="center"
      br={28}
      borderWidth={1}
      bg="rgba(18,14,42,0.7)"
      borderColor="$glassGlowBorder"
      boxShadow="0 0 30px rgba(135,54,247,0.22)"
    >
      {/* 3pt magenta-purple-cyan ring with a purple glow */}
      <YStack w={112} h={112} br={56} p={3} boxShadow="0 0 28px rgba(135,54,247,0.5)">
        <LinearGradient
          colors={['#F2A8FF', '#8736F7', '#00F0FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, styles.ring]}
        />
        <ULocalImage
          source={image ? { uri: image } : authorProfilePicture}
          width={106}
          height={106}
          borderRadius={53}
          contentFit="cover"
          accessibilityIgnoresInvertColors
        />
      </YStack>

      <UText variant="display-l" letterSpacing={0.88} color="$textPrimary" textAlign="center" accessibilityRole="header">
        {name}
      </UText>
      <UText variant="meta-pill" color="$accentCyan" textAlign="center">
        {title}
      </UText>

      {children}
    </YStack>
  </UAnimatedView>
);

const styles = StyleSheet.create({
  ring: { borderRadius: 56 },
});

export default memo(AuthorCard);
