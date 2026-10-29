import React, { memo, ReactNode, useId } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { YStack, YStackProps } from 'tamagui';

interface UScreenLayoutProps extends Omit<YStackProps, 'children'> {
  children: ReactNode;
}

/** The page every inner screen sits on: $bgPage with a purple haze at the top. */
export const UScreenLayout = memo(({ children, ...yStackProps }: UScreenLayoutProps) => {
  const { width, height } = useWindowDimensions();
  const hazeId = `screenHaze${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <YStack flex={1} bg="$bgPage">
      {/* CSS: radial-gradient(120% 50% at 50% 0%, rgba(135,54,247,0.22), transparent 60%) */}
      {/* One id per screen, since iOS shares gradients that share an id. Sized from the window and remounted on
          resize, since a tab hidden during a rotation never re-lays out its percentage-sized Svg */}
      <Svg key={`${width}x${height}`} width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <RadialGradient id={hazeId} cx="50%" cy="0%" rx="120%" ry="50%" fx="50%" fy="0%">
            <Stop offset="0" stopColor="#8736F7" stopOpacity={0.22} />
            <Stop offset="0.6" stopColor="#8736F7" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${hazeId})`} />
      </Svg>
      <YStack flex={1} {...yStackProps}>
        {children}
      </YStack>
    </YStack>
  );
});

UScreenLayout.displayName = 'UScreenLayout';

export default UScreenLayout;
