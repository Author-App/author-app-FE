import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

// ponytail: comparing two versions; switch 01 to 02, then delete the one not picked
const authScreenBg = require('@/assets/images/authScreenBg02.jpg');

/** Full-bleed background for onboarding and every auth screen. */
const AuthBackground = () => (
  <>
    <Image source={authScreenBg} style={StyleSheet.absoluteFill} contentFit="cover" pointerEvents="none" />
    {/* Dims the bright portal so text and inputs on top stay readable. Tune the alpha. */}
    <View style={[StyleSheet.absoluteFill, styles.overlay]} pointerEvents="none" />
  </>
);

const styles = StyleSheet.create({
  overlay: { backgroundColor: 'rgba(2,1,3,0.55)' },
});

export default memo(AuthBackground);
