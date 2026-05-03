import { useLocalSearchParams } from 'expo-router';
import { CheckoutScreen } from '@/src/checkout';

export default function CheckoutRoute() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  return <CheckoutScreen bookId={bookId} />;
}
