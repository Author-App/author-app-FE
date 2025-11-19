import UHeaderWithBackground from "@/src/components/core/layout/uHeaderWithBackground";
import UText from "@/src/components/core/text/uText";
import { communityData } from "@/src/data/communityData";
// import { logOut } from "@/src/redux/Slice/AuthSlice";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, ScrollView, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useDispatch } from "react-redux";
import { XStack, YStack } from "tamagui";
import { useState } from "react";
import UTextButton from "@/src/components/core/buttons/uTextButton";
import { logOut } from "@/src/redux2/Slice/AuthSlice";

const CommunityDetailScreen = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const [reply, setReply] = useState("");

    const community = communityData.find((item) => item.id === Number(id));

    if (!community) {
        return (
            <YStack f={1} ai="center" jc="center">
                <UText variant="heading-h1">Community Not Found</UText>
            </YStack>
        );
    }

    const handleLogout = () => {
        dispatch(logOut());
        router.replace("/(public)/login");
    };

    const handleSendReply = () => {
        if (!reply.trim()) return;
        console.log("Reply sent:", reply);
        setReply("");
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
                        bgImage={community.cover}
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
                            Discussion Threads ({community.messages.length})
                        </UText>

                        {community.messages.map((item) => (
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
                                    <Image
                                        source={item.avatar}
                                        style={{
                                            width: 45,
                                            height: 45,
                                            borderRadius: 22.5,
                                            marginRight: 10,
                                        }}
                                    />
                                    <YStack>
                                        <UText variant="heading-h2" color="$black">
                                            {item.user}
                                        </UText>
                                        <UText variant="text-xs" color="$neutral5">
                                            {item.time}
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

            {/* Sticky Reply Box */}
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
                        // height={40}
                        width={'20%'}
                        style={{
                            paddingVertical: 10,
                            paddingHorizontal: 16,
                            // backgroundColor: "#000",
                            borderRadius: 10,
                            marginLeft: 10,
                        }}
                    // textColor={'$black'}
                    >
                        Send
                    </UTextButton>

                    {/* <TouchableOpacity
            onPress={handleSendReply}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 16,
              backgroundColor: "#000",
              borderRadius: 10,
              marginLeft: 10,
            }}
          >
            <UText color="#fff">Send</UText>
          </TouchableOpacity> */}
                </XStack>
            </YStack>
        </KeyboardAvoidingView>
    );
};

export default CommunityDetailScreen;


// import UHeaderWithBackground from "@/src/components/core/layout/uHeaderWithBackground";
// import UText from "@/src/components/core/text/uText";
// import { communityData } from "@/src/data/communityData";
// import { logOut } from "@/src/redux/Slice/AuthSlice";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { Image, ScrollView, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
// import { useDispatch } from "react-redux";
// import { XStack, YStack } from "tamagui";
// import { useState } from "react";

// const CommunityDetailScreen = () => {
//     const { id } = useLocalSearchParams();
//     const router = useRouter();
//     const dispatch = useDispatch();
//     const [reply, setReply] = useState("");

//     const community = communityData.find((item) => item.id === Number(id));

//     if (!community) {
//         return (
//             <YStack f={1} ai="center" jc="center">
//                 <UText variant="heading-h1">Community Not Found</UText>
//             </YStack>
//         );
//     }

//     const handleLogout = () => {
//         dispatch(logOut());
//         router.replace("/(public)/login");
//     };

//     const handleSendReply = () => {
//         if (!reply.trim()) return;
//         console.log("Reply sent:", reply);
//         setReply("");
//     };

//     return (
//         <KeyboardAvoidingView
//             style={{ flex: 1, backgroundColor: "#FAFAFA" }}
//             behavior={Platform.OS === "ios" ? "padding" : "height"}
//             keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
//         >
//             <ScrollView
//                 contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }} // add padding to avoid overlap
//                 showsVerticalScrollIndicator={false}
//             >
//                 <YStack>
//                     <UHeaderWithBackground
//                         bgImage={community.cover}
//                         showBackButton={true}
//                     />

//                     <YStack
//                         mt={-30}
//                         mx={20}
//                         p={16}
//                         bg="$white"
//                         borderRadius={14}
//                         shadowColor="#000"
//                         shadowOffset={{ width: 0, height: 2 }}
//                         shadowOpacity={0.1}
//                         shadowRadius={5}
//                         elevation={3}
//                     >
//                         <UText variant="heading-h1" mb={6} color="$black">
//                             {community.title}
//                         </UText>

//                         <UText variant="text-sm" color="$neutral5" mb={14}>
//                             {community.description}
//                         </UText>

//                         <View
//                             style={{
//                                 height: 1,
//                                 backgroundColor: "#EAEAEA",
//                                 marginVertical: 10,
//                             }}
//                         />

//                         <UText variant="heading-h2" color="$black" mb={10}>
//                             Discussion Threads ({community.messages.length})
//                         </UText>

//                         {community.messages.map((item) => (
//                             <YStack
//                                 key={item.id}
//                                 bg="#F9F9F9"
//                                 borderRadius={12}
//                                 p={12}
//                                 mb={12}
//                                 borderWidth={1}
//                                 borderColor="#EEE"
//                             >
//                                 <XStack ai="center" mb={10}>
//                                     <Image
//                                         source={item.avatar}
//                                         style={{
//                                             width: 45,
//                                             height: 45,
//                                             borderRadius: 22.5,
//                                             marginRight: 10,
//                                         }}
//                                     />
//                                     <YStack>
//                                         <UText variant="heading-h2" color="$black">
//                                             {item.user}
//                                         </UText>
//                                         <UText variant="text-xs" color="$neutral5">
//                                             {item.time}
//                                         </UText>
//                                     </YStack>
//                                 </XStack>

//                                 <UText variant="text-md" color="$neutral5" lh={22}>
//                                     {item.message}
//                                 </UText>
//                             </YStack>
//                         ))}
//                     </YStack>
//                 </YStack>
//             </ScrollView>

//             {/* Sticky Reply Box */}
//             <YStack
//                 position="absolute"
//                 bottom={0}
//                 left={0}
//                 right={0}
//                 p={12}
//                 bg="$white"
//                 borderTopWidth={1}
//                 borderColor="#E5E5E5"
//             >
//                 <XStack ai="center">
//                     <TextInput
//                         placeholder="Write a reply..."
//                         value={reply}
//                         onChangeText={setReply}
//                         style={{
//                             flex: 1,
//                             fontSize: 16,
//                             paddingVertical: 10,
//                             paddingHorizontal: 12,
//                             color: "#000",
//                             backgroundColor: "#F5F5F5",
//                             borderRadius: 10,
//                         }}
//                         multiline
//                     />

//                     <TouchableOpacity
//                         onPress={handleSendReply}
//                         style={{
//                             paddingVertical: 10,
//                             paddingHorizontal: 16,
//                             backgroundColor: "#000",
//                             borderRadius: 10,
//                             marginLeft: 10,
//                         }}
//                     >
//                         <UText color="#fff">Send</UText>
//                     </TouchableOpacity>
//                 </XStack>
//             </YStack>
//         </KeyboardAvoidingView>
//     );
// };

// export default CommunityDetailScreen;


// import UHeaderWithBackground from "@/src/components/core/layout/uHeaderWithBackground";
// import UText from "@/src/components/core/text/uText";
// import { communityData } from "@/src/data/communityData";
// import { logOut } from "@/src/redux/Slice/AuthSlice";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { Image, ScrollView, View, TextInput, TouchableOpacity } from "react-native";
// import { useDispatch } from "react-redux";
// import { XStack, YStack } from "tamagui";
// import { useState } from "react";

// const CommunityDetailScreen = () => {
//     const { id } = useLocalSearchParams();
//     const router = useRouter();
//     const dispatch = useDispatch();

//     const [reply, setReply] = useState("");

//     const community = communityData.find((item) => item.id === Number(id));

//     if (!community) {
//         return (
//             <YStack f={1} ai="center" jc="center">
//                 <UText variant="heading-h1">Community Not Found</UText>
//             </YStack>
//         );
//     }

//     const handleLogout = () => {
//         dispatch(logOut());
//         router.replace("/(public)/login");
//     };

//     const handleSendReply = () => {
//         if (!reply.trim()) return;
//         console.log("Reply sent:", reply);
//         setReply("");
//     };

//     return (
//         <ScrollView
//             style={{ flex: 1, backgroundColor: "#FAFAFA" }}
//             contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
//             showsVerticalScrollIndicator={false}
//         >
//             <YStack>
//                 <UHeaderWithBackground
//                     bgImage={community.cover}
//                     showBackButton={true}
//                 />

//                 <YStack
//                     mt={-30}
//                     mx={20}
//                     p={16}
//                     bg="$white"
//                     borderRadius={14}
//                     shadowColor="#000"
//                     shadowOffset={{ width: 0, height: 2 }}
//                     shadowOpacity={0.1}
//                     shadowRadius={5}
//                     elevation={3}
//                 >
//                     <UText variant="heading-h1" mb={6} color="$black">
//                         {community.title}
//                     </UText>

//                     <UText variant="text-sm" color="$neutral5" mb={14}>
//                         {community.description}
//                     </UText>

//                     <View
//                         style={{
//                             height: 1,
//                             backgroundColor: "#EAEAEA",
//                             marginVertical: 10,
//                         }}
//                     />

//                     <UText variant="heading-h2" color="$black" mb={10}>
//                         Discussion Threads ({community.messages.length})
//                     </UText>

//                     {community.messages.map((item) => (
//                         <YStack
//                             key={item.id}
//                             bg="#F9F9F9"
//                             borderRadius={12}
//                             p={12}
//                             mb={12}
//                             borderWidth={1}
//                             borderColor="#EEE"
//                         >
//                             <XStack ai="center" mb={10}>
//                                 <Image
//                                     source={item.avatar}
//                                     style={{
//                                         width: 45,
//                                         height: 45,
//                                         borderRadius: 22.5,
//                                         marginRight: 10,
//                                     }}
//                                 />
//                                 <YStack>
//                                     <UText variant="heading-h2" color="$black">
//                                         {item.user}
//                                     </UText>
//                                     <UText variant="text-xs" color="$neutral5">
//                                         {item.time}
//                                     </UText>
//                                 </YStack>
//                             </XStack>

//                             <UText variant="text-md" color="$neutral5" lh={22}>
//                                 {item.message}
//                             </UText>
//                         </YStack>
//                     ))}

//                     {/* REPLY INPUT BOX */}
//                     <YStack
//                         mt={10}
//                         p={12}
//                         bg="#FFFFFF"
//                         borderRadius={12}
//                         borderWidth={1}
//                         borderColor="#E5E5E5"
//                     >
//                         <XStack ai="center">
//                             <TextInput
//                                 placeholder="Write a reply..."
//                                 value={reply}
//                                 onChangeText={setReply}
//                                 style={{
//                                     flex: 1,
//                                     fontSize: 16,
//                                     paddingVertical: 10,
//                                     color: "#000",
//                                 }}
//                                 multiline
//                             />

//                             <TouchableOpacity
//                                 onPress={handleSendReply}
//                                 style={{
//                                     paddingVertical: 10,
//                                     paddingHorizontal: 16,
//                                     backgroundColor: "#000",
//                                     borderRadius: 10,
//                                 }}
//                             >
//                                 <UText color="#fff">Send</UText>
//                             </TouchableOpacity>
//                         </XStack>
//                     </YStack>

//                 </YStack>
//             </YStack>
//         </ScrollView>
//     );
// };

// export default CommunityDetailScreen;


// // import UHeaderWithBackground from "@/src/components/core/layout/uHeaderWithBackground";
// // import UText from "@/src/components/core/text/uText";
// // import { communityData } from "@/src/data/communityData";
// // import { logOut } from "@/src/redux/Slice/AuthSlice";
// // import { useLocalSearchParams, useRouter } from "expo-router";
// // import { Image, ScrollView, View } from "react-native";
// // import { useDispatch } from "react-redux";
// // import { XStack, YStack } from "tamagui";

// // const CommunityDetailScreen = () => {
// //     const { id } = useLocalSearchParams();
// //     const router = useRouter();
// //     const dispatch = useDispatch();

// //     const community = communityData.find((item) => item.id === Number(id));

// //     if (!community) {
// //         return (
// //             <YStack f={1} ai="center" jc="center">
// //                 <UText variant="heading-h1">Community Not Found</UText>
// //             </YStack>
// //         );
// //     }

// //     const handleLogout = () => {
// //         dispatch(logOut());
// //         router.replace("/(public)/login");
// //     };

// //     return (
// //         <ScrollView
// //             style={{ flex: 1, backgroundColor: "#FAFAFA" }}
// //             contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
// //             showsVerticalScrollIndicator={false}
// //         >
// //             <YStack>
// //                 <UHeaderWithBackground
// //                     bgImage={community.cover}
// //                     showBackButton={true} />

// //                 <YStack
// //                     mt={-30}
// //                     mx={20}
// //                     p={16}
// //                     bg="$white"
// //                     borderRadius={14}
// //                     shadowColor="#000"
// //                     shadowOffset={{ width: 0, height: 2 }}
// //                     shadowOpacity={0.1}
// //                     shadowRadius={5}
// //                     elevation={3}
// //                 >

// //                     <UText variant="heading-h1" mb={6} color="$black">
// //                         {community.title}
// //                     </UText>
// //                     <UText variant="text-sm" color="$neutral5" mb={14}>
// //                         {community.description}
// //                     </UText>

// //                     {/* Divider */}
// //                     <View
// //                         style={{
// //                             height: 1,
// //                             backgroundColor: "#EAEAEA",
// //                             marginVertical: 10,
// //                         }}
// //                     />

// //                     {/* THREAD LIST */}
// //                     <UText variant="heading-h2" color="$black" mb={10}>
// //                         Discussion Threads ({community.messages.length})
// //                     </UText>

// //                     {community.messages.map((item) => (
// //                         <YStack
// //                             key={item.id}
// //                             bg="#F9F9F9"
// //                             borderRadius={12}
// //                             p={12}
// //                             mb={12}
// //                             borderWidth={1}
// //                             borderColor="#EEE"
// //                         >
// //                             <XStack ai="center" mb={10}>
// //                                 <Image
// //                                     source={item.avatar}
// //                                     style={{
// //                                         width: 45,
// //                                         height: 45,
// //                                         borderRadius: 22.5,
// //                                         marginRight: 10,
// //                                     }}
// //                                 />
// //                                 <YStack>
// //                                     <UText variant="heading-h2" color="$black">
// //                                         {item.user}
// //                                     </UText>
// //                                     <UText variant="text-xs" color="$neutral5">
// //                                         {item.time}
// //                                     </UText>
// //                                 </YStack>
// //                             </XStack>

// //                             <UText variant="text-md" color="$neutral5" lh={22}>
// //                                 {item.message}
// //                             </UText>
// //                         </YStack>
// //                     ))}

// //                 </YStack>
// //             </YStack>
// //         </ScrollView>
// //     );
// // };

// // export default CommunityDetailScreen;
