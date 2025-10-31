import assets from '@/assets/images';
import UTextButton from '@/src/components/core/buttons/uTextButton';
import UDropdown from '@/src/components/core/dropdowns/uDropdown';
import UHeaderWithBackground from '@/src/components/core/layout/uHeaderWithBackground';
import UText from '@/src/components/core/text/uText';
import { audiobooksData, booksData } from '@/src/data/libraryData';
import { FlashList } from '@shopify/flash-list';
import { useState } from 'react';
import { Image, View } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';

const LibraryScreen = () => {

  const [activeTab, setActiveTab] = useState<'Books' | 'Audiobooks'>('Books');
  const [search, setSearch] = useState('');
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const currentData = activeTab === 'Books' ? booksData : audiobooksData;
  const categoryOptions = [
    { label: 'Books', value: 'books' },
    { label: 'Audio Books', value: 'audioBooks' },
  ];

  const libraryData = [
    {
      id: 1,
      cover: assets.images.articleImage1,
      title: 'The Desert Kings Heir',
      author: 'Stanley Padden',
    },
    {
      id: 2,
      cover: assets.images.articleImage2,
      title: 'Crusaders Oath',
      author: 'Stanley Padden',
    },
    {
      id: 3,
      cover: assets.images.articleImage3,
      title: 'Whispers Great Wall',
      author: 'Stanley Padden',
    },
    {
      id: 4,
      cover: assets.images.articleImage4,
      title: 'Kens Oath',
      author: 'Stanley Padden',
    },
    {
      id: 5,
      cover: assets.images.articleImage5,
      title: 'Beent Sun',
      author: 'Stanley Padden',
    },
  ]


  return (

    <YStack flex={1} backgroundColor={'#FFFFFF'}>

      <FlashList
        data={libraryData}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        numColumns={3}
        renderItem={({ item }) => {
          return (
            <YStack
              width={'90%'}
              marginTop={15}
              marginHorizontal={5}
              paddingTop={4}
              paddingBottom={10}
              onPress={() => console.log("fsdfsfds")}
              pressStyle={{ opacity: 0.85 }}
              backgroundColor={'#ffffffff'}
              borderRadius={15}
              ai={'center'}
              borderWidth={1}
              shadowColor={'#cfcfcfff'}       
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.08}
              shadowRadius={6}
              elevation={4}               
              borderColor={'#efefefff'}

            >

              <View style={{ width: '95%', height: 120, overflow: 'hidden', borderRadius: 15 }}>
                <Image
                  source={item.cover}
                  style={{
                    width: '95%',
                    height: 'auto',
                    aspectRatio: 0.5,
                    alignSelf: 'center',
                    resizeMode: 'cover',
                    top: 0,
                    position: 'absolute',
                  }}
                />
              </View>

              <UText numberOfLines={1} variant="text-sm" textAlign='center' width={'90%'} mt={4}>
                {item.title}
              </UText>

              <XStack>
                <UText numberOfLines={1} variant="text-xs" textAlign='center' width={'90%'} mt={4} color={'$neutral6'}>
                  {item.author}
                </UText>
                <Image source={assets.icons.bookmarkFilled} style={{ width: 12, height: 12, alignSelf: 'flex-end', marginRight: 5 }} />
              </XStack>


            </YStack>
          )
        }

        }
        ListHeaderComponent={
          <>
            <YStack mb={20} position="relative">
              <UHeaderWithBackground
                title='Library'
              />
              <YStack
                width="95%"
                alignSelf="center"
                borderRadius={13}
                overflow="hidden"
                position="absolute"
                bottom={-35}
                zIndex={999}
                backgroundColor={'$white'}
              >
                <XStack jc={'space-between'} width={'100%'}>
                  <UDropdown
                    variant="primary"
                    items={categoryOptions}
                    value={selectedValue}
                    name="state"
                    required
                    label="State"
                    placeholder="All Categories"
                    onSelectItem={e => {
                      console.log('Selected item:', e);
                      setSelectedValue(e?.value)
                      // setFieldValue('state', e?.value);

                    }}
                    style={{ width: '48%' }}

                  />

                  <XStack ai={'center'} jc={'space-between'} width={'48%'} >
                    <UText variant='text-sm' color={'$neutral6'}>Sort by: Newest</UText>
                    <Image source={assets.icons.bookmark} style={{ width: 15, height: 15, marginRight: 10 }} />
                  </XStack>
                </XStack>

              </YStack>

            </YStack >
            <XStack mt={30} mb={10} px={15} jc={'space-between'} ai={'center'}>
              <UTextButton
                onPress={() => console.log('fsddfs')}
                variant='primary-md'
                height={40}
                width={'43%'}
              >
                Read Synopsis
              </UTextButton>
              <UTextButton
                onPress={() => console.log('fsddfs')}
                variant='secondary-md'
                height={40}
                width={'43%'}
                textColor={'$black'}
              >
                Purchase Options
              </UTextButton>
              <Image source={assets.icons.bookmarkFilled} style={{ width: 18, height: 18, marginRight: 10 }} />
            </XStack>
          </>
        }

        ListEmptyComponent={
          < YStack ai="center" mt="$8" >
            <Text color="$gray10" fontSize={16}>
              No results found.
            </Text>
          </YStack >
        }

      />

    </YStack >
  );
}

export default LibraryScreen;