import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { YStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

import ULocalImage from '@/src/components/core/image/uLocalImage';

export const DETAIL_HERO_HEIGHT = 300;

interface UDetailHeroProps {
  thumbnail?: string;
  /** Shown on a gradient when there is no thumbnail */
  icon: keyof typeof Ionicons.glyphMap;
}

/** Full-bleed cover fading into the page. The screen draws the title over the fade. */
export function UDetailHero({ thumbnail, icon }: UDetailHeroProps) {
  return (
    <YStack h={DETAIL_HERO_HEIGHT} ai="center" jc="center">
      {thumbnail ? (
        <ULocalImage source={{ uri: thumbnail }} width="100%" height={DETAIL_HERO_HEIGHT} contentFit="cover" />
      ) : (
        <>
          <LinearGradient
            colors={['#1B0F3F', '#0C3A52']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Ionicons name={icon} size={64} color={getTokenValue('$accentPurple', 'color')} />
        </>
      )}
      <LinearGradient colors={['rgba(2,1,3,0)', getTokenValue('$bgPage', 'color')]} style={styles.fade} pointerEvents="none" />
    </YStack>
  );
}

const styles = StyleSheet.create({
  fade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 180 },
});
