import USearchbar from '@/src/components/core/inputs/uSearchbar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { YStack, Text, View, XStack } from 'tamagui';

const LibraryScreen = () => {
  const {top} = useSafeAreaInsets()
  return (
    <View top={top}>
      {/* <XStack> */}
        <USearchbar variant='primary' search='' onSearchChange={(val)=>console.log(val)}/>
      {/* </XStack> */}
      <Text fontSize="$7" fontWeight="700">Library</Text>
      <Text theme="alt2">Books & audiobooks</Text>
    </View>
  );
}

export default LibraryScreen;