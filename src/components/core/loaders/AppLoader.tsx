import React, { memo } from 'react';
import { YStack, YStackProps } from 'tamagui';
import LottieView from 'lottie-react-native';

interface AppLoaderProps extends YStackProps{
  size?: number;
}

const AppLoader: React.FC<AppLoaderProps> = ({ 
  size = 200,
  ...props
}) => {
  return (
    <YStack 
      flex={1} 
      jc="center" 
      ai="center" 
      backgroundColor="$brandNavy"
      {...props}
    >
      <LottieView
        source={require('@/assets/animations/loaderBomb.json')}
        autoPlay
        loop
        style={{ width: size, height: size }}
      />
    </YStack>
  );
};

export default memo(AppLoader);
