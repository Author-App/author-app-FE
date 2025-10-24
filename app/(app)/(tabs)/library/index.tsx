import IconSaveBookMark from '@/assets/icons/iconSaveBookMark';
import UButtonTabs from '@/src/components/core/buttons/uButtonTabs';
import UIconButton from '@/src/components/core/buttons/uIconButtonVariants';
import USearchbar from '@/src/components/core/inputs/uSearchbar';
import AudiobookCard from '@/src/components/library/cards/audiobookCard';
import BookCard from '@/src/components/library/cards/bookCard';
import { booksData } from '@/src/data/libraryData';
import { FlashList } from '@shopify/flash-list';
import { useState } from 'react';
import { YStack, Text } from 'tamagui';

const LibraryScreen = () => {

  const [activeTab, setActiveTab] = useState<'Books' | 'Audiobooks'>('Books');
  const [search, setSearch] = useState('');
  return (

    <YStack
      f={1}
      jc="center"
      p="$4">

      <USearchbar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search your library..."
        variant="primary"
        // height={'50%'}
        flex={0}

      />

      <UButtonTabs
        items={['Books', 'Audiobooks']}
        selectedItem={activeTab}
        onItemSelect={(tab) => setActiveTab(tab)}
        variant="style-1"

        innerContainerProps={{
          h: 35,
          ai: 'center',
          jc: 'space-between',
          // width: 370,
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
          // bg: '$primary1',
          // textColor:'$notice4'
        }}
      />
      <FlashList
        data={booksData}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ flex: 1 }}
        renderItem={({ item }) =>
          <BookCard
            cover={item?.cover}
            title={item?.title}
            author={item?.author}
            summary={item?.summary}
          />}

      // renderItem={({ item }) =>
      //   <AudiobookCard
      //     cover={item?.cover}
      //     title={item?.title}
      //     author={item?.author}
      //     summary={item?.summary}
      //   />}
      />

    </YStack>

  );
}

export default LibraryScreen;