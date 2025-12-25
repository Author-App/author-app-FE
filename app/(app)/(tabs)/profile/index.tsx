import IconFacebookSilver from "@/assets/icons/iconFacebookSilver";
import IconInsta from "@/assets/icons/iconInsta";
import IconLinkedin from "@/assets/icons/iconLinkedin";
import assets from "@/assets/images";
import UIconButton from "@/src/components/core/buttons/uIconButtonVariants";
import UHeaderWithBackground from "@/src/components/core/layout/uHeaderWithBackground";
import UText from "@/src/components/core/text/uText";
import { Alert, Image, Linking, View } from "react-native";
import { ScrollView } from "react-native";
import { XStack, YStack } from "tamagui";

const ProfileScreen = () => {


  const openLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open this link');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const linkedInUrl = 'https://www.linkedin.com/company/stanley-paden-author/';
  const instagramUrl = 'https://www.instagram.com/stanleypadenofficial/';
  const facebookUrl = 'https://www.facebook.com/StanleyPadenOfficial/';

  const writingProcessPoints = [
    "Begins with inspiration from life experiences and travels",
    "Focuses on authentic world-building and emotional depth of characters",
    "Structured writing sessions: drafting, research, and editing",
    "Revises multiple times to ensure clarity, rhythm, and narrative flow",
    "Draws ideas from everyday life, interactions, and global experiences",
  ];


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
            <UText variant="heading-h2" color={'$link'}>Stanley Paden</UText>
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

            </XStack>
            <XStack marginVertical={15} gap={15}>
              <UIconButton
                variant="tertiary-md"
                icon={IconLinkedin}
                onPress={() => openLink(linkedInUrl)}
                dimen={20}

              />

              <UIconButton
                variant="tertiary-md"
                icon={IconInsta}
                onPress={() => openLink(instagramUrl)}
              />

              <UIconButton
                variant="tertiary-md"
                icon={IconFacebookSilver}
                onPress={() => openLink(facebookUrl)}

              />
            </XStack>

            <UText variant="heading-h2" color={'$black'} mt={10}>About Stanley Padden</UText>
            <UText variant="text-sm" color={'$neutral5'} mt={6} mb={20}>
              From the diverse terrains of Needham, Massachusetts, to the bustling streets of New York City and the tranquil farms of the Midwest, Stanley Paden’s life has been a journey of extensive learning and observation. A dedicated educator who has taught English in the Czech Republic and China, Stanley’s love for languages extends to conversational fluency in Spanish and Czech, alongside a basic knowledge of several others. This global immersion, coupled with his understanding of farm life and a keen interest in organic farming, provides a rich foundation for his literary work.
            </UText>

            <YStack>
              <UText variant="heading-h2" color={'$black'} marginVertical={15}>Writing Process</UText>

              <View
                style={{
                  height: 1,
                  backgroundColor: "#C0C0C0",
                  width: "100%",
                  marginBottom: 10,
                }}
              />
              <UText variant="text-sm" color={"$neutral5"} mb={10}>
                Stanley Paden approaches writing with a meticulous blend of
                research, imagination, and observation. Every story begins with
                a spark of inspiration drawn from his experiences, travels, and
                interactions with people across cultures. His writing process
                can be summarized as:
              </UText>

              {writingProcessPoints.map((point, index) => (
                <XStack key={index} mt={5}>
                  <UText color="$link" mr={5}>
                    •
                  </UText>
                  <UText color="$neutral5" variant="text-sm">
                    {point}
                  </UText>
                </XStack>
              ))}

              {/* <YStack width="100%">
                <View style={{ height: 1, backgroundColor: '#C0C0C0', width: '100%' }} />
              </YStack> */}
            </YStack>
            {/* <YStack>
              <UText variant="heading-h2" color={'$black'} marginVertical={15}>Writing Process</UText>

              <YStack width="100%" >
                <View style={{ height: 1, backgroundColor: '#C0C0C0', width: '100%' }} />
              </YStack>
            </YStack> */}

            {/* <YStack>
              <XStack ai={'center'} marginVertical={15}>
                <IconCalender />
                <YStack>
                  <UText variant="heading-h2" color={'$black'} pl={10}>Upcoming Events</UText>
                  <UText variant="text-xs" color={'$neutral5'} mt={3} pl={12}>10/12/2025</UText>

                </YStack>
              </XStack>
            </YStack> */}
          </YStack>
        </YStack>
      </YStack>
    </ScrollView>
  );
}

export default ProfileScreen;