import React from 'react'
import { YStack, XStack, Image } from 'tamagui'
import UTextButton from '../../core/buttons/uTextButton'
import UText from '../../core/text/uText'
import UProgressBar from '../../core/display/uProgressBar'
import UIconButton from '../../core/buttons/uIconButtonVariants'
import { IconProps } from '@/assets/icons/types/iconProps'

interface HeroBannerProps {
  type?: 'book' | 'audiobook' | 'event' | 'promo'
  image: string
  eyebrow?: string
  title: string
  subtitle?: string
  ctaLabel?: string
  badge?: 'New' | 'Live' | 'Free' | string
  progress?: number 
  onPressCTA?: () => void;
  icon?: React.ComponentType<IconProps>; 
}

const HeroBanner: React.FC<HeroBannerProps> = ({
  type,
  image,
  eyebrow,
  title,
  subtitle,
  ctaLabel = 'Details',
  badge,
  progress,
  onPressCTA,
  icon,
}) => {
  const shouldShowIcon = type === 'book' || type === 'audiobook'

  return (
    <XStack
      height={180}
      borderRadius="$4"
      overflow="hidden"
      bg="$neutral0"
      onPress={onPressCTA}
      pressStyle={{ 
        opacity: 0.9,
        transform: [{ scale: 0.98 }]
      }}
      shadowColor="$neutral8"
      shadowOpacity={0.15}
      shadowRadius={12}
      shadowOffset={{ width: 0, height: 4 }}
      elevation={6}
    >
      {/* Left side - Content */}
      <YStack
        flex={1}
        p="$5"
        jc="space-between"
      >
        {/* Top section with eyebrow and title */}
        <YStack space="$2">
          {eyebrow && (
            <UText 
              variant='text-2xs' 
              color="$primary7" 
              tt="uppercase"
              fontWeight="600"
            >
              {eyebrow}
            </UText>
          )}

          <UText 
            color="$neutral10" 
            variant='text-md' 
            numberOfLines={2}
            fontWeight="700"
          >
            {title}
          </UText>

          {subtitle && (
            <UText 
              variant='text-sm' 
              color="$neutral7" 
              numberOfLines={2}
              lineHeight="$4"
            >
              {subtitle}
            </UText>
          )}
        </YStack>

        {/* Bottom section with CTA and progress */}
        <YStack space="$3">
          <XStack ai="center" space="$3">
            <UTextButton
              variant='primary-sm'
              onPress={onPressCTA}
              borderRadius="$6"
              bg="$primary5"
              pressStyle={{
                bg: "$primary6"
              }}
            >
              {ctaLabel}
            </UTextButton>

            {shouldShowIcon && icon && (
              <UIconButton
                variant="secondary-sm"
                icon={icon}
                onPress={() => console.log('Play Button')}
                bg="$neutral1"
                borderColor="$neutral3"
              />
            )}
          </XStack>

          {typeof progress === 'number' && (
            <UProgressBar
              percentage={progress * 100}
              isAnimate={true}
              foregroundColor='$primary5'
              backgroundColor='$neutral2'
            />
          )}
        </YStack>
      </YStack>

      {/* Right side - Image */}
      <YStack
        width={120}
        height="100%"
        ai="center"
        jc="center"
        mr="$3"
      >
        <Image
          source={{ uri: image }}
          width="100%"
          height="80%"
          resizeMode="contain"
        />
      </YStack>
    </XStack>
  )
}

export default HeroBanner

