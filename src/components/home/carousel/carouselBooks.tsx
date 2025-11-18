import React from 'react';
import { Image, FlatList, ImageSourcePropType } from 'react-native';
import { YStack } from 'tamagui';
import UText from '../../core/text/uText';
import { FlashList } from '@shopify/flash-list';

interface CarouselBooksProps {
  data: {
    id: number;
    cover: ImageSourcePropType;
    title: string;
  }[];
  onPressItem: (id: number) => void;
}

const CarouselBooks: React.FC<CarouselBooksProps> = ({ data, onPressItem }) => {
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
        >

          <Image source={item.cover} style={{ width: 100, height: 90, borderRadius: 15 }} />


          <UText numberOfLines={2} variant="text-sm" textAlign='center' width={'90%'} mt={4}>
            {item.title}
          </UText>
        </YStack>
      )}
    />
  );
};

export default CarouselBooks;
