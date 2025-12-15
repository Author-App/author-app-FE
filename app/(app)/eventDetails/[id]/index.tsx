import React from "react";
import UHeaderWithBackground from "@/src/components/core/layout/uHeaderWithBackground";
import UText from "@/src/components/core/text/uText";
import { exploreData } from "@/src/data/exploreData";
// import { logOut } from "@/src/redux/Slice/AuthSlice";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, useWindowDimensions, View } from "react-native";
import { useDispatch } from "react-redux";
import { XStack, YStack } from "tamagui";
import IconCalender from "@/assets/icons/iconCalender";
import IconDuration from "@/assets/icons/iconDuration";
import IconLocation from "@/assets/icons/iconLocation";
import UTextButton from "@/src/components/core/buttons/uTextButton";
import { logOut } from "@/src/redux2/Slice/AuthSlice";
import { useGetArticleDetailQuery } from "@/src/redux2/Apis/Articles";
import { formatDate, formatTime12h } from "@/src/utils/helper";
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
  
    if (isLoading) {
      return (
        <YStack f={1} ai="center" jc="center">
          <UText>Loading event..</UText>
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

  // const { id } = useLocalSearchParams();
  // const router = useRouter();
  // const dispatch = useDispatch();
  // const { width } = useWindowDimensions();

  // const eventsSection = exploreData.find((item) => item.id === "events");
  // const event = eventsSection?.data.find((item) => item.id === Number(id));

  // if (!event) {
  //   return (
  //     <YStack f={1} ai="center" jc="center">
  //       <UText variant="heading-h1">Event Not Found</UText>
  //     </YStack>
  //   );
  // }

  const handleLogout = () => {
    dispatch(logOut());
    router.replace("/(public)/login");
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F9F9F9" }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
    >
      <YStack>
        <UHeaderWithBackground bgImage={{uri : event.thumbnail}} showBackButton={true} />

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
                // alignSelf: "flex-start",
                // justifyContent:'center',
                textTransform:'capitalize',
                width:'25%',
                textAlign:'center'
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

          <UTextButton
            onPress={() =>
              event.eventType === "offline"
                ? console.log("Open in Maps")
                : console.log("Join Meeting")
            }
            variant="primary-md"
            mt={28}
            width="100%"
          >
            {event.eventType === "offline" ? "📍 Open in Maps" : "💻 Join Meeting"}
          </UTextButton>
        </YStack>
      </YStack>
    </ScrollView>
  );
};

export default EventDetailScreen;


// import React from "react";
// import UHeaderWithBackground from "@/src/components/core/layout/uHeaderWithBackground";
// import UText from "@/src/components/core/text/uText";
// import { exploreData } from "@/src/data/exploreData";
// import { logOut } from "@/src/redux/Slice/AuthSlice";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { Image, ScrollView, useWindowDimensions, View } from "react-native";
// import { useDispatch } from "react-redux";
// import { XStack, YStack } from "tamagui";
// import assets from "@/assets/images";
// import IconCalender from "@/assets/icons/iconCalender";
// import IconDuration from "@/assets/icons/iconDuration";
// import IconLocation from "@/assets/icons/iconLocation";
// import UTextButton from "@/src/components/core/buttons/uTextButton";

// const EventDetailScreen = () => {
//     const { id } = useLocalSearchParams();
//     const router = useRouter();
//     const dispatch = useDispatch();
//     const { width } = useWindowDimensions();

//     const eventsSection = exploreData.find((item) => item.id === "events");
//     const event = eventsSection?.data.find((item) => item.id === Number(id));

//     if (!event) {
//         return (
//             <YStack f={1} ai="center" jc="center">
//                 <UText variant="heading-h1">Event Not Found</UText>
//             </YStack>
//         );
//     }

//     const handleLogout = () => {
//         dispatch(logOut());
//         router.replace("/(public)/login");
//     };

//     return (
//         <ScrollView
//             style={{ flex: 1, backgroundColor: "#F9F9F9" }}
//             contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
//             showsVerticalScrollIndicator={false}
//         >
//             <YStack>
//                 {/* 🌄 Header with Background Image */}
//                 <UHeaderWithBackground bgImage={event.cover} showBackButton={true} />

//                 <YStack
//                     mt={-40}
//                     mx={20}
//                     p={20}
//                     bg="$white"
//                     borderRadius={18}
//                     shadowColor="#000"
//                     shadowOffset={{ width: 0, height: 3 }}
//                     shadowOpacity={0.08}
//                     shadowRadius={8}
//                     elevation={3}
//                 >
//                     {/* Event Title */}
//                     <UText
//                         variant="heading-h1"
//                         mb={6}
//                         color="$black"
//                         style={{ fontSize: 22, fontWeight: "700" }}
//                     >
//                         {event.title}
//                     </UText>

        
//                     {/* <XStack jc="space-between" mt={10} mb={16}> */}
//                         <XStack ai="center" mt={5}>
//                             <IconCalender />
//                             <UText variant="text-sm" ml={6} color="$neutral6">
//                                 {event.date}
//                             </UText>
//                         </XStack>

//                         <XStack ai="center" mt={10}>
//                             <IconDuration />
//                             <UText variant="text-sm" ml={6} color="$neutral6">
//                                 {event.time}
//                             </UText>
//                         </XStack>
//                     {/* </XStack> */}

//                     {/* Divider */}
//                     <View
//                         style={{
//                             height: 1,
//                             backgroundColor: "#EAEAEA",
//                             marginVertical: 12,
//                         }}
//                     />

//                     {/* About Section */}
//                     <UText
//                         variant="heading-h2-bold"
//                         mb={10}
//                         style={{ fontSize: 18, fontWeight: "600", color: "#111" }}
//                     >
//                         About this Event
//                     </UText>

//                     <UText
//                         variant="text-md"
//                         color="$neutral7"
//                         style={{ lineHeight: 24, fontSize: 15 }}
//                     >
//                         {event.about}
//                     </UText>

//                     {/* Location */}

//                     {
//                         event?.type == 'Offline' &&

//                         <XStack ai="center" mt={24}>
//                             <IconLocation />
//                             <UText numberOfLines={2} variant="text-sm" ml={8} color="$neutral7">
//                                 {event.location}
//                             </UText>
//                         </XStack>
//                     }

//                     <YStack mt={12}>
//                         <UText
//                             variant="text-sm"
//                             style={{
//                                 fontWeight: "500",
//                                 color: event.eventType === "Offline" ? "#007B83" : "#007AFF",
//                                 backgroundColor:
//                                     event.eventType === "Offline" ? "#E6F6F7" : "#EAF2FF",
//                                 paddingVertical: 6,
//                                 paddingHorizontal: 12,
//                                 borderRadius: 10,
//                                 alignSelf: "flex-start",
//                             }}
//                         >
//                             {event.eventType}
//                         </UText>
//                     </YStack>

//                     <UTextButton
//                         onPress={() =>
//                             event.eventType === "Offline"
//                                 ? console.log("Open in Maps")
//                                 : console.log("Join Meeting")
//                         }
//                         variant="primary-md"
//                         mt={28}
//                         width="100%"
//                     >
//                         {event.eventType === "Offline" ? "📍 Open in Maps" : "💻 Join Meeting"}
//                     </UTextButton>
//                 </YStack>
//             </YStack>
//         </ScrollView>
//     );
// };

// export default EventDetailScreen;


// import React from "react";
// import UHeaderWithBackground from "@/src/components/core/layout/uHeaderWithBackground";
// import UText from "@/src/components/core/text/uText";
// import { exploreData } from "@/src/data/exploreData";
// import { logOut } from "@/src/redux/Slice/AuthSlice";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { Image, ScrollView, useWindowDimensions, View } from "react-native";
// import RenderHTML from "react-native-render-html";
// import { useDispatch } from "react-redux";
// import { XStack, YStack } from "tamagui";
// import assets from "@/assets/images";
// import IconCalender from "@/assets/icons/iconCalender";
// import IconDuration from "@/assets/icons/iconDuration";
// import IconLocation from "@/assets/icons/iconLocation";
// import UTextButton from "@/src/components/core/buttons/uTextButton";

// const EventDetailScreen = () => {
//     const { id } = useLocalSearchParams();
//     const router = useRouter();
//     const dispatch = useDispatch();
//     const { width } = useWindowDimensions();

//     const eventsSection = exploreData.find((item) => item.id === "events");
//     const event = eventsSection?.data.find((item) => item.id === Number(id));

//     if (!event) {
//         return (
//             <YStack f={1} ai="center" jc="center">
//                 <UText variant="heading-h1">Event Not Found</UText>
//             </YStack>
//         );
//     }

//     const handleLogout = () => {
//         dispatch(logOut());
//         router.replace("/(public)/login");
//     };

//     return (
//         <ScrollView
//             style={{ flex: 1, backgroundColor: "#FAFAFA" }}
//             contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}
//             showsVerticalScrollIndicator={false}
//         >
//             <YStack>
//                 {/* 🌄 Header with Background Image */}
//                 <UHeaderWithBackground bgImage={event.cover} showBackButton={true} />

//                 <YStack
//                     mt={-30}
//                     mx={20}
//                     p={20}
//                     bg="$white"
//                     borderRadius={16}
//                     shadowColor="#000"
//                     shadowOffset={{ width: 0, height: 2 }}
//                     shadowOpacity={0.08}
//                     shadowRadius={6}
//                     elevation={3}
//                 >
//                     <UText
//                         variant="heading-h1"
//                         mb={8}
//                     >
//                         {event.title}
//                     </UText>

//                     <XStack jc={'space-between'} mt={8}>
//                         <XStack ai={'center'}>
//                             <IconDuration />
//                             <UText numberOfLines={2} variant="text-sm" ml={4}>
//                                 {event?.date}
//                             </UText>
//                         </XStack>
//                         <XStack ai={'center'}>
//                             <IconLocation />
//                             <UText numberOfLines={2} variant="text-sm" ml={4}>
//                                 {event?.time}
//                             </UText>
//                         </XStack>

//                     </XStack>

//                     <UText
//                         variant="heading-h2-bold"
//                         my={20}
//                     >
//                         About this Event
//                     </UText>

//                     <UText
//                         variant="text-md"
//                     // my={20}
//                     // mb={8}
//                     // color="$black"
//                     >
//                         {event?.about}
//                     </UText>

//                     <XStack ai={'center'} mt={20}>
//                         <IconLocation />
//                         <UText numberOfLines={2} variant="text-sm" ml={4}>
//                             {event?.location}
//                         </UText>
//                     </XStack>

//                     <UTextButton
//                         onPress={() => console.log('fsddfs')}
//                         variant='primary-md'
//                         width={'43%'}
//                         mt={20}
//                     >
//                         {event?.type == 'Offline' ? 'Open in Maps' : 'Join meeting'}
//                     </UTextButton>


//                 </YStack>
//             </YStack>
//         </ScrollView >
//     );
// };

// export default EventDetailScreen;
