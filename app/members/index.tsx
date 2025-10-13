import { YStack, Text } from 'tamagui';

const MembersScreen = () => {
  return (
    <YStack f={1} ai="center" jc="center" p="$4">
      <Text fontSize="$7" fontWeight="700">Members</Text>
      <Text theme="alt2">Members list</Text>
    </YStack>
  );
}

export default MembersScreen;