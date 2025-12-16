import assets from '@/assets/images';
import UTextButton from '@/src/components/core/buttons/uTextButton';
import UHeaderWithBackground from '@/src/components/core/layout/uHeaderWithBackground';
import UText from '@/src/components/core/text/uText';
import { booksData, libraryData } from '@/src/data/libraryData';
import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView } from 'react-native';
import { Button, Card, Image, Progress, Text, View, XStack, YStack } from 'tamagui';
import { Rating } from 'react-native-ratings';
import IconStar from '@/assets/icons/iconStar';
import useBookDetailController from '@/src/controllers/useBookDetailsController';
import { formatDate } from '@/src/utils/helper';
import UImage from '@/src/components/core/image/uImage';
import RatingModal from '@/src/components/core/modals/ratingModal';
import { useState } from 'react';
import PaymentModal from '@/src/components/core/modals/paymentModal';


const BookDetail = () => {
    const { states, functions } = useBookDetailController();
    const { book, moreBooks, ratingStats, loading, modalVisible } = states;


    if (loading) {
        return (
            <YStack flex={1} jc="center" ai="center">
                <ActivityIndicator size="large" />
            </YStack>
        );
    }
    if (!book) return <UText>No data</UText>;

    // console.log("THIS IS MORE BOOKS", moreBooks);

    // console.log("THIS IS RATING STATS", ratingStats);

    console.log("THIS IS BOOK HAS ACCESS", book.hasAccess);
    const router = useRouter();



    return (
        <>
            <YStack flex={1} backgroundColor={'$white'}>
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 40 }}
                >
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
                                    source={{ uri: book.thumbnail || book.cover }}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        aspectRatio: 0.5,
                                        alignSelf: 'center',
                                        top: 0,
                                        position: 'absolute',
                                    }}
                                />
                            </View>
                            <YStack width={'80%'} alignSelf='center'>
                                <UText variant='heading-h2' textAlign='center' mt={10}>
                                    {book?.title}
                                </UText>
                                <UText variant='text-md' textAlign='center' mt={4} color={'$neutral8'}>
                                    {book?.author}
                                </UText>
                            </YStack>
                        </Card>
                    </YStack>
                    <YStack mt={'45%'} px={20}>
                        <XStack justifyContent='center' gap={10} mt={20}>

                            {
                                book?.tags?.map((tag: { name: string; color?: string }, index: number) =>

                                    <YStack
                                        backgroundColor={'#1e3a8a'}
                                        // style={{ backgroundColor: tag?.color }}
                                        borderRadius={10}
                                        px={12}
                                        py={6}
                                        key={index}
                                    >
                                        <UText variant='text-sm' color={'$white'}>{tag?.name}</UText>
                                    </YStack>
                                )
                            }

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
                            {book?.description}
                        </UText>

                        <UText variant='heading-h2' mt={25}>
                            Synopsis
                        </UText>
                        <UText variant='text-md' mt={10} lineHeight={22}>
                            {book.synopsis}
                        </UText>
                        {(book.isFree || !book.isFree && book.hasAccess) ?
                            <UTextButton variant='secondary-md' height={50} mt={20}
                                onPress={() => {
                                    if (book.type === "audiobook") {
                                        router.push({
                                            pathname: "/(app)/audiobookPlayer",
                                            params: { bookId: book.id },
                                        });
                                    } else {
                                        router.push({
                                            pathname: "/(app)/ebookReader",
                                            params: { bookId: book.id },
                                        });
                                    }
                                }}
                            >Start {book.type === "audiobook" ? "listening" : "reading"}</UTextButton> :
                            <UTextButton
                                variant='secondary-md'
                                height={50} mt={20}
                                onPress={functions.purchaseBook}
                            >Purchase Book – {book.price} {book.currency}</UTextButton>

                        }

                        {moreBooks?.length > 0 &&
                            <>
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
                                    data={moreBooks}
                                    ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
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
                                            {console.log("THIS IS ITEM THUMBNAIL", item.thumbnail)}
                                            <View style={{ width: '100%', height: 150, overflow: 'hidden', borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
                                                <Image
                                                    source={{ uri: item.thumbnail }}
                                                    style={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        aspectRatio: 0.5,
                                                        alignSelf: 'center',
                                                        top: 0,
                                                        position: 'absolute',
                                                    }}
                                                />
                                            </View>
                                            <YStack width={'80%'} alignSelf='center'>
                                                <UText variant='heading-h2' numberOfLines={2} mt={10}>
                                                    {item?.title}
                                                </UText>
                                                <UText variant='text-md' numberOfLines={1} mt={7} color={'$neutral8'} width={'100%'}>
                                                    {item?.author}
                                                </UText>
                                            </YStack>
                                        </Card>
                                    }

                                />
                            </>
                        }

                        <YStack>

                            <UText variant='heading-h1' mt={25} mb={15}>
                                Reviews
                            </UText>

                            <XStack alignItems="center" width={'100%'} jc={'space-between'}>
                                <YStack width={'65%'} gap={12}>

                                    {Object.entries(ratingStats.breakdown).map(([star, count]) => (
                                        <XStack key={star} alignItems="center" gap={5}>
                                            <UText variant='text-sm' width={15}>{star}</UText>
                                            <Progress value={count * 20} backgroundColor="$neutral1" height={6} flex={1}>
                                                <Progress.Indicator backgroundColor="$notice5" />
                                            </Progress>
                                        </XStack>
                                    ))}
                                </YStack>
                                <YStack jc={'space-between'}>
                                    <YStack>
                                        <XStack ai={'center'}>
                                            <UText variant='heading-h1-bold'>
                                                {ratingStats.average.toFixed(1)}
                                            </UText>
                                            <IconStar />
                                        </XStack>

                                        <UText variant='text-sm' color="$color10">{ratingStats.total} ratings</UText>
                                    </YStack>

                                    <YStack mt={25}>
                                        <UText variant='heading-h1-bold'>
                                            {ratingStats.recommended}%
                                        </UText>
                                        <UText variant='text-sm' color="$color10">Recommended</UText>
                                    </YStack>
                                </YStack>


                            </XStack>

                            {
                                (book.isFree || !book.isFree && book.hasAccess) &&

                                <UTextButton variant='primary-md' mt={30} mb={20} onPress={() => functions.setModalVisible(true)}>
                                    Write a Review

                                </UTextButton>

                            }


                            <YStack space="$4">
                                {
                                    ratingStats?.userReviews?.length > 0 ?

                                        ratingStats?.userReviews.map((review) => (
                                            <XStack key={review.id} space="$3">
                                                <UImage
                                                    imageSource={review.avatar}          // avatar URL from backend
                                                    fallBackText={review.username}       // fallback text if avatar is missing
                                                    style={{ width: 45, height: 45, borderRadius: 999 }}
                                                />

                                                <YStack flex={1}>
                                                    <XStack justifyContent="space-between" alignItems="center">
                                                        <UText variant='heading-h2-bold'>{review.username}</UText>
                                                        <UText variant='text-xs' color="$color9">{formatDate(review?.submittedAt)}</UText>
                                                    </XStack>
                                                    <Rating
                                                        type="custom"
                                                        imageSize={18}
                                                        readonly
                                                        startingValue={review.rating}
                                                        ratingColor="#d4af37"
                                                        // tintColor="#fff9ee"     
                                                        ratingBackgroundColor="#e5e5e5"
                                                        style={{ alignSelf: 'flex-start', marginVertical: 5 }}
                                                    />

                                                    <UText variant='text-xs' color="$color10">{review.comment}</UText>
                                                </YStack>
                                            </XStack>
                                        )) :
                                        <UText numberOfLines={1} variant="heading-h1" alignSelf='center' marginVertical={15}>No reviews yet</UText>

                                }

                            </YStack>
                        </YStack>


                    </YStack>

                    <RatingModal
                        visible={modalVisible}
                        onClose={() => functions.setModalVisible(false)}
                        onSubmit={functions.handleSubmit}
                        allowRating={true}  // can be false if only review is needed
                        allowReview={true}  // can be false if only rating is needed
                    />

                    <PaymentModal
                        visible={states.paymentModal}
                        onClose={() => functions.setPaymentModal(false)}
                        onPay={functions.confirmBookPayment}
                    />


                </ScrollView >
            </YStack >


        </>
    );


}

export default BookDetail;