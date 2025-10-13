import { YStack, Text } from 'tamagui';

const LibraryScreen = () => {
  return (
    <YStack f={1} ai="center" jc="center" p="$4">
      <Text fontSize="$7" fontWeight="700">Library</Text>
      <Text theme="alt2">Books & audiobooks</Text>
    </YStack>
  );
}

export default LibraryScreen;