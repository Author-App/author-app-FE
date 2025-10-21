import React from 'react'
import { YStack, Text, Image } from 'tamagui'
import { TouchableOpacity } from 'react-native'

interface BookCardProps {
  id: string | number
  title: string
  author: string
  image?: string
  onPress: (id: string | number) => void
}

const BookCard: React.FC<BookCardProps> = ({
  id,
  title,
  author,
  image = 'https://via.placeholder.com/150x225',
  onPress,
}) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => onPress(id)}>
      <YStack width={120} space="$1">
        <Image
          source={{ uri: image }}
          width={120}
          height={180}
          borderRadius="$3"
        />
        <Text numberOfLines={1} fontWeight="600">
          {title}
        </Text>
        <Text numberOfLines={1} fontSize="$2" color="$gray10">
          {author}
        </Text>
      </YStack>
    </TouchableOpacity>
  )
}

export default BookCard
