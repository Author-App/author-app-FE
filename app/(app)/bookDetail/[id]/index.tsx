import assets from '@/assets/images';
import UTextButton from '@/src/components/core/buttons/uTextButton';
import UHeaderWithBackground from '@/src/components/core/layout/uHeaderWithBackground';
import UText from '@/src/components/core/text/uText';
import { booksData, libraryData } from '@/src/data/libraryData';
import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';
import { Button, Card, Image, Progress, Text, View, XStack, YStack } from 'tamagui';
import { Rating } from 'react-native-ratings';
import IconStar from '@/assets/icons/iconStar';


const reviewsData = [
    {
        id: 1,
        name: 'Mara',
        date: 'Sep 2025',
        reviewTitle: 'Couldn’t put it down.',
        reviewBody: 'Rich worldbuilding and a grounded hero. The desert politics felt believable.',
        avatar: assets.images.padden,
        rating: 5,
    },
    {
        id: 2,
        name: 'John Peter',
        date: 'Sep 2025',
        reviewTitle: 'Great pacing.',
        reviewBody: 'Loved the battles; wanted a longer epilogue.',
        avatar: assets.images.padden,
        rating: 3,
    },
]

const ratingsDistribution = [
    { stars: 5, percent: 62 },
    { stars: 4, percent: 22 },
    { stars: 3, percent: 9 },
    { stars: 2, percent: 4 },
    { stars: 1, percent: 3 },
]

const BookDetail = () => {
    const { id } = useLocalSearchParams();

    console.log("THIS IS BOOK DETAILS ID", id);
    const book = libraryData.find(b => b.id === Number(id));

    return (
        <YStack flex={1} backgroundColor={'$white'}>
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                <YStack position="relative">
                    <UHeaderWithBackground showBackButton={true} />
                    <Card
                        elevate
                        // backgroundColor={'$bg2'}
                        backgroundColor={'$bg2'}
                        width="50%"
                        alignSelf="center"
                        borderRadius={15}
                        shadowColor={'#000'}
                        shadowOffset={{ width: 0, height: 3 }}
                        shadowOpacity={0.1}
                        shadowRadius={6}
                        position="absolute"
                        bottom={'-50%'}
                        zIndex={999}
                        paddingBottom={10}
                    >
                        <View style={{ width: '100%', height: 200, overflow: 'hidden', borderRadius: 15 }}>
                            <Image
                                source={book?.cover}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    aspectRatio: 0.5,
                                    alignSelf: 'center',
                                    // resizeMode: 'cover',
                                    top: 0,
                                    position: 'absolute',
                                }}
                            />
                        </View>
                        <YStack width={'80%'} alignSelf='center'>
                            <UText variant='heading-h2' textAlign='center' mt={10}>
                                {/* The Desert Kings Heir */}
                                {book?.title}
                            </UText>
                            <UText variant='text-md' textAlign='center' mt={4} color={'$neutral8'}>
                                {book?.author}
                                {/* Stanley Paden */}
                            </UText>
                        </YStack>
                    </Card>
                </YStack>
                <YStack mt={'45%'} px={20}>
                    <XStack justifyContent='center' gap={10} mt={20}>
                        <YStack
                            backgroundColor={'$white'}
                            borderColor={'#7b6f5c'}
                            borderWidth={1}
                            borderRadius={10}
                            px={12}
                            py={6}
                        >
                            <UText variant='text-sm' color={'#7b6f5c'}>Genre</UText>
                        </YStack>

                        <YStack
                            backgroundColor={'#1e3a8a'}
                            borderRadius={10}
                            px={12}
                            py={6}
                        >
                            <UText variant='text-sm' color={'$white'}>New</UText>
                        </YStack>

                        {
                            book?.isLocked &&
                            <YStack
                                backgroundColor={'#d4af37'}
                                borderRadius={10}
                                px={12}
                                py={6}
                            >
                                <UText variant='text-sm' color={'$white'}>Premium</UText>
                            </YStack>
                        }
                    </XStack>
                    <UText variant='text-md' mt={20} lineHeight={22}>
                        Set against the vast desert backdrop, a young heir learns the weight of his legacy, battles internal and external foes, and uncovers secrets that could change the empire.
                    </UText>

                    <UText variant='heading-h2' mt={25}>
                        Synopsis
                    </UText>
                    <UText variant='text-md' mt={10} lineHeight={22}>
                        In the heart of the scorching desert, Prince Aric stands at the precipice of power. The ancient sands whisper tales of his lineage, and the weight of the crown presses down upon him. Confronted by enemies and guided by destiny, his choices could reshape the empire forever.
                    </UText>
                    {book?.isLocked ?
                        <UTextButton variant='secondary-md' height={50} mt={20}>Purchase Book</UTextButton> :
                        <UTextButton variant='secondary-md' height={50} mt={20}>Start reading</UTextButton>
                    }

                    <XStack width={'100%'} jc={'space-between'} my={20}>
                        <UText variant='heading-h2' textAlign='center'>
                            More from Stanley Padden
                        </UText>
                        <UText variant='text-md' textAlign='center' color={'$secondaryHover'}>
                            See all
                        </UText>

                    </XStack>

                    <FlashList
                        horizontal
                        data={booksData}
                        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
                        // optional: add some side padding
                        contentContainerStyle={{ paddingRight: 20, backgroundColor: '$white' }}
                        style={{ backgroundColor: '$white' }}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) =>
                            <Card
                                // backgroundColor={'$bg2'}
                                backgroundColor={'$bg2'}
                                width={150}
                                alignSelf="center"
                                borderRadius={15}
                                paddingBottom={10}
                            >
                                <View style={{ width: '100%', height: 150, overflow: 'hidden', borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
                                    <Image
                                        source={book?.cover}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            aspectRatio: 0.5,
                                            alignSelf: 'center',
                                            // resizeMode: 'cover',
                                            top: 0,
                                            position: 'absolute',
                                        }}
                                    />
                                </View>
                                <YStack width={'80%'} alignSelf='center'>
                                    <UText variant='heading-h2' numberOfLines={2} mt={10}>
                                        {/* The Desert Kings Heir */}
                                        {item?.title}
                                    </UText>
                                    <UText variant='text-md' numberOfLines={1} mt={7} color={'$neutral8'} width={'100%'}>
                                        {item?.author}
                                        {/* Stanley Paden */}
                                    </UText>
                                </YStack>
                            </Card>
                        }

                    />

                    <YStack>
                        {/* Heading */}
                        <UText variant='heading-h1' mt={25} mb={15}>
                            Reviews
                        </UText>

                        {/* Rating Summary */}
                        <XStack alignItems="center" width={'100%'} jc={'space-between'}>
                            <YStack width={'65%'} gap={12}>

                                {ratingsDistribution.map((item) => (
                                    <XStack key={item.stars} alignItems="center" gap={5}>
                                        <UText variant='text-sm' width={15}>{item.stars}</UText>
                                        <Progress value={item.percent} backgroundColor="$neutral1" height={6} flex={1}>
                                            <Progress.Indicator backgroundColor="$notice5" />
                                        </Progress>
                                        {/* <Text width={30} textAlign="right">
                                            {item.percent}%
                                        </Text> */}
                                    </XStack>
                                ))}
                            </YStack>
                            <YStack jc={'space-between'}>
                                <YStack>
                                    <XStack ai={'center'}>
                                        <UText variant='heading-h1-bold'>
                                            4.6
                                        </UText>
                                        <IconStar/>
                                    </XStack>

                                    <UText variant='text-sm' color="$color10">273 ratings</UText>
                                </YStack>

                                <YStack mt={25}>
                                    <UText variant='heading-h1-bold'>
                                        88%
                                    </UText>
                                    <UText  variant='text-sm' color="$color10">Recommended</UText>
                                </YStack>
                            </YStack>


                        </XStack>

                        {/* Write Review Button */}
                        <UTextButton variant='primary-md' mt={30} mb={20}>
                            Write a Review
                        </UTextButton>

                        {/* Reviews List */}
                        <YStack space="$4">
                            {reviewsData.map((item) => (
                                <XStack key={item.id} space="$3">
                                    <Image
                                        source={{ uri: item.avatar }}
                                        style={{
                                            width: 45,
                                            height: 45,
                                            borderRadius: 999,
                                        }}
                                    />
                                    <YStack flex={1}>
                                        <XStack justifyContent="space-between" alignItems="center">
                                            <UText variant='heading-h2-bold'>{item.name}</UText>
                                            <UText variant='text-xs' color="$color9">{item.date}</UText>
                                        </XStack>
                                        <Rating
                                            type="custom"
                                            imageSize={18}
                                            readonly
                                            startingValue={item.rating}
                                            ratingColor="#d4af37"   // gold-like color
                                            // tintColor="#fff9ee"     
                                            ratingBackgroundColor="#e5e5e5"
                                            style={{ alignSelf: 'flex-start', marginVertical: 5 }}
                                        />
                                        {/* <Text fontWeight="600" mt="$1">
                                            {item.reviewTitle}
                                        </Text> */}
                                        <UText variant='text-xs' color="$color10">{item.reviewBody}</UText>
                                    </YStack>
                                </XStack>
                            ))}
                        </YStack>
                    </YStack>


                </YStack>


            </ScrollView >
        </YStack >
    );


}

export default BookDetail;