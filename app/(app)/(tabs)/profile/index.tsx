import { YStack, Text } from "tamagui";
import UTextButton from "@/src/components/core/buttons/uTextButton";
import { router } from "expo-router";

const ProfileScreen = () => {
  return (
    <YStack flex={1} ai="center" jc="center" p="$4">
        <Text fontSize="$7" fontWeight="700">Profile</Text>
        <Text theme="alt2">Account & settings</Text>
        <UTextButton mt={20} variant="tertiary-sm" w={100} onPress={() => {
          router.push('/login');
        }}>Sign Out
        </UTextButton>
    </YStack>
  );
}

export default ProfileScreen;