import { YStack, Text } from 'tamagui';

const NotificationsScreen = () => {
  return (
    <YStack f={1} ai="center" jc="center" p="$4">
      <Text fontSize="$7" fontWeight="700">Notifications</Text>
      <Text theme="alt2">Notifications list</Text>
    </YStack>
  );
}

export default NotificationsScreen;