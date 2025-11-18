import React from 'react';
import { FlatList, Image, ImageSourcePropType, TouchableOpacity, View } from 'react-native';
import { YStack } from 'tamagui';
import UText from '../../core/text/uText';
import { FlashList } from '@shopify/flash-list';

interface CarouselArticlesProps {
  data: {
    id: number;
    cover: ImageSourcePropType;
    title: string;
  }[];
  onPressItem: (id: number) => void;
}

const CarouselArticles: React.FC<CarouselArticlesProps> = ({ data, onPressItem }) => {
  return (
    <FlashList
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
              <YStack mx={8}>
                <TouchableOpacity onPress={onPressItem} style={{ width: 100, height: 100, overflow: 'hidden', borderRadius: 50 }}>
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
                </TouchableOpacity>

                <UText numberOfLines={2} variant="text-sm" textAlign='center' width={'90%'} mt={4}>
                  {item.title}
                </UText>
              </YStack>
        )}
      />
  );
};

export default CarouselArticles;
