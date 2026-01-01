import UHeaderWithBackground from "@/src/components/core/layout/uHeaderWithBackground";
import UText from "@/src/components/core/text/uText";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, ScrollView, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useDispatch } from "react-redux";
import { XStack, YStack } from "tamagui";
import { useState } from "react";
import UTextButton from "@/src/components/core/buttons/uTextButton";
import { logOut } from "@/src/store/slices/authSlice";
import { useGetCommunitiesDetailQuery, useSendThreadMutation } from "@/src/redux2/Apis/Explore";
import UImage from "@/src/components/core/image/uImage";
import { formatDate } from "@/src/utils/helper";

const CommunityDetailScreen = () => {
    const { communityId } = useLocalSearchParams<{ communityId: string }>();

    const router = useRouter();
    const dispatch = useDispatch();
    const [reply, setReply] = useState("");

    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useGetCommunitiesDetailQuery(communityId!, {
        skip: !communityId,
        refetchOnMountOrArgChange: true,
    });

    const [sendThread, { isLoading: isSending }] = useSendThreadMutation();


    console.log("ARTICLE", data);

    const community = data?.data;

    if (isLoading) {
        return (
            <YStack flex={1} jc="center" ai="center">
                <ActivityIndicator size="large" />
            </YStack>
        );
    }

    if (isError || !community) {
        return (
            <YStack flex={1} backgroundColor="$bg2">
                <UHeaderWithBackground title="Article" showBackButton />
                <YStack flex={1} jc="center" ai="center" px={20}>
                    <UText textAlign="center" color="$red10">
                        Failed to load community.
                    </UText>
                    <UText onPress={refetch} color="$primary" mt={10}>
                        Tap to retry
                    </UText>
                </YStack>
            </YStack>
        );
    }

    const handleSendReply = async () => {
        if (!reply.trim()) return;

        try {
            await sendThread({
                id: communityId,
                body: {
                    message: reply,
                },
            }).unwrap();

            console.log("Reply sent:", reply);
            setReply("");
            refetch();
        } catch (error) {
            console.error("Failed to send reply:", error);
        }
    };


    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "#FAFAFA" }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <YStack>
                    <UHeaderWithBackground
                        bgImage={{ uri: community.thumbnail }}
                        showBackButton={true}
                    />

                    <YStack
                        mt={-30}
                        mx={20}
                        p={16}
                        bg="$white"
                        borderRadius={14}
                        shadowColor="#000"
                        shadowOffset={{ width: 0, height: 2 }}
                        shadowOpacity={0.1}
                        shadowRadius={5}
                        elevation={3}
                    >
                        <UText variant="heading-h1" mb={6} color="$black">
                            {community.title}
                        </UText>

                        <UText variant="text-sm" color="$neutral5" mb={14}>
                            {community.description}
                        </UText>

                        <View
                            style={{
                                height: 1,
                                backgroundColor: "#EAEAEA",
                                marginVertical: 10,
                            }}
                        />

                        <UText variant="heading-h2" color="$black" mb={10}>
                            Discussion Threads ({community.threads.length})
                        </UText>

                        {community.threads.map((item:any) => (
                            <YStack
                                key={item.id}
                                bg="#F9F9F9"
                                borderRadius={12}
                                p={12}
                                mb={12}
                                borderWidth={1}
                                borderColor="#EEE"
                            >
                                <XStack ai="center" mb={10}>
                                    <UImage
                                        // imageSource={review.avatar} 
                                        fallBackText={item.userName}
                                        style={{
                                            width: 45,
                                            height: 45,
                                            borderRadius: 22.5,
                                            marginRight: 10,
                                        }}
                                    />

                                    <YStack>
                                        <UText variant="heading-h2" color="$black">
                                            {item.userName}
                                        </UText>
                                        <UText variant="text-xs" color="$neutral5">
                                            {formatDate(item.createdAt)}
                                        </UText>
                                    </YStack>
                                </XStack>

                                <UText variant="text-md" color="$neutral5" lh={22}>
                                    {item.message}
                                </UText>
                            </YStack>
                        ))}
                    </YStack>
                </YStack>
            </ScrollView>

            {
                community.isJoined &&
                <YStack
                    p={12}
                    bg="$white"
                    borderTopWidth={1}
                    borderColor="#E5E5E5"
                >
                    <XStack ai="center">
                        <TextInput
                            placeholder="Write a reply..."
                            value={reply}
                            onChangeText={setReply}
                            style={{
                                flex: 1,
                                fontSize: 16,
                                paddingVertical: 10,
                                paddingHorizontal: 12,
                                color: "#000",
                                backgroundColor: "#F5F5F5",
                                borderRadius: 10,
                            }}
                            multiline
                        />

                        <UTextButton
                            onPress={handleSendReply}
                            variant='primary-md'
                            width={'20%'}
                            style={{
                                paddingVertical: 10,
                                paddingHorizontal: 16,
                                borderRadius: 10,
                                marginLeft: 10,
                            }}
                            loading={isSending}
                        >
                            Send
                        </UTextButton>
                    </XStack>
                </YStack>
            }

        </KeyboardAvoidingView>
    );
};

export default CommunityDetailScreen;
