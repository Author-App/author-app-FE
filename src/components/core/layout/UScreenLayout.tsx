import React, { memo, ReactNode } from 'react';
import { ImageBackground, StyleSheet, ViewStyle } from 'react-native';
import { YStack, YStackProps } from 'tamagui';

const innerScreenBg = require('@/assets/images/innerScreenBg.png');

interface UScreenLayoutProps extends Omit<YStackProps, 'children'> {
  children: ReactNode;
  containerStyle?: ViewStyle;
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});

export const UScreenLayout = memo(({
  children,
  containerStyle,
  ...yStackProps
}: UScreenLayoutProps) => {

  return (
    <ImageBackground
      source={innerScreenBg}
      resizeMode="cover"
      style={[styles.background, containerStyle]}
    >
      <YStack
        flex={1}
        {...yStackProps}
      >
        {children}
      </YStack>
    </ImageBackground>
  );
});

UScreenLayout.displayName = 'UScreenLayout';

export default UScreenLayout;
