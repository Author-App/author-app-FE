import { memo } from 'react';
import { Image, ImageProps } from 'expo-image';
import { GetProps, styled } from 'tamagui';

const StyledImage = styled(Image, {});

export type ULocalImageProps = ImageProps & GetProps<typeof StyledImage>;

const ULocalImage = (props: ULocalImageProps) => {
  const { ...imageProps } = props;

  const key = imageProps.source
    ? typeof imageProps.source === 'string'
      ? imageProps.source
      : typeof imageProps.source === 'object' && imageProps.source && 'uri' in imageProps.source
        ? (imageProps.source as any).uri
        : JSON.stringify(imageProps.source)
    : Math.random().toString();

  return <StyledImage key={key} {...imageProps} />;
};

export default memo(ULocalImage);
