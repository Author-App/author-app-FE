import React, { memo } from 'react'
import { YStack, XStack, Image } from 'tamagui'
import UTextButton from '../../core/buttons/uTextButton'
import UText from '../../core/text/uText'
import UProgressBar from '../../core/display/uProgressBar'
import UIconButton from '../../core/buttons/uIconButtonVariants'
import { IconProps } from '@/assets/icons/types/iconProps'
import LinearGradient from 'react-native-linear-gradient';
// import { BlurTint, BlurView } from 'expo-blur';

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
  const shouldShowIcon = type === 'audiobook'

  console.log("This is title,", title);


  return (
    <YStack
      width="95%"
      alignSelf="center"
      borderRadius={13}
      overflow="hidden"
      position="absolute"
      bottom={-30}
      zIndex={999}
      shadowColor="#000"
      shadowOpacity={0.3}
      shadowRadius={10}
      shadowOffset={{ width: 0, height: 4 }}
      elevation={6}
    >
      {/* <BlurView
        intensity={80}
        tint="dark"
        style={{ 
          backgroundColor:'rgba(11, 42, 74, 0.7)',
          paddingTop: 20,
          paddingBottom: 12,
          paddingHorizontal: 24,
          borderRadius: 13,
        }}
      > */}

      {/* <BlurView
        style={{ padding: 20, borderRadius: 13 }}
        blurType="dark"
        blurAmount={20}
      > */}
      <YStack
        style={{

          backgroundColor: 'rgba(50, 50, 50, 0.75)', // darker greyish overlay
          paddingTop: 20,
          paddingBottom: 12,
          paddingHorizontal: 24,
          borderRadius: 13,
        }}
      >
        <UText variant="text-xs" color={'#F2EAD2'}>
          NEW RELEASE
        </UText>
        <UText variant="heading-h1" color={'#F2EAD2'} fontWeight={'700'} marginLeft={'auto'} mt={-5}>
          “{title}”
        </UText>
      </YStack>
      {/* </BlurView> */}
      {/* </BlurView> */}
    </YStack >
  )
}

export default memo(HeroBanner)

