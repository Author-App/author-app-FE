import { memo } from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getTokenValue } from 'tamagui';

/** The CTA gradient, purple to cyan left to right. Fills its parent; pass the parent's radius. */
const UCtaGradient = ({ radius }: { radius: number }) => (
  <LinearGradient
    colors={[getTokenValue('$ctaStart', 'color'), getTokenValue('$ctaEnd', 'color')]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
    pointerEvents="none"
  />
);

export default memo(UCtaGradient);
