import { YStack, Text } from "tamagui";

const ProfileScreen = () => {
  return (
    <YStack f={1} ai="center" jc="center" p="$4">
        <Text fontSize="$7" fontWeight="700">Profile</Text>
        <Text theme="alt2">Account & settings</Text>
    </YStack>
  );
}

export default ProfileScreen;