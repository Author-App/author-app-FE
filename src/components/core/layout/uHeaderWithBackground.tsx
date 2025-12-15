import React, { memo } from 'react'
import { Dimensions, ImageBackground, ImageSourcePropType, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { XStack, YStack, YStackProps } from 'tamagui'

import USpacer from '@/src/components/core/layout/uSpacer'
import UText, { UTextProps } from '@/src/components/core/text/uText'
import assets from '@/assets/images'
import { View } from 'react-native'
import { useRouter } from 'expo-router'
import IconArrowLeft from '@/assets/icons/iconArrowLeft'

export interface UHeaderWithBackgroundProps extends Omit<YStackProps, 'backgroundImage'> {
    title?: string
    titleElement?: React.ReactElement
    leftControl?: React.ReactElement
    rightControl?: React.ReactElement
    bgImage?: ImageSourcePropType
    safeAreaDisabled?: boolean
    textProps?: Partial<UTextProps>
    imageOverlayColor?: string
    showBackButton?: boolean
}

const UHeaderWithBackground: React.FC<UHeaderWithBackgroundProps> = ({
    title,
    titleElement,
    leftControl,
    rightControl,
    bgImage,
    safeAreaDisabled,
    textProps,
    imageOverlayColor = 'rgba(0,0,0,0.3)',
    showBackButton = false,
    ...props
}) => {
    const { top } = useSafeAreaInsets()

    const router = useRouter() //added

    const { height: screenHeight } = Dimensions.get('window');

    const resolvedBackground = bgImage ?? assets.images.headerbg2


    if (title && titleElement) {
        throw new Error('title and titleElement cannot be used together')
    }

    const resolvedTitleElement = titleElement ?? (
        title ? (
            <YStack backgroundColor={'$secondary'} ml={6} px={15} py={8} borderRadius={10}>
                <UText variant="heading-h2" color="$black" {...textProps}>
                    {title}
                </UText>
            </YStack>
        ) : null
    )

    return (
        <YStack zIndex={-1} w="100%" {...props}>

            <ImageBackground
                source={resolvedBackground}
                style={{
                    width: '100%',
                    height: 350,
                    justifyContent: 'flex-end',
                    paddingBottom: 12,
                }}
                resizeMode="cover"
            >
                
                {showBackButton ? (

                    <TouchableOpacity style={{position:'absolute', top: 50 , left: 10}} onPress={() => router.back()}>
                        <IconArrowLeft color={'$white'} dimen={26}/>
                    </TouchableOpacity>
                ) : (
                    leftControl
                )}

                {!safeAreaDisabled && <USpacer height={top} />}
                <XStack py={12} jc="space-between" ai="flex-end"
                    style={{ paddingTop: safeAreaDisabled ? 0 : top }}
                >

                    <XStack flex={1} jc="flex-start" ai="center">
                        {resolvedTitleElement}
                    </XStack>
                </XStack>

            </ImageBackground>


        </YStack>
    )
}

export default memo(UHeaderWithBackground)
