import { ActivityIndicator } from "react-native";
import { useEffect, useState, useRef } from "react";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system/legacy";
import { useLocalSearchParams } from "expo-router";
import { YStack, XStack, Image, Button } from "tamagui";
import { getAudioProgress, saveAudioProgress } from "@/src/storage/audioProgress";
import { useGetBookDetailQuery } from "@/src/redux2/Apis/Books";
import UText from "@/src/components/core/text/uText";
import UProgressBar from "@/src/components/core/display/uProgressBar";
import IconRewind from "@/assets/icons/iconRewind";
import UIconButton from '@/src/components/core/buttons/uIconButtonVariants';
import IconForward from "@/assets/icons/iconForward";
import IconPause from "@/assets/icons/iconPause";
import IconPlay2 from "@/assets/icons/iconPlay2";

const SEEK_TIME = 15000; 

const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const AudioBookPlayer = () => {
    const { bookId } = useLocalSearchParams<{ bookId: string }>();

    const { data, isLoading } = useGetBookDetailQuery(bookId!, {
        skip: !bookId,
    });


    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(1);

    const lastSavedPosition = useRef(0);

    const book = data?.data?.book;

    useEffect(() => {
        if (!bookId || !book?.master) return;

        let mounted = true;

        (async () => {
            try {
                const dir = `${FileSystem.documentDirectory}audiobooks/`;
                await FileSystem.makeDirectoryAsync(dir, { intermediates: true });

                const fileUri = `${dir}${bookId}.mp3`;

                const info = await FileSystem.getInfoAsync(fileUri);

                if (!info.exists || (info.size ?? 0) < 1000) {
                    await FileSystem.downloadAsync(book.master, fileUri);
                }

                const progress = await getAudioProgress(bookId);
                lastSavedPosition.current = progress?.position ?? 0;

                const { sound } = await Audio.Sound.createAsync(
                    { uri: fileUri },
                    {
                        shouldPlay: false,
                        positionMillis: lastSavedPosition.current,
                    },
                    onPlaybackStatusUpdate
                );

                if (mounted) setSound(sound);
            } catch (err) {
                console.log("Audio setup error:", err);
            }
        })();

        return () => {
            mounted = false;
            sound?.unloadAsync();
        };
    }, [bookId, book?.master]);


    const onPlaybackStatusUpdate = (status: any) => {
        if (!status.isLoaded) return;

        setPosition(status.positionMillis);
        setDuration(status.durationMillis || 1);

        if (status.positionMillis - lastSavedPosition.current >= 5000) {
            lastSavedPosition.current = status.positionMillis;
            saveAudioProgress(bookId, status.positionMillis);
        }
    };

    const togglePlayPause = async () => {
        if (!sound) return;
        const status = await sound.getStatusAsync();

        if (status.isPlaying) {
            await sound.pauseAsync();
            setIsPlaying(false);
        } else {
            await sound.playAsync();
            setIsPlaying(true);
        }
    };

    const seek = async (amount: number) => {
        if (!sound) return;
        const newPos = Math.max(0, Math.min(position + amount, duration));
        await sound.setPositionAsync(newPos);
    };

    if (isLoading || !book || !sound) {
        return (
            <YStack flex={1} jc="center" ai="center">
                <ActivityIndicator size="large" />
            </YStack>
        );
    }

    const progressPercent = (position / duration) * 100;

    return (
        <YStack flex={1} p="$4" gap="$5">
            <Image
                source={{ uri: book.thumbnail }}
                width="100%"
                height={260}
                borderRadius="$4"
                resizeMode="cover"
            />

            <YStack gap="$1">
                <UText variant="heading-h1">{book.title}</UText>
                <UText variant="text-md" col="$neutral7">{book.author}</UText>
            </YStack>

            <YStack gap="$2">
                <UProgressBar
                    percentage={progressPercent}
                    isAnimate
                    text={`${formatTime(position)} / ${formatTime(duration)}`}
                    foregroundColor="$primary"
                />
            </YStack>

            <XStack jc="center" ai="center" mt={15}>
                <IconRewind dimen={34} onPress={() => seek(-SEEK_TIME)} />
                <UIconButton
                    variant="tertiary-lg"
                    icon={isPlaying ? IconPause : IconPlay2}
                    iconProps={{ dimen: isPlaying ? 35 : 48 }}
                    onPress={togglePlayPause}
                    mx={35}
                />

                <IconForward dimen={34} onPress={() => seek(SEEK_TIME)} />
            </XStack>
        </YStack>
    );
};

export default AudioBookPlayer;
