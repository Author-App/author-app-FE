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
}

const UHeader = ({
  title,
  titleElement,
  leftControl,
  rightControl,
  safeAreaDisabled,
  textProps,
  ...props
}: UHeaderProps) => {
  const { top } = useSafeAreaInsets();

  if (title) {
    if (titleElement) {
      throw new Error('title and titleElement cannot be used together');
    }

    titleElement = (
      <UText variant="label-md" {...textProps}>
        {title}
      </UText>
    );
  }

  return (
    <YStack px={16} w="100%" {...props}>
      {!safeAreaDisabled && <USpacer height={top} />}
      <XStack py={8} gap={8} jc="space-between" ai="center">

        {/* Left Section */}
        <XStack flex={1} jc="flex-start" ai="center">
          {leftControl}
        </XStack>

        {/* Center Title */}
        <XStack flex={1} jc="center" ai="center">
          {titleElement}
        </XStack>

        {/* Right Section */}
        <XStack flex={1} jc="flex-end" ai="center">
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
