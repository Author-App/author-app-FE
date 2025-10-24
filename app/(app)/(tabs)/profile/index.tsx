import { YStack, Text } from "tamagui";
import UTextButton from "@/src/components/core/buttons/uTextButton";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { logOut } from "@/src/redux/Slice/AuthSlice";

const ProfileScreen = () => {

    const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logOut());
    router.replace('/(public)/login'); // ensures user can’t go back
  };
  return (
    <YStack flex={1} ai="center" jc="center" p="$4">
        <Text fontSize="$7" fontWeight="700">Profile</Text>
        <Text theme="alt2">Account & settings</Text>
        <UTextButton mt={20} variant="tertiary-sm" w={100} onPress={handleLogout}>Sign Out
        </UTextButton>
    </YStack>
  );
}

export default ProfileScreen;