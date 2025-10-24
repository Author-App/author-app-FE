import React from 'react'
import { YStack, Text, Image, XStack } from 'tamagui'
import { TouchableOpacity } from 'react-native'

interface AudioBookCardProps {
  id: string | number
  title: string
  narrator: string
  duration?: string
  image?: string
  onPress: (id: string | number) => void
}

const AudioBookCard: React.FC<AudioBookCardProps> = ({
  id,
  title,
  narrator,
  duration = '4h 32m',
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
          {narrator}
        </Text>
        <XStack>
          <Text fontSize="$2" color="$gray9">
            {duration}
          </Text>
        </XStack>
      </YStack>
    </TouchableOpacity>
  )
}

export default AudioBookCard
