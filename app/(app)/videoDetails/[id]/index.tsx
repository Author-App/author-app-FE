import IconBack from '@/assets/icons/iconBack';
import UIconButton from '@/src/components/core/buttons/uIconButtonVariants';
import UHeader from '@/src/components/core/layout/uHeader';
import UText from '@/src/components/core/text/uText';
import { exploreData } from '@/src/data/exploreData';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import { YStack, XStack, View, Card, Separator , Image} from 'tamagui';
import { Video, ResizeMode } from 'expo-av';
import { VideoItem } from '@/src/types/content/contentTypes';

const VideoDetail = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const videosSection = exploreData.find((section) => section.subtype === 'videos');
    const allVideos = (videosSection?.data ?? []) as VideoItem[];
    const video = allVideos.find((p) => p.id === Number(id));

    if (!video) {
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
                {/* Header */}
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

                {/* Video Player */}
                <Card elevation="$3" borderRadius={0} overflow="hidden">
                    <Video
                        source={video.video}
                        style={{ width: '100%', height: 230 }}
                        useNativeControls
                        resizeMode={ResizeMode.COVER}
                        shouldPlay={false}
                    />
                </Card>

                <YStack p="$4" gap="$3">
                    <UText variant="heading-h1" fontWeight="700" color="$color.text">
                        {video.title}
                    </UText>

                    <XStack ai="center" gap="$2">
                        <UText color="$neutral5" fontWeight="600">
                            Duration:
                        </UText>
                        <UText color="$neutral5">{video.duration}</UText>
                    </XStack>

                    <Separator borderColor="$color.border" my="$2" />

                    <UText variant="text-md" color="$color.text" lineHeight={22}>
                        {video.description}
                    </UText>
                </YStack>

                <YStack p="$4" gap="$3">
                    <UText variant="heading-h2" fontWeight="700">
                        More Videos
                    </UText>

                    {allVideos
                        .filter((v) => v.id !== Number(id))
                        .map((v) => (
                            <XStack
                                key={v.id}
                                gap="$3"
                                ai="center"
                                onPress={() => router.push(`/videoDetails/${v.id}` as unknown as Href)}
                            >
                                {/* <Card w={100} h={60} br="$4" overflow="hidden">
                  <Card.Image source={v.cover} width="100%" height="100%" />
                </Card> */}

                                <Card w={100} h={60} br="$4" overflow="hidden">
                                    <Image source={v.cover} width="100%" height="100%" />
                                </Card>


                                <YStack flex={1}>
                                    <UText numberOfLines={1} fontWeight="600">
                                        {v.title}
                                    </UText>
                                    <UText color="$neutral5" variant="label-xs">
                                        {v.duration}
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




// import IconArrowDownRight from '@/assets/icons/iconArrowDownRight';
// import IconArrowLeft from '@/assets/icons/iconArrowLeft';
// import IconArrowRight from '@/assets/icons/iconArrowRight';
// import IconBack from '@/assets/icons/iconBack';
// import IconForward from '@/assets/icons/iconForward';
// import IconPlay2 from '@/assets/icons/iconPlay2';
// import IconRewind from '@/assets/icons/iconRewind';
// import UIconButton from '@/src/components/core/buttons/uIconButtonVariants';
// import UProgressBar from '@/src/components/core/display/uProgressBar';
// import UHeader from '@/src/components/core/layout/uHeader';
// import UText from '@/src/components/core/text/uText';
// import { exploreData } from '@/src/data/exploreData';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { Image, ScrollView } from 'react-native';
// import { FlatList } from 'react-native';
// import { View, XStack, YStack, Card } from 'tamagui';
// import { Video } from 'expo-av';

// // import { Video } from 'expo-av';

// // import Video from 'react-native-video';

// const VideoDetail = () => {
//     const { id } = useLocalSearchParams();
//     const router = useRouter();

//     const videosSection = exploreData.find((section) => section.subtype === 'videos');
//     const video = videosSection?.data.find((p) => p.id === Number(id));

//     if (!video) {
//         return (
//             <YStack f={1} ai="center" jc="center">
//                 <UText variant="heading-h1">Podcast Not Found</UText>
//             </YStack>
//         );
//     }

//     console.log("THIS IS VIDEO", video);


//     return (
//         <YStack flex={1}>
//             <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
//                 <UHeader
//                     title="Video Details"
//                     leftControl={
//                         <UIconButton
//                             icon={IconBack}
//                             variant="quinary-md"
//                             onPress={() => router.back()}
//                         />
//                     }
//                 />
//                 <YStack p={20}>

//                     <Video
//                         source={video?.video}
//                         style={{ width: '100%', height: 200 }}
//                         useNativeControls
//                         resizeMode="cover"
//                         shouldPlay={false}
//                     />

//                     <UText numberOfLines={1} variant="heading-h1">
//                         {video?.title}
//                     </UText>

//                     <UText numberOfLines={1} variant="text-md">
//                         {video?.description}
//                     </UText>

//                 </YStack>

//             </ScrollView>
//         </YStack>
//     )
// }

// export default VideoDetail;
