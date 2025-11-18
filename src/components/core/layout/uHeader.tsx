import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { XStack, YStack, YStackProps } from 'tamagui';

import USpacer from '@/src/components/core/layout/uSpacer';
import UText, { UTextProps } from '@/src/components/core/text/uText';

interface UHeaderProps extends YStackProps {
  title?: string;
  titleElement?: React.ReactElement;
  leftControl?: React.ReactElement;
  rightControl?: React.ReactElement;
  safeAreaDisabled?: boolean;
  textProps?: Partial<UTextProps>;
  headerColor?: string;
}

const UHeader = ({
  title,
  titleElement,
  leftControl,
  rightControl,
  safeAreaDisabled,
  textProps,
  headerColor = 'transparent',
  ...props
}: UHeaderProps) => {
  const { top } = useSafeAreaInsets();

  if (title) {
    if (titleElement) {
      throw new Error('title and titleElement cannot be used together');
    }

    titleElement = (
      <UText variant="heading-h1" {...textProps} numberOfLines={1}>
        {title}
      </UText>
    );
  }

  return (
    <YStack 
    // px={16} 
    w="100%" {...props} backgroundColor={headerColor}>
      {!safeAreaDisabled && <USpacer height={top} />}
      <XStack py={8} gap={8} jc="space-between" ai="center">
        {/* 0.8 2.5 0.8 */}
        {/* Left Section */}
        <XStack 
        flex={0.1} jc="center" ai="center">
          {leftControl}
        </XStack>

        {/* Center Title */}
        <XStack flex={0.8} jc="center" ai="center">
          {titleElement}
        </XStack>

        {/* Right Section */}
        <XStack flex={0.1} jc="center" ai="center">
          {rightControl}
        </XStack>

        {/* <XStack gap={8} flexGrow={1}>
          {leftControl}
          {titleElement}
        </XStack>
        {rightControl} */}
      </XStack>
    </YStack>
  );
};

export default UHeader;
