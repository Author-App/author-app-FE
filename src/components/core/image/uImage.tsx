import { memo, useCallback, useEffect, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import { XStack, XStackProps } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import ULocalImage, { ULocalImageProps } from '@/src/components/core/image/uLocalImage';
import USkeleton from '../display/uSkeleton';

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
  const [isLoading, setIsLoading] = useState(true);

  // Reset loading state when image source changes
  useEffect(() => {
    if (imageSource) {
      setIsLoading(true);
      setIsError(false);
    }
  }, [imageSource]);

  const handleError = useCallback(() => {
    setIsError(true);
    setIsLoading(false);
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
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
          <UText color="$white" variant="text-sm">
            {fallBackText.slice(0, 3)}
          </UText>
        </XStack>
      );
    }
    return null;
  }, [fallBackText]);

  return (
    <XStack
      onLayout={handleLayout}
      h={dimen?.height}
      overflow="hidden"
      position="relative"
      {...props}
    >
      {imageSource && !isError ? (
        <>
          {isLoading && dimen && (
            <USkeleton
              width={dimen.width}
              height={dimen.height}
              radius={props.borderRadius ? Number(props.borderRadius) : 0}
              position="absolute"
              zIndex={1}
            />
          )}
          <ULocalImage
            source={imageSource}
            contentFit="cover"
            contentPosition={contentPosition}
            flexGrow={1}
            onError={handleError}
            onLoad={handleLoad}
            style={{
              opacity: isLoading ? 0 : 1,
            }}
          />
        </>
      ) : (
        renderFallback()
      )}
    </XStack>
  );
};

export default memo(UImage);
