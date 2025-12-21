import IconPlay2 from '@/assets/icons/iconPlay2';
import IconPause from '@/assets/icons/iconPause';
import IconRewind from '@/assets/icons/iconRewind';
import IconForward from '@/assets/icons/iconForward';
import IconBack from '@/assets/icons/iconBack';
import UIconButton from '@/src/components/core/buttons/uIconButtonVariants';
import UProgressBar from '@/src/components/core/display/uProgressBar';
import UHeader from '@/src/components/core/layout/uHeader';
import UText from '@/src/components/core/text/uText';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Image } from 'react-native';
import { View, XStack, YStack, Card } from 'tamagui';
import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';

import {
  useGetMediaDetailQuery,
  useGetMediaQuery,
} from '@/src/redux2/Apis/Explore';

const PodcastDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, isError } = useGetMediaDetailQuery(id!, {
    skip: !id,
  });

  const { data: mediaList } = useGetMediaQuery({
    mediaType: 'podcast',
  });

  const podcast = data?.data;

  const relatedPodcasts =
    mediaList?.data?.media?.filter((p) => p.id !== id) || [];

  console.log("THIS IS Media Id", mediaList?.data?.media[0]?.id, typeof mediaList?.data?.media[0]?.id);

  console.log("THIS IS ID", id, typeof id);

  /** AUDIO STATE */
  const [player, setPlayer] = useState<Audio.Sound | null>(null);
  const [status, setStatus] = useState({
    isPlaying: false,
    position: 0,
    duration: 1,
  });

  /** LOAD AUDIO */
  useEffect(() => {
    if (!podcast?.fileUrl) return;

    let sound: Audio.Sound;

    const loadAudio = async () => {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        interruptionModeIOS: 1,
      });

      sound = new Audio.Sound();
      sound.setOnPlaybackStatusUpdate((s) => {
        if (s.isLoaded) {
          setStatus({
            isPlaying: s.isPlaying ?? false,
            position: s.positionMillis ?? 0,
            duration: s.durationMillis || 1,
          });
        }
      });

      await sound.loadAsync({ uri: podcast.fileUrl });
      setPlayer(sound);
    };

    loadAudio();

    return () => {
      sound?.unloadAsync();
    };
  }, [podcast?.fileUrl]);

  const handlePlayPause = async () => {
    if (!player) return;
    status.isPlaying ? await player.pauseAsync() : await player.playAsync();
  };

  const handleRewind = async () => {
    if (!player) return;
    await player.setPositionAsync(Math.max(status.position - 10000, 0));
  };

  const handleForward = async () => {
    if (!player) return;
    await player.setPositionAsync(
      Math.min(status.position + 10000, status.duration)
    );
  };

  const progress = (status.position / status.duration) * 100;

  if (isLoading) {
    return (
      <YStack flex={1} jc="center" ai="center">
        <ActivityIndicator size="large" />
      </YStack>
    );
  }

  if (isError || !podcast) {
    return (
      <YStack f={1} ai="center" jc="center">
        <UText variant="heading-h1">Podcast Not Found</UText>
      </YStack>
    );
  }

  console.log('PROGRESS', status.position, status.duration, progress);


  /** HEADER */
  const renderHeader = () => (
    <>
      <YStack backgroundColor="$bg2" pb={20}>
        <UHeader
          title="Podcast"
          leftControl={
            <UIconButton
              icon={IconBack}
              variant="quinary-md"
              onPress={() => router.back()}
            />
          }
        />

        <YStack mx={20} ai="center">
          <UText variant="heading-h1" mt={15} textAlign="center">
            {podcast.name}
          </UText>

          <UText mt={5} color="$neutral8">
            {Math.floor(podcast.durationSec / 60)} mins
          </UText>

          <UProgressBar
            mt={20}
            percentage={Math.min((status.position / status.duration) * 100, 100)}
            // isAnimate={true}            
            foregroundColor="$primary"
            backgroundColor="$primary4"
            width={'95%'}
          />

          {console.log("THIS IS PROGRESS", progress)}

          <XStack jc="center" ai="center" mt={15}>
            <IconRewind dimen={34} onPress={handleRewind} />

            <UIconButton
              variant="tertiary-lg"
              icon={status.isPlaying ? IconPause : IconPlay2}
              iconProps={{ dimen: status.isPlaying ? 35 : 48 }}
              onPress={handlePlayPause}
              mx={35}
            />

            <IconForward dimen={34} onPress={handleForward} />
          </XStack>
        </YStack>
      </YStack>

      {
        relatedPodcasts?.length > 0 ?
          <UText mx={20} my={20} variant="heading-h2">
            Related Podcasts
          </UText> :
          <UText mx={20} my={20} variant="heading-h2">
            No Related Podcasts
          </UText>
      }

    </>
  );

  const renderItem = ({ item }: any) => (
    <Card
      pressStyle={{ opacity: 0.7 }}
      br={10}
      mb={20}
      mx={20}
      onPress={() =>
        router.push({
          pathname: '/(app)/podcastDetail/[id]' as unknown as Href,
          params: { id: item.id },
        } as unknown as Href)
      }
    >
      <YStack p={12}>
        <UText variant="heading-h2-bold" numberOfLines={1}>
          {item.name}
        </UText>
        <UText mt={5} color="$neutral8" numberOfLines={2}>
          {item.description}
        </UText>
      </YStack>
    </Card>
  );

  return (
    <FlatList
      data={relatedPodcasts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={renderHeader}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default PodcastDetail;
