import { YStack, Text } from 'tamagui';

const MediaScreen = () => {
  return (
    <YStack f={1} ai="center" jc="center" p="$4">
        <Text fontSize="$7" fontWeight="700">Media</Text>
        <Text theme="alt2">Blogs, podcasts, videos</Text>
    </YStack>
  );
}

export default MediaScreen;