import React from 'react'
import { FlatList, Image } from 'react-native'
import { YStack, XStack, Text, View } from 'tamagui'
import UText from '../../core/text/uText'
import { useTheme } from 'tamagui'

interface CarouselSectionProps {
  title: string
  subtype: 'books' | 'audiobooks' | 'articles'
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

  return (
    <YStack
      space="$3"
    // backgroundColor={'red'}
    >
      <UText variant="heading-h2">
        {title}
      </UText>

      <FlatList
        horizontal
        data={data}
        keyExtractor={(item) => String(item.id)}
        showsHorizontalScrollIndicator={false}
        snapToInterval={110 + 12}

        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: 4,
        }}
        renderItem={({ item }) => (
          subtype == 'articles' ?
            <>
              <YStack mx={8}>
                <View style={{ width: 100, height: 100, overflow: 'hidden', borderRadius: 50 }}>
                  <Image
                    source={item.cover}
                    style={{
                      width: 100,
                      height: 'auto',
                      aspectRatio: 0.5,
                      alignSelf: 'center',
                      resizeMode: 'cover',
                      top: 0,
                      position: 'absolute',
                    }}
                  />
                </View>

                <UText numberOfLines={2} variant="text-sm" textAlign='center' width={'90%'} mt={4}>
                  {item.title}
                </UText>
              </YStack>

            </> :
            <YStack
              width={115}
              height={167}
              padding={4}
              mr={10}
              onPress={() => onPressItem(item.id)}
              pressStyle={{ opacity: 0.85 }}
              backgroundColor={'$card'}
              borderRadius={15}
              ai={'center'}

              borderWidth={1}
              borderColor={'rgba(0,0,0,0.04)'}
              shadowColor={'#000'}
              shadowOpacity={0.5}
              shadowRadius={0.1}
              shadowOffset={{ width: 0, height: 0.5 }}
            >

              <Image source={item.cover} style={{ width: 100 , height: 90 , borderRadius: 15}}/>


              <UText numberOfLines={2} variant="text-sm" textAlign='center' width={'90%'} mt={4}>
                {item.title}
              </UText>
            </YStack>
        )}
      />
    </YStack>
  )
}

export default CarouselSection


