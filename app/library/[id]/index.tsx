import { YStack, Text } from 'tamagui';
import { useLocalSearchParams } from 'expo-router';

const LibraryScreen = () => {
  const { id } = useLocalSearchParams();
  return (
    <YStack f={1} ai="center" jc="center" p="$4">
      <Text fontSize="$7" fontWeight="700">Library</Text>
      <Text theme="alt2">Library details</Text>
    </YStack>
  );
}

export default LibraryScreen;