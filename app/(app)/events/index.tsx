import { YStack, Text } from 'tamagui';
const EventsScreen = () => {
  return (
    <YStack f={1} ai="center" jc="center" p="$4">
      <Text fontSize="$7" fontWeight="700">Events</Text>
      <Text theme="alt2">Events list</Text>
    </YStack>
  );
}

export default EventsScreen;