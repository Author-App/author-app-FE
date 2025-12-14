import { YStack } from 'tamagui';
import USkeleton from '../../core/display/uSkeleton';

const SkeletonCarouselItem = () => (
  <YStack width={115} height={167} marginRight={10} borderRadius={15} padding={4}>
    <USkeleton width={100} height={90} radius={10} />
    <USkeleton width={100} height={20} radius={4} mt={8} />
    <USkeleton width={80} height={15} radius={4} mt={4} />
  </YStack>
);

export default SkeletonCarouselItem;
