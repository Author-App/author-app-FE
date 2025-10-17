import { YStack, Text } from 'tamagui';
import { useLocalSearchParams } from 'expo-router';

const EventScreen = () => {
  const { eventId } = useLocalSearchParams();
  return (
    <YStack f={1} ai="center" jc="center" p="$4">
      <Text fontSize="$7" fontWeight="700">Event {eventId}</Text>
      <Text theme="alt2">Event details</Text>
    </YStack>
  );
}

export default EventScreen;