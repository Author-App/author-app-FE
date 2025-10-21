import React from 'react'
import { FlatList } from 'react-native'
import { YStack, XStack, Image, Text, View } from 'tamagui'
import UText from '../../core/text/uText'
import { useTheme } from 'tamagui'

interface CarouselSectionProps {
  title: string
  subtype: 'books' | 'audiobooks'
  data: {
    id: number
    cover: string
    title: string
    author?: string
    narrator?: string
    duration?: string
  }[]
  onPressItem: (id: number) => void
}

const CarouselSection: React.FC<CarouselSectionProps> = ({
  title,
  subtype,
  data,
  onPressItem,
}) => {
  const theme = useTheme()

  const CARD_WIDTH = 130
  const CARD_HEIGHT = CARD_WIDTH * 1.5 // 2:3 aspect ratio

  return (
    <YStack space="$3">
      <UText variant="heading-h2" >
        {title}
      </UText>

      <FlatList
        horizontal
        data={data}
        keyExtractor={(item) => String(item.id)}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 12}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: 4,
        }}
        renderItem={({ item }) => (
          <YStack
            width={CARD_WIDTH}
            mr="$3"
            onPress={() => onPressItem(item.id)}
            pressStyle={{ opacity: 0.85 }}
          >

            <Image
              source={{ uri: item.cover }}
              width={CARD_WIDTH}
              height={CARD_HEIGHT}
              borderRadius="$4"
              mb="$2"
            />

            <UText numberOfLines={1} variant="text-sm">
              {item.title}
            </UText>

            {subtype === 'books' && (
              <UText numberOfLines={1} color="$neutral4" variant="text-xs">
                by {item.author}
              </UText>
            )}

            {subtype === 'audiobooks' && (
              <>
                <UText numberOfLines={1} color="$neutral4" variant="text-xs">
                  Narrated by {item.narrator}
                </UText>
                <UText numberOfLines={1} color="$gray8" variant="text-2xs" mt="$1">
                  {item.duration}
                </UText>
              </>
            )}
          </YStack>
        )}
      />
    </YStack>
  )
}

export default CarouselSection


// import React from 'react'
// import { YStack, XStack, Text, Button, Image } from 'tamagui'
// import { FlatList, TouchableOpacity } from 'react-native'

// const CarouselSection = ({ title, subtype, onPressItem }) => {
//   const placeholderData = new Array(8).fill(null).map((_, i) => ({ id: i + 1 }))

//   return (
//     <YStack space="$3">
//       <Text fontSize="$6" fontWeight="700">
//         {title}
//       </Text>

//       <FlatList
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         data={placeholderData}
//         keyExtractor={(item) => String(item.id)}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             onPress={() => onPressItem(item.id)}
//             activeOpacity={0.8}
//             style={{ marginRight: 12 }}
//           >
//             <YStack width={120} space="$1">
//               <Image
//                 source={{ uri: 'https://via.placeholder.com/150x225' }}
//                 width={120}
//                 height={180}
//                 borderRadius="$3"
//               />
//               <Text numberOfLines={1} fontWeight="600">
//                 {subtype === 'books' ? 'Book Title' : 'Audiobook Title'}
//               </Text>
//               <Text numberOfLines={1} color="$gray10" fontSize="$2">
//                 {subtype === 'books' ? 'Author Name' : 'Narrator Name'}
//               </Text>
//             </YStack>
//           </TouchableOpacity>
//         )}
//       />
//     </YStack>
//   )
// }

// export default CarouselSection
