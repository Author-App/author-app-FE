import { YStack, Text } from 'tamagui';

export default function OnboardingScreen() {
  return (
    <YStack flex={1} ai="center" jc="center" p="$4">
      <Text fontSize="$7" fontWeight="700">Welcome</Text>
      <Text theme="alt2">Let’s get you set up.</Text>
    </YStack>
  );
}
