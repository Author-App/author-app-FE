import React, { memo } from 'react'
import { YStack } from 'tamagui'
import UText from '../../core/text/uText'

interface HeroBannerProps {
  title: string
}

const HeroBanner: React.FC<HeroBannerProps> = ({ title }) => {
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
      <YStack
        backgroundColor="rgba(50, 50, 50, 0.75)"
        paddingTop={20}
        paddingBottom={12}
        paddingHorizontal={24}
        borderRadius={13}
      >
        <UText variant="text-xs" color="#F2EAD2">
          NEW RELEASE
        </UText>
        <UText
          variant="heading-h1"
          color="#F2EAD2"
          fontWeight="700"
          marginLeft="auto"
          mt={-5}
        >
          "{title}"
        </UText>
      </YStack>
    </YStack>
  )
}

export default memo(HeroBanner)

