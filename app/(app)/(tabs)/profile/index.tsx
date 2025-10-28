import { YStack, Text, View } from "tamagui";
import UTextButton from "@/src/components/core/buttons/uTextButton";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { logOut } from "@/src/redux/Slice/AuthSlice";
import UImage from "@/src/components/core/image/uImage";
import assets from "@/assets/images";
import UIconButton from "@/src/components/core/buttons/uIconButtonVariants";
import IconSettings from "@/assets/icons/iconSettings";
import UText from "@/src/components/core/text/uText";
import PremiumBadge from "@/src/components/core/badges/premiumBadge";
import { getInitials } from "@/src/utils/helper";

const ProfileScreen = () => {

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logOut());
    router.replace('/(public)/login'); // ensures user can’t go back
  };

  return (
    <YStack
      flex={1}
      ai="center"
      p="$4"
      mt={40}
    >
      <UIconButton
        variant="quaternary-sm"
        icon={IconSettings}
        onPress={() => {
          router.push('/(app)/(tabs)/profile/settings')
        }}
        style={{ marginLeft: 'auto' }}
      />
      <UImage
        imageSource={assets.images.padden}
        fallBackText={getInitials('Stanley Padden')}
        w={150}
        borderRadius={75}
        overflow="hidden"
        mt={30}
      />
      <UText variant="heading-h2" mt={10}>
        Stanley Padden
      </UText>
      <UText variant="text-xs" color="$neutral6" mt={5}>
        stanley@gmail.com
      </UText>

      {/* {user?.isPremium && */}

      <PremiumBadge />
      {/* } */}


    </YStack>
  );
}

export default ProfileScreen;