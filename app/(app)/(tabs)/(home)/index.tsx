import { YStack, Text } from 'tamagui';

const HomeScreen = () => {
  return (
    <YStack f={1} ai="center" jc="center" p="$4">
      <Text fontSize="$7" fontWeight="700">Home</Text>
      <Text theme="alt2">Featured & updates</Text>
    </YStack>
  );
}

export default HomeScreen;