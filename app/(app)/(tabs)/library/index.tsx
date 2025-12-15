import IconLock from '@/assets/icons/iconLock';
import assets from '@/assets/images';
import UTextButton from '@/src/components/core/buttons/uTextButton';
import UDropdown from '@/src/components/core/dropdowns/uDropdown';
import UHeaderWithBackground from '@/src/components/core/layout/uHeaderWithBackground';
import UText from '@/src/components/core/text/uText';
import useLibraryController from '@/src/controllers/useLibraryController';
import type { LibraryBook } from '@/src/types/library/libraryTypes';
import { FlashList } from '@shopify/flash-list';
import type { Href } from 'expo-router';
import { useCallback } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';

const LibraryScreen = () => {

  const {
    router, currentData, categoryOptions, sortOptions, activeTab, setActiveTab,
    selectedValue, setSelectedValue, selectedSortValue, setSelectedSortValue, numColumns } = useLibraryController();

  const renderBookItem = useCallback(({ item }: { item: LibraryBook }) => {
    return (
      <YStack
        flex={1 / numColumns}
        marginTop={15}
        marginHorizontal={8}
        paddingTop={4}
        paddingBottom={10}
        marginBottom={2}
        onPress={() =>
          router.push({
            pathname: '/(app)/bookDetail/[id]',
            params: { id: item.id },
          } as unknown as Href)
        }
        pressStyle={{ opacity: 0.85 }}
        backgroundColor={'$white'}
        borderRadius={15}
        ai={'center'}
        borderWidth={1}
        shadowColor={'#cfcfcfff'}
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.08}
        shadowRadius={6}
        elevation={4}
        borderColor={'#efefefff'}>

        <View style={{ width: '98%', height: 120, overflow: 'hidden', borderRadius: 15 }}>
          <Image
            source={{ uri: item.thumbnail }}
            style={{
              width: '98%',
              height: 'auto',
              aspectRatio: 0.5,
              alignSelf: 'center',
              resizeMode: 'cover',
              top: 0,
              position: 'absolute',
            }}
          />

          {(!item.isFree && !item.hasAccess) && (
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: 'rgba(0, 0, 0, 0.35)',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row'
              }}
            >
              <IconLock />
              <UText variant='heading-h2' color={'$white'}>Unlock</UText>

            </View>
          )}
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
    );
  }, [numColumns, router]);


  return (

    <YStack flex={1}
      backgroundColor={'$white'}>

      <FlashList<LibraryBook>
        data={currentData}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        numColumns={numColumns}
        contentContainerStyle={{
          paddingHorizontal: 0,

        }}
        style={{
          paddingBottom: 10
        }}

        renderItem={renderBookItem}
        ListHeaderComponent={
          <>
            <YStack
              // mb={20} 
              mb={20}
              position="relative">
              <UHeaderWithBackground
                title='Library'
              />
              <YStack
                width="95%"
                alignSelf="center"
                borderRadius={13}
                overflow="visible"
                position="absolute"
                bottom={-35}
                zIndex={999}
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
                      // console.log('Selected item:', e);
                      // setSelectedValue(e?.value?.toString() ?? null);

                      const newType = e?.value?.toString() ?? '';
                      setSelectedValue(newType);
                      setActiveTab(newType);
                    }}
                    style={{ width: '48%' }}

                  />

                  <UDropdown
                    variant="primary"
                    items={sortOptions}
                    value={selectedSortValue}
                    name="state"
                    required
                    label="State"
                    placeholder="Sort by:"
                    onSelectItem={e => {
                      console.log('Selected item:', e);
                      setSelectedSortValue(e?.value?.toString() ?? null);
                      // setSelectedSortValue(e?.value)
                    }}
                    style={{ width: '48%' }}

                  />

                </XStack>

              </YStack>

            </YStack >
            <XStack mt={30} mb={10} px={15} jc={'space-between'} ai={'center'}>
              <UTextButton
                onPress={() => console.log('fsddfs')}
                variant='primary-md'
                // height={40}
                width={'43%'}
              >
                Read Synopsis
              </UTextButton>
              <UTextButton
                onPress={() => console.log('fsddfs')}
                variant='secondary-md'
                // height={40}
                width={'43%'}
                textColor={'$black'}
              >
                Purchase Options
              </UTextButton>
              <Image source={assets.icons.bookmarkFilled} style={{ width: 18, height: 18, marginRight: 10 }} />
            </XStack>
            <UText variant="heading-h2" ml={15} mt={15}>
              Discover More Books
            </UText>
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