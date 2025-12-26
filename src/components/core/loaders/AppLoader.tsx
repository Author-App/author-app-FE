import React, { memo } from 'react';
import { YStack, YStackProps } from 'tamagui';
import LottieView from 'lottie-react-native';

interface AppLoaderProps extends YStackProps{
  size?: number;
}

const AppLoader: React.FC<AppLoaderProps> = ({ 
  backgroundColor = '$neutral1', 
  size = 200 
}) => {
  return (
    <YStack 
      flex={1} 
      jc="center" 
      ai="center" 
      backgroundColor={backgroundColor}
    >
      <LottieView
        source={require('@/assets/animations/loader.json')}
        autoPlay
        loop
        style={{ width: size, height: size }}
      />
    </YStack>
  );
};

export default memo(AppLoader);
