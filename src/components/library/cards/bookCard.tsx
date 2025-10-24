import React from 'react'
import { FlatList } from 'react-native'
import { YStack, XStack, Image, Text, View } from 'tamagui'
import UText from '../../core/text/uText'
import { useTheme } from 'tamagui'
import { BookCardProps } from '@/src/types/library/libraryTypes'
import assets from '@/assets/images'
import UProgressBar from '../../core/display/uProgressBar'
import IconHeadphone from '@/assets/icons/iconHeadphone'
import UIconButton from '../../core/buttons/uIconButtonVariants'
import IconDuration from '@/assets/icons/iconDuration'
import IconBook from '@/assets/icons/iconBook'
import IconSaveBookMark from '@/assets/icons/iconSaveBookMark'

const BookCard: React.FC<BookCardProps> = ({
    cover,
    title,
    author,
    summary,
}) => {
    const theme = useTheme()

    const CARD_WIDTH = 95
    const CARD_HEIGHT = CARD_WIDTH * 1.5 // 2:3 aspect ratio

    console.log("THIS IS AUTHOR", author);


    return (
        <XStack
            width="100%"
            p="$3"
            borderRadius="$4"
            // backgroundColor="$background"
            alignItems="center"
            mb="$3"
            pressStyle={{ opacity: 0.8 }}
            onPress={() => console.log("Card pressed")}
            space="$3"
            borderWidth={1}
            borderColor={'silver'}
        >
            {/* Left: Cover Image */}
            <Image
                source={typeof cover === 'string' ? { uri: cover } : cover}
                width={CARD_WIDTH}
                height={CARD_HEIGHT}
                borderRadius="$4"
            />

            {/* Right: Content */}
            <YStack height={'100%'} justifyContent='space-between'>
                <XStack justifyContent='space-between' alignItems='center' width={'82%'}>
                    <YStack>
                        <UText numberOfLines={1} variant="heading-h2-bold" color="$neutral10" >
                            {title}
                        </UText>

                        <UText numberOfLines={1} color="$neutral4" variant="text-xs" mt="$1">
                            by {author}
                        </UText>
                    </YStack>
                    <UIconButton
                        variant="quaternary-xxs"
                        icon={IconSaveBookMark}
                        onPress={() => console.log('Facebook login')}

                    />
                </XStack>

                <XStack width={'80%'} justifyContent='space-between'>
                    <XStack ai='center'>
                        <UIconButton
                            variant="quaternary-xxs"
                            icon={IconBook}
                            onPress={() => console.log('Facebook login')}

                        />
                        {/* <Image 
                        source={assets.icons.ebookIcon}
                            width={24}
                            height={24} 
                             /> */}
                        <UText numberOfLines={1} color="$neutral6" variant="text-xs" mt="$1" ml="$1">
                            Book
                        </UText>

                    </XStack>

                    <XStack ai='center'>
                        <UIconButton
                            variant="quaternary-xxs"
                            icon={IconDuration}
                            onPress={() => console.log('Facebook login')}

                        />
                        <UText numberOfLines={1} color="$neutral6" variant="text-xs" mt="$1" ml="$1">
                            45 min
                        </UText>

                    </XStack>


                </XStack>

                <YStack>
                    <UProgressBar
                        percentage={0.6 * 100}
                        isAnimate={true}
                        foregroundColor='$secondary5'
                        width={'85%'}
                    />
                    <XStack
                        jc='space-between' mt={'$2'} width={'80%'}>
                        <UText numberOfLines={1} color="$neutral6" variant="text-xs" >
                            40/85 minutes
                        </UText>

                        <UText numberOfLines={1} color="$secondary5" variant="text-xs" >
                            65%
                        </UText>


                    </XStack>
                </YStack>


                {/* {summary ? (
                    <UText numberOfLines={2} color="$neutral5" variant="text-xs" mt="$1">
                        {summary}
                    </UText>
                ) : null} */}
            </YStack>

        </XStack >
    )
}

export default BookCard
