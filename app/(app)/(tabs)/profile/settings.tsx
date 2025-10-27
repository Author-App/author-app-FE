import { YStack, Text } from "tamagui";

const SettingsScreen = () => {

  return (
    <YStack flex={1} ai="center" jc="center" p="$4">
        <Text fontSize="$7" fontWeight="700">Settings</Text>
    </YStack>
  );
}

export default SettingsScreen;