import { memo, useCallback, useMemo, useState } from 'react';
import { LayoutChangeEvent, PixelRatio } from 'react-native';
import { XStack, XStackProps } from 'tamagui';

import UIcon from '@/src/components/core/icons/uIcon';
import UText from '@/src/components/core/text/uText';
import ULocalImage, { ULocalImageProps,} from '@/src/components/core/image/uLocalImage';

export interface UImageProps extends XStackProps {
  imageSource?: string;
  fallBackText?: string;
  contentPosition?: ULocalImageProps['contentPosition'];
}

const UImage = ({
  imageSource,
  fallBackText = '',
  contentPosition,
  ...props
}: UImageProps) => {
  const [dimen, setDimen] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [isError, setIsError] = useState(false);

  const handleError = useCallback(() => {
    setIsError(true);
  }, []);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0 && (!dimen || dimen.width !== width)) {
      const aspectRatio = 1;
      const height = width * aspectRatio;
      setDimen({ width, height });
    }
  };

  const renderFallback = useCallback(() => {
    if (fallBackText) {
      return (
        <XStack
          w="100%"
          h="100%"
          bg="$secondary5"
          ai="center"
          jc="center"
          flexGrow={1}
        >
          <UText
            color="$white"
            variant="text-sm"
          >
            {fallBackText.slice(0, 3)}
          </UText>
        </XStack>
      );
    }
  }, [fallBackText, dimen?.height]);

  return (
    <XStack
      onLayout={handleLayout}
      h={dimen?.height}
      overflow="hidden"
      {...props}
    >
      {imageSource && !isError ? (
        <ULocalImage
          source={imageSource}
          contentFit="cover"
          contentPosition={contentPosition}
          flexGrow={1}
          onError={handleError}
        />
      ) : (
        renderFallback()
      )}
    </XStack>
  );
};

export default memo(UImage);
