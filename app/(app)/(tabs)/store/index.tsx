import { YStack, Text } from 'tamagui';

const StoreScreen = () => {
  return (
    <YStack f={1} ai="center" jc="center" p="$4">
      <Text fontSize="$7" fontWeight="700">Store</Text>
      <Text theme="alt2">Merch & bundles</Text>
    </YStack>
  );
}

export default StoreScreen;