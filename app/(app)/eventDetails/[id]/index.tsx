import React from "react";
import UHeaderWithBackground from "@/src/components/core/layout/uHeaderWithBackground";
import UText from "@/src/components/core/text/uText";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Alert, Linking, ScrollView, useWindowDimensions, View } from "react-native";
import { useDispatch } from "react-redux";
import { XStack, YStack } from "tamagui";
import IconCalender from "@/assets/icons/iconCalender";
import IconDuration from "@/assets/icons/iconDuration";
import IconLocation from "@/assets/icons/iconLocation";
import UTextButton from "@/src/components/core/buttons/uTextButton";
import { logOut } from "@/src/redux2/Slice/AuthSlice";
import { formatDate, formatTime12h, getJoinStatus } from "@/src/utils/helper";
import { useGetEventsDetailQuery } from "@/src/redux2/Apis/Explore";

const EventDetailScreen = () => {

  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();

  const router = useRouter();
  const dispatch = useDispatch();

  console.log("THIS IS ID", id);


  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetEventsDetailQuery(id!, {
    skip: !id,
  });

  console.log("EVENT", data);

  const event = data?.data;

  const joinStatus =
    event?.eventType === "online"
      ? getJoinStatus(event.eventDate, event.eventTime)
      : null;



  if (isLoading) {
    return (
      <YStack flex={1} jc="center" ai="center">
        <ActivityIndicator size="large" />
      </YStack>
    );
  }

  if (isError || !event) {
    return (
      <YStack f={1} ai="center" jc="center">
        <UText variant="heading-h1">Event Not Found</UText>
      </YStack>
    );
  }

  const handleLogout = () => {
    dispatch(logOut());
    router.replace("/(public)/login");
  };

  const openMap = async (url?: string) => {
    if (!url) {
      Alert.alert('Error', 'Map location not available');
      return;
    }

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Unable to open map link');
    }
  };


  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F9F9F9" }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
    >
      <YStack>
        <UHeaderWithBackground bgImage={{ uri: event.thumbnail }} showBackButton={true} />

        <YStack
          mt={-40}
          mx={20}
          p={20}
          bg="$white"
          borderRadius={18}
          shadowColor="#000"
          shadowOffset={{ width: 0, height: 3 }}
          shadowOpacity={0.08}
          shadowRadius={8}
          elevation={3}
        >
          <UText
            variant="heading-h1"
            mb={6}
            color="$black"
            style={{ fontSize: 22, fontWeight: "700" }}
          >
            {event.title}
          </UText>

          <XStack ai="center" mt={6}>
            <IconCalender />
            <UText variant="text-sm" ml={6} color="$neutral6">
              {formatDate(event.eventDate)}
            </UText>
          </XStack>

          <XStack ai="center" mt={10}>
            <IconDuration />
            <UText variant="text-sm" ml={6} color="$neutral6">
              {formatTime12h(event.eventTime)}
            </UText>
          </XStack>

          <YStack mt={14}>
            <UText
              variant="text-sm"
              style={{
                fontWeight: "500",
                color: event.eventType === "offline" ? "#007B83" : "#007AFF",
                backgroundColor:
                  event.eventType === "offline" ? "#E6F6F7" : "#EAF2FF",
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 10,
                textTransform: 'capitalize',
                width: '25%',
                textAlign: 'center'
              }}
            >
              {event.eventType}
            </UText>
          </YStack>

          <View
            style={{
              height: 1,
              backgroundColor: "#EAEAEA",
              marginVertical: 16,
            }}
          />

          <UText
            variant="heading-h2-bold"
            mb={10}
            style={{ fontSize: 18, fontWeight: "600", color: "#111" }}
          >
            About this Event
          </UText>

          <UText
            variant="text-md"
            color="$neutral7"
            style={{ lineHeight: 24, fontSize: 15 }}
          >
            {event.description}
          </UText>

          {event?.eventType === "offline" && (
            <XStack ai="center" mt={24}>
              <IconLocation />
              <UText numberOfLines={2} variant="text-sm" ml={8} color="$neutral7">
                {event.location}
              </UText>
            </XStack>
          )}

          {event.eventType === "offline" ? (
            <UTextButton
              onPress={() => openMap(event.locationGoogleMapLink)}
              variant="primary-md"
              mt={28}
              width="100%"
            >
              📍 Open in Maps
            </UTextButton>
          ) : (
            <UTextButton
              disabled={joinStatus !== "live"}
              // variant={joinStatus === "live" ? "primary-md" : "secondary-md"}
              variant="primary-md"
              mt={28}
              width="100%"
              onPress={() => Linking.openURL(event.googleMeetLink)}
            >
              💻
              {joinStatus === "upcoming" && " Join available 10 mins before"}
              {joinStatus === "live" && " Join Meeting"}
              {joinStatus === "ended" && " Event has ended"}
            </UTextButton>
          )}
        </YStack>
      </YStack>
    </ScrollView>
  );
};

export default EventDetailScreen;