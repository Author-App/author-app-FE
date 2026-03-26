import { useLocalSearchParams } from 'expo-router';
import { EventDetailScreen } from '@/src/eventDetail/components/EventDetailScreen';

const EventScreen = () => {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  return <EventDetailScreen eventId={eventId!} />;
};

export default EventScreen;