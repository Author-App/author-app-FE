import { PropsWithChildren } from 'react';
import { XStack, XStackProps, YStack } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import UImage from '@/src/components/core/image/uImage';

interface UHeaderWithImageProps extends PropsWithChildren<XStackProps> {
  heroImage?: string;
  title: string;
  headerSubtitle?: React.ReactNode;
  heroFallbackText?: string;
}

const UHeaderWithImage = ({
  heroImage,
  title,
  headerSubtitle,
  heroFallbackText,
  ...props
}: UHeaderWithImageProps) => {
  return (
    <XStack
      bg="$neutral1"
      flexGrow={1}
      ai="center"
      gap={8}
      position="relative"
      {...props}
    >
      <UImage
        w={33}
        h={33}
        imageSource={heroImage}
        // borderRadius={8}
        borderRadius={20}
        fallBackText={heroFallbackText}
      />
      <YStack 
      // width='80%'
      // w="100%"
      >
        <UText
          mt={4}
          variant="text-md"
          color="$primary7"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </UText>
        {headerSubtitle}
      </YStack>
    </XStack>
  );
};

export default UHeaderWithImage;
