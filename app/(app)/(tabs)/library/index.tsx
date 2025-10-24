import IconSaveBookMark from '@/assets/icons/iconSaveBookMark';
import UButtonTabs from '@/src/components/core/buttons/uButtonTabs';
import UIconButton from '@/src/components/core/buttons/uIconButtonVariants';
import USearchbar from '@/src/components/core/inputs/uSearchbar';
import AudiobookCard from '@/src/components/library/cards/audiobookCard';
import BookCard from '@/src/components/library/cards/bookCard';
import { audiobooksData, booksData } from '@/src/data/libraryData';
import { FlashList } from '@shopify/flash-list';
import { useMemo, useState } from 'react';
import { YStack, Text, XStack } from 'tamagui';

const LibraryScreen = () => {

  const [activeTab, setActiveTab] = useState<'Books' | 'Audiobooks'>('Books');
  const [search, setSearch] = useState('');

  const currentData = activeTab === 'Books' ? booksData : audiobooksData;

  const filteredData = useMemo(() => {
    if (!search.trim()) return currentData;
    return currentData.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.author.toLowerCase().includes(search.toLowerCase()) ||
      item.summary.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, currentData]);


  return (
    <YStack
      f={1}
      jc="center"
      p="$4">


      <FlashList
        // data={booksData}
        data={filteredData}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) =>
          activeTab === 'Books' ?
            (
              <BookCard
                id={item.id}
                cover={item?.cover}
                title={item?.title}
                author={item?.author}
                summary={item?.summary}
                totalMinutes={item?.totalMinutes}
                minutesCompleted={item?.minutesCompleted}
                percentage={item?.percentage}
              />
            ) :
            <AudiobookCard
              id={item.id}
              cover={item?.cover}
              title={item?.title}
              author={item?.author}
              summary={item?.summary}
              totalMinutes={item?.totalMinutes}
              minutesCompleted={item?.minutesCompleted}
              percentage={item?.percentage}
            />

        }
        ListHeaderComponent={
          <>
            <XStack height={35} width={'100%'}>
              <USearchbar
                search={search}
                onSearchChange={setSearch}
                placeholder="Search your library..."
                variant="primary"
              />
            </XStack>

            <UButtonTabs
              items={['Books', 'Audiobooks']}
              selectedItem={activeTab}
              onItemSelect={(tab) => setActiveTab(tab)}
              variant="style-1"
              innerContainerProps={{
                h: 35,
                ai: 'center',
                jc: 'space-between',
                width: '100%',
                borderRadius: 8,
                marginVertical: 20,
              }}
              tabItemProps={{
                // flex: 1,
                width: '49%',
                height: '100%',
                jc: 'center',
                pressStyle: { opacity: 0.7 },
              }}
            />
          </>

        }

        ListEmptyComponent={
          <YStack ai="center" mt="$8">
            <Text color="$gray10" fontSize={16}>
              No results found.
            </Text>
          </YStack>
        }

      />

    </YStack>

  );
}

export default LibraryScreen;