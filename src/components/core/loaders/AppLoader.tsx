import React, { memo } from 'react';
import { Image } from 'react-native';
import { YStack, YStackProps } from 'tamagui';
import LottieView from 'lottie-react-native';
import { FEATURE_FLAGS } from '@/src/config/featureFlags';

// Lottie animation sources
const LOTTIE_SOURCES = {
  'lottie-bomb': require('@/assets/animations/loaderBomb.json'),
  'lottie-default': require('@/assets/animations/loader.json'),
} as const;

// GIF source
const GIF_SOURCE = require('@/assets/animations/loader.gif');

interface AppLoaderProps extends YStackProps {
  size?: number;
}

const AppLoader: React.FC<AppLoaderProps> = ({ size = 200, ...props }) => {
  const loaderType = FEATURE_FLAGS.LOADER_TYPE;

  const renderLoader = () => {
    if (loaderType === 'gif') {
      return (
        <Image
          source={GIF_SOURCE}
          style={{ width: size, height: size }}
          resizeMode="contain"
        />
      );
    }

    // Lottie animation
    const lottieSource = LOTTIE_SOURCES[loaderType];
    return (
      <LottieView
        source={lottieSource}
        autoPlay
        loop
        style={{ width: size, height: size }}
      />
    );
  };

  return (
    <YStack
      flex={1}
      jc="center"
      ai="center"
      backgroundColor="$brandNavy"
      {...props}
    >
      {renderLoader()}
    </YStack>
  );
};

export default memo(AppLoader);
