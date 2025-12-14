import { FlashList } from '@shopify/flash-list';
import SkeletonCarouselItem from './skeletonCarouselItem';

const SkeletonCarousel = ({ items = 5 }) => (
  <FlashList
    horizontal
    data={Array.from({ length: items })}
    keyExtractor={(_, index) => `skeleton-${index}`}
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ paddingHorizontal: 16 }}
    renderItem={() => <SkeletonCarouselItem />}
  />
);

export default SkeletonCarousel;



// import React from 'react'
// import { FlatList } from 'react-native'
// import { YStack, XStack } from 'tamagui'
// import USkeleton from '../../core/display/uSkeleton'
// // import USkeleton from '@/src/components/core/display/uSkeleton'

// const SkeletonCarousel = () => {
//   const placeholderItems = Array.from({ length: 5 })

//   return (
//     <YStack space="$3">
//       <USkeleton width={120} height={20} radius={4} />

//       <FlatList
//         horizontal
//         data={placeholderItems}
//         keyExtractor={(_, index) => `skeleton-${index}`}
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={{
//           paddingHorizontal: 4,
//         }}
//         renderItem={() => (
//           <XStack mr="$3">
//             <YStack>
//               <USkeleton width={130} height={195} radius={8} />
//               <USkeleton width={100} height={12} mt="$2" radius={4} />
//               <USkeleton width={80} height={10} mt="$1" radius={4} />
//             </YStack>
//           </XStack>
//         )}
//       />
//     </YStack>
//   )
// }

// export default SkeletonCarousel

