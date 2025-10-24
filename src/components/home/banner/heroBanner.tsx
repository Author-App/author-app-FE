import React from 'react'
import { YStack, XStack, Image } from 'tamagui'
// import { LinearGradient } from '@tamagui/linear-gradient'
import UTextButton from '../../core/buttons/uTextButton'
import UText from '../../core/text/uText'
import UProgressBar from '../../core/display/uProgressBar'
import UIconButton from '../../core/buttons/uIconButtonVariants'
import { BlurTint, BlurView } from 'expo-blur';
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
  tint?: BlurTint;
  icon?: React.ComponentType<IconProps>; 
  blurViewIntensity?: number;
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
  tint,
  icon,
  blurViewIntensity,
}) => {
  const shouldShowIcon = type === 'book' || type === 'audiobook'


  return (
    <YStack
      height={260}
      borderRadius="$4"
      overflow="hidden"
      position="relative"
      bg="$gray5"
      onPress={onPressCTA}
      pressStyle={{ opacity: 0.9 }}

    >

      <Image
        source={{ uri: image }}
        width="100%"
        height="100%"
        position="absolute"
      />

      {/* <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
        start={[0, 0]}
        end={[0, 1]}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
      /> */}

      <YStack p="$4"
        jc="flex-end"
        h="100%" space="$2">

        <BlurView
          intensity={blurViewIntensity}
          tint={tint || 'systemThinMaterialDark'}
          style={{
            borderRadius: 12,
            paddingVertical: 12,
            paddingTop: 12,
            paddingHorizontal: 10,
            alignSelf: 'flex-start',
            overflow: 'hidden',
            width: '100%'
          }}
        >

          {eyebrow && (
            <UText variant='text-2xs' color="$white" tt="uppercase">
              {eyebrow}
            </UText>
          )}


          <XStack
            width="100%"
            alignItems="center"
            justifyContent="space-between"
            // paddingHorizontal="$3"
            paddingVertical="$2"
          >
            <YStack flexShrink={1}>
              <UText color="$white" variant='heading-h1-bold' numberOfLines={2} width="90%">
                {title}
              </UText>

              {subtitle && (

                <UText variant='text-sm' color="$white" numberOfLines={1}>
                  {subtitle}
                </UText>
              )}
            </YStack>

            {
              shouldShowIcon && icon &&
              <UIconButton
                variant="tertiary-md"
                icon={icon}
                onPress={() => console.log('Play Button')}
                alignSelf='center'
              />
            }

          </XStack>


          <XStack
            ai="center"
            space="$2"
            mt="$3"
            mb="$4"
          >
            <UTextButton
              variant='tertiary-sm'
              onPress={onPressCTA}
              borderRadius={50}

            >
              {ctaLabel}
            </UTextButton>

            {badge && (
              <YStack
                px="$2"
                py="$1"
                borderRadius={50}
                bg={
                  badge === 'Live'
                    ? '$red10'
                    : badge === 'Free'
                      ? '$positiveAlpha7'
                      : '$blue10'
                }
              >
                <UText variant='text-2xs' color="$white" >
                  {badge}
                </UText>
              </YStack>
            )}
          </XStack>

          {typeof progress === 'number' && (
            <UProgressBar
              percentage={progress * 100}
              isAnimate={true}
              foregroundColor='$white'
            />
          )}


        </BlurView>
      </YStack>
    </YStack>
  )
}

export default HeroBanner

