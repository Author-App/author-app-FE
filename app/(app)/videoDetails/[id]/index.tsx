import IconBack from '@/assets/icons/iconBack';
import UIconButton from '@/src/components/core/buttons/uIconButtonVariants';
import UHeader from '@/src/components/core/layout/uHeader';
import UText from '@/src/components/core/text/uText';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView } from 'react-native';
import { useGetMediaDetailQuery, useGetMediaQuery } from '@/src/redux2/Apis/Explore';
import { formatDuration } from '@/src/utils/helper';
import { YStack, XStack, Card, Separator, Image } from 'tamagui';
import { Video, ResizeMode } from 'expo-av';

const VideoDetail = () => {

    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const { data, isLoading, isError } = useGetMediaDetailQuery(id!, {
        skip: !id,
    });

    const { data: mediaList } = useGetMediaQuery({
        mediaType: 'video',
    });

    const video = data?.data;

    const relatedVideos =
        mediaList?.data?.media?.filter((p) => p.id !== id) || [];

    console.log("THIS IS Media Id", mediaList?.data?.media[0]?.id, typeof mediaList?.data?.media[0]?.id);

    console.log("THIS IS ID", id, typeof id);

    if (isLoading) {
        return (
            <YStack flex={1} jc="center" ai="center">
                <ActivityIndicator size="large" />
            </YStack>
        );
    }

    if (isError || !video) {
        return (
            <YStack f={1} ai="center" jc="center">
                <UText variant="heading-h1">Video Not Found</UText>
            </YStack>
        );
    }

    return (
        <YStack flex={1} backgroundColor="$color.bg">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 60 }}
            >

                <UHeader
                    title="Video Details"
                    leftControl={
                        <UIconButton
                            icon={IconBack}
                            variant="quinary-md"
                            onPress={() => router.back()}
                        />
                    }
                />

                <Card elevation="$3" borderRadius={0} overflow="hidden">
                    <Video
                        source={{ uri: video.fileUrl }}
                        style={{ width: '100%', height: 230 }}
                        useNativeControls
                        resizeMode={ResizeMode.COVER}
                        shouldPlay={false}
                    />
                </Card>

                <YStack p="$4" gap="$3">
                    <UText variant="heading-h1" fontWeight="700" color="$color.text">
                        {video.name}
                    </UText>

                    <XStack ai="center" gap="$2">
                        <UText color="$neutral5">
                            Duration:
                        </UText>
                        <UText color="$neutral5">{Math.floor(video.durationSec / 60)} mins</UText>
                    </XStack>

                    <Separator borderColor="$color.border" my="$2" />

                    <UText variant="text-md" lineHeight={22}>
                        {video.description}
                    </UText>
                </YStack>

                <YStack p="$4" gap="$3">
                    {
                        relatedVideos?.length > 0 ?
                            <UText my={20} variant="heading-h2">
                                Related Videos
                            </UText> :
                            <UText my={20} variant="heading-h2">
                                No Related Videos
                            </UText>
                    }
                   

                    {relatedVideos
                        .filter((v) => v.id !== Number(id))
                        .map((v) => (
                            <XStack
                                key={v.id}
                                gap="$3"
                                ai="center"
                                onPress={() =>
                                    router.push({
                                        pathname: '/(app)/videoDetails/[id]',
                                        params: { id: v.id },
                                    })
                                }
                            >
        
                                <Card w={100} h={60} br="$4" overflow="hidden">
                                    <Image source={{ uri: v.thumbnail }} width="100%" height="100%" />
                                </Card>


                                <YStack flex={1}>
                                    <UText numberOfLines={1} fontWeight="600">
                                        {v.name}
                                    </UText>
                                    <UText variant='text-md'>
                                        {formatDuration(v.durationSec)}
                                    </UText>
                                </YStack>
                            </XStack>
                        ))}
                </YStack>
            </ScrollView>
        </YStack>
    );
};

export default VideoDetail;
