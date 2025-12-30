import React, { memo } from 'react';
import { XStack, YStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

import UText from '@/src/components/core/text/uText';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import assets from '@/assets/images';

const authorProfilePicture = require('@/assets/images/padden.jpg');
interface AuthorCardProps {
  name: string;
  title: string;
  image?: string;
}

const AuthorCard: React.FC<AuthorCardProps> = ({ name, title, image }) => {
  const teal = getTokenValue('$brandTeal', 'color');

  return (
    <UAnimatedView animation="fadeInUp" duration={400}>
      <XStack
        bg="$searchbarBg"
        borderRadius={20}
        p={20}
        borderWidth={1}
        borderColor="$searchbarBorder"
        gap={16}
        ai="center"
      >
        {/* Author Image */}
        <YStack
          w={100}
          h={100}
          br={50}
          overflow="hidden"
          borderWidth={3}
          borderColor="$brandTeal"
        >
          {image ? (
            <ULocalImage
              source={{ uri: image }}
              width={100}
              height={100}
              contentFit="cover"
            />
          ) : (
            <ULocalImage
              source={authorProfilePicture}
              width={100}
              height={100}
              contentFit="cover"
            />
          )}
        </YStack>

        {/* Author Info */}
        <YStack flex={1} gap={6}>
          <UText
            variant="heading-h2"
            color="$white"
            fontWeight="700"
          >
            {name}
          </UText>

          <XStack ai="center" gap={6}>
            <Ionicons name="pencil" size={14} color={teal} />
            <UText variant="text-sm" color="$brandTeal">
              {title}
            </UText>
          </XStack>
        </YStack>
      </XStack>
    </UAnimatedView>
  );
};

export default memo(AuthorCard);
