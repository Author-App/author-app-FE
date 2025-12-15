import IconCalender from "@/assets/icons/iconCalender";
import IconFacebookSilver from "@/assets/icons/iconFacebookSilver";
import IconInsta from "@/assets/icons/iconInsta";
import IconSettings from "@/assets/icons/iconSettings";
import iconTwitter from "@/assets/icons/iconTwitter";
import assets from "@/assets/images";
import UIconButton from "@/src/components/core/buttons/uIconButtonVariants";
import UHeaderWithBackground from "@/src/components/core/layout/uHeaderWithBackground";
import UText from "@/src/components/core/text/uText";
import { logOut } from "@/src/redux2/Slice/AuthSlice";
// import { logOut } from "@/src/redux/Slice/AuthSlice";
import type { Href } from "expo-router";
import { router } from "expo-router";
import { Image, View } from "react-native";
import { ScrollView } from "react-native";
import { useDispatch } from "react-redux";
import { XStack, YStack } from "tamagui";

const ProfileScreen = () => {

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logOut());
    router.replace('/(public)/login');
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <YStack flex={1} >
        <YStack mb={20} position="relative">
          <UHeaderWithBackground
            title="Author Profile"
          />
          <YStack
            width="95%"
            alignSelf="center"
            borderRadius={13}
            overflow="hidden"
            top={-20}
            zIndex={999}
            backgroundColor={'$white'}
            px={10}
            py={10}
          >
            <UText variant="heading-h2" color={'$link'} >Stanley Profile</UText>
            <XStack
              jc={'space-between'}
              py={10}
            >
              <View style={{ width: 150, height: 150, overflow: 'hidden', borderRadius: 10 }}>
                <Image
                  source={assets.images.padden}
                  style={{
                    width: 200,
                    height: 'auto',
                    aspectRatio: 1,
                    alignSelf: 'center',
                    resizeMode: 'cover',
                    top: 0,
                    position: 'absolute',
                  }}
                />
              </View>
              <UIconButton
                variant="quaternary-sm"
                icon={IconSettings}
                onPress={() => {
                  router.push('/(app)/settings' as Href)
                }}
                style={{ marginLeft: 'auto' }}
              />

              {/* <XStack mt={20} gap={15} mr={15}>
                <UIconButton
                  variant="tertiary-md"
                  icon={iconTwitter}
                  onPress={() => console.log('Facebook login')}

                />

                <UIconButton
                  variant="tertiary-md"
                  icon={IconInsta}
                  onPress={() => console.log('Google login')}
                />

                <UIconButton
                  variant="tertiary-md"
                  icon={IconFacebookSilver}
                  onPress={() => console.log('Apple login')}
                />
              </XStack> */}
            </XStack>
            <XStack marginVertical={15} gap={15}>
              <UIconButton
                variant="tertiary-md"
                icon={iconTwitter}
                onPress={() => console.log('Facebook login')}

              />

              <UIconButton
                variant="tertiary-md"
                icon={IconInsta}
                onPress={() => console.log('Google login')}
              />

              <UIconButton
                variant="tertiary-md"
                icon={IconFacebookSilver}
                onPress={() => console.log('Apple login')}
              />
            </XStack>

            <UText variant="heading-h2" color={'$black'} mt={10}>About Stanley Padden</UText>
            <UText variant="text-sm" color={'$neutral5'} mt={6} mb={20}>
              Stanley Padden is a passionate storyteller whose work blends insight, imagination, and emotional depth. Known for his thoughtful narratives and compelling characters, he writes with an eye for the details that make everyday life extraordinary.
            </UText>

            <YStack>
              <UText variant="heading-h2" color={'$black'} marginVertical={15}>Writing Process</UText>

              <YStack width="100%">
                <View style={{ height: 1, backgroundColor: '#C0C0C0', width: '100%' }} />
              </YStack>
            </YStack>
            <YStack>
              <UText variant="heading-h2" color={'$black'} marginVertical={15}>Writing Process</UText>

              <YStack width="100%" >
                <View style={{ height: 1, backgroundColor: '#C0C0C0', width: '100%' }} />
              </YStack>
            </YStack>

            <YStack>
              <XStack ai={'center'} marginVertical={15}>
                <IconCalender />
                <YStack>
                  <UText variant="heading-h2" color={'$black'} pl={10}>Upcoming Events</UText>
                  <UText variant="text-xs" color={'$neutral5'} mt={3} pl={12}>10/12/2025</UText>

                </YStack>
              </XStack>
            </YStack>
          </YStack>
        </YStack>
      </YStack>
    </ScrollView>
  );
}

export default ProfileScreen;