import IconArrowRight from '@/assets/icons/iconArrowRight';
import IconCalender from '@/assets/icons/iconCalender';
import IconDuration from '@/assets/icons/iconDuration';
import IconLocation from '@/assets/icons/iconLocation';
import IconMagnifyingGlass from '@/assets/icons/iconMagnifyingGlass';
import IconPlay from '@/assets/icons/iconPlay';
import UButtonTabs from '@/src/components/core/buttons/uButtonTabs';
import UIconButton from '@/src/components/core/buttons/uIconButtonVariants';
import UTextButton from '@/src/components/core/buttons/uTextButton';
import USearchbar from '@/src/components/core/inputs/uSearchbar';
import UText from '@/src/components/core/text/uText';
import { useExitCommunityMutation, useGetBlogsQuery, useGetCommunitiesQuery, useGetEventsQuery, useGetMediaQuery, useJoinCommunityMutation } from '@/src/redux2/Apis/Explore';
import { formatDate, formatDuration, formatDuration2, formatTime12h } from '@/src/utils/helper';


import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, TouchableOpacity, View } from 'react-native';
import { Text } from 'tamagui';
import { AnimatePresence, XStack, YStack } from 'tamagui';

type TabType = 'Blog' | 'Podcasts' | 'Videos' | 'Events' | 'Community';

const ExploreScreen = () => {
  const router = useRouter();

  const tabs: TabType[] = ['Blog', 'Podcasts', 'Videos', 'Events', 'Community'];
  const [activeTab, setActiveTab] = useState<TabType>('Blog');

  const [searchVisible, setSearchVisible] = useState(false);
  const [search, setSearch] = useState('');


  const blogsQuery = useGetBlogsQuery(undefined, {
    skip: activeTab !== 'Blog',
  });

  const podcastsQuery = useGetMediaQuery(
    { mediaType: 'podcast' },
    { skip: activeTab !== 'Podcasts' }
  );

  console.log('PODCASTS QUERY:', podcastsQuery.data

  );

  const videosQuery = useGetMediaQuery(
    { mediaType: 'video' },
    { skip: activeTab !== 'Videos' }
  );

  const eventsQuery = useGetEventsQuery(undefined, {
    skip: activeTab !== 'Events',
  });

  const communitiesQuery = useGetCommunitiesQuery(undefined, {
    skip: activeTab !== 'Community',
  });

  const { data = [], isLoading } = useMemo(() => {
    switch (activeTab) {
      case 'Blog':
        return {
          data: blogsQuery.data?.data?.articles ?? [],
          isLoading: blogsQuery.isLoading,
        };
      case 'Podcasts':
        return {
          data: podcastsQuery.data?.data?.media ?? [],
          isLoading: podcastsQuery.isLoading,
        };
      case 'Videos':
        return {
          data: videosQuery.data?.data?.media ?? [],
          isLoading: videosQuery.isLoading,
        };
      case 'Events':
        return {
          data: eventsQuery.data?.data?.events ?? [],
          isLoading: eventsQuery.isLoading,
        };
      case 'Community':
        return {
          data: communitiesQuery.data?.data?.communities ?? [],
          isLoading: communitiesQuery.isLoading,
        };
      default:
        return { data: [], isLoading: false };
    }
  }, [
    activeTab,
    blogsQuery,
    podcastsQuery,
    videosQuery,
    eventsQuery,
    communitiesQuery,
  ]);

  const [joinCommunity, { isLoading: joining }] = useJoinCommunityMutation();
  const [exitCommunity, { isLoading: exiting }] = useExitCommunityMutation();


  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data;

    return data.filter((item: any) =>
      Object.values(item).some(
        (value) =>
          typeof value === 'string' &&
          value.toLowerCase().includes(query)
      )
    );
  }, [search, data]);

  const getEmptyMessage = () => {
    switch (activeTab) {
      case 'Blog':
        return 'No blogs found';
      case 'Podcasts':
        return 'No podcasts found';
      case 'Videos':
        return 'No videos found';
      case 'Events':
        return 'No events found';
      case 'Community':
        return 'No communities found';
      default:
        return 'No data found';
    }
  };



  const handleCommunityToggle = async (item: any) => {
    try {
      if (item.isJoined) {
        await exitCommunity(item.id).unwrap();
      } else {
        await joinCommunity(item.id).unwrap();
      }
      communitiesQuery.refetch();
    } catch (error) {
      console.error('Community action failed', error);
    }
  };



  const renderItem = useMemo(() => (item: any) => {
    switch (activeTab.toLowerCase()) {
      case "blog":
        return (
          <XStack
            onPress={() =>
              router.push({
                pathname: "/(app)/article/[id]",
                params: { id: item.id },
              } as unknown as Href)
            }
            pressStyle={{ opacity: 0.85 }}
            key={item.id}
            width={'100%'}
            jc={'center'}
            mb={15}
          >
            <Image
              source={item.cover}
              style={{
                width: 130,
                height: 130,
                borderRadius: 15
              }}
            />

            <YStack
              ml={15}
              width={'55%'}
              jc={'center'}
            >

              <UText numberOfLines={2} variant="heading-h1" width={'100%'} mt={10} >
                {item?.title}
              </UText>

              <XStack mt={7} width={'90%'}>
                <UText numberOfLines={1} variant="text-sm" color={'$neutral8'}>
                  {formatDate(item.publishedAt)}
                </UText>

              </XStack>
            </YStack>


          </XStack>
        );

      case "podcasts":
        return (
          <YStack
            onPress={() =>
              router.push({
                pathname: '/(app)/podcastDetail/[id]',
                params: { id: item.id },
              } as unknown as Href)
            }
            pressStyle={{ opacity: 0.85 }}
            key={item.id}
            jc={'center'}
            marginHorizontal={10}
            mb={10}>
            <XStack ai={'center'} >
              <UText numberOfLines={2} variant="heading-h1" width={'90%'} >
                {item?.name}
              </UText>
              <IconPlay dimen={40} />
            </XStack>

            <XStack mt={10} ai={'center'}>
              <IconDuration />
              <UText numberOfLines={2} variant="text-sm" width={'100%'} ml={3}>
                {Math.floor(item.durationSec / 60)} mins
              </UText>
            </XStack>

            <UText numberOfLines={2} variant="text-sm" width={'100%'} mt={10} >
              {item?.description}
            </UText>

            <View
              style={{
                width: '100%',
                backgroundColor: 'silver',
                height: 1,
                marginTop: 15
              }}
            />

          </YStack>
        );

      case "videos":
        return (
          <YStack
            width={'48%'}
            marginTop={15}
            paddingBottom={10}
            onPress={() =>
              router.push({
                pathname: '/(app)/videoDetails/[id]',
                params: { id: item.id },
              } as unknown as Href)
            }
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
            borderColor={'#efefefff'}>
            <Image
              source={{ uri: item?.thumbnail }}
              style={{
                width: '100%',
                height: 120,
                borderRadius: 15
              }}
            />
            <YStack
              backgroundColor={'rgba(0, 0, 0, 0.6)'}
              position='absolute'
              borderRadius={5}
              paddingHorizontal={5}
              paddingVertical={2}
              top={90}
              left={125}
            >
              <UText fontFamily='$dmsans' numberOfLines={2} variant="text-xs" color={'white'}>
                {formatDuration(item.durationSec)}
              </UText>

            </YStack>

            <UText numberOfLines={2} variant="text-sm" textAlign='left' width={'90%'} mt={4}>
              {item.name}
            </UText>

          </YStack>
        );


      case "events":
        return (
          <XStack
            key={item.id}
            onPress={() =>
              router.push({
                pathname: '/(app)/eventDetails/[id]',
                params: { id: item.id },
              } as unknown as Href)
            }
            pressStyle={{ opacity: 0.85 }}
            marginHorizontal={8}
            marginBottom={15}
            borderRadius={16}
            overflow="hidden"
            backgroundColor={'#ffffff'}
            shadowColor={'#000'}
            shadowOffset={{ width: 0, height: 2 }
            }
            shadowOpacity={0.08}
            shadowRadius={6}
            elevation={4}
            px={15}
            py={15}
            ai={'center'}
            jc={'space-between'}
          >
            <YStack width={'65%'}
            >
              <UText numberOfLines={2} variant="heading-h1">
                {item?.title}
              </UText>

              <XStack mt={8}>
                <XStack ai={'center'}>
                  <IconCalender />
                  <UText numberOfLines={2} variant="text-sm" ml={4}>
                    {formatDate(item?.eventDate)}
                  </UText>
                </XStack>
              </XStack>

              <XStack ai={'center'} mt={8}>
                <IconDuration />
                <UText numberOfLines={2} variant="text-sm" ml={4}>
                  {formatTime12h(item?.eventTime)}
                </UText>
              </XStack>
              <XStack ai={'center'} mt={8}>
                <IconLocation />
                <UText numberOfLines={2} variant="text-sm" ml={4}>
                  {item?.location}
                </UText>
              </XStack>
            </YStack >
            <UTextButton
              onPress={() => console.log('fsddfs')}
              variant='secondary-md'
              height={40}
              width={'30%'}
              textColor={'$black'}
            >
              DETAILS
            </UTextButton>
          </XStack >
        );

      case "community":
        return (
          <YStack
            key={item.id}
            onPress={() =>
              router.push({
                pathname: '/(app)/communityDetail/[id]',
                params: { id: item.id },
              })
            }
            pressStyle={{ opacity: 0.9, scale: 0.98 }}
            marginHorizontal={8}
            marginBottom={15}
            borderRadius={16}
            overflow="hidden"
            backgroundColor={'#ffffff'}
            borderWidth={1}
            borderColor={'rgba(0,0,0,0.05)'}
            shadowColor={'#000'}
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.08}
            shadowRadius={6}
            elevation={4}
            px={18}
            py={16}
          >
            <XStack ai="center" jc="space-between">
              <UText
                variant="heading-h1"
                numberOfLines={2}
                fontWeight="700"

                width="75%"

              >
                {item?.title}
              </UText>
              <YStack
                backgroundColor="rgba(227,233,255,0.8)"
                borderRadius={8}
                px={8}
                py={4}
              >
                <UText variant="text-xs" color="$primary" fontWeight="600">
                  {item?.threadCount} threads
                </UText>
              </YStack>
            </XStack>
            <View
              style={{
                height: 1,
                backgroundColor: 'rgba(0,0,0,0.05)',
                marginVertical: 10,
                width: '100%',
              }}
            />


            <UText
              numberOfLines={3}
              variant="text-sm"
              color="$neutral7"
              lineHeight={20}
            >
              {item?.description}
            </UText>

            <TouchableOpacity onPress={() => handleCommunityToggle(item)}>
              <XStack jc="flex-end" mt={10} ai={'center'}>
                <UText
                  variant="text-sm"
                  color="$primary"
                  fontWeight="600"
                  numberOfLines={1}
                >
                  {item.isJoined ? 'Exit Discussion' : 'Join Discussion'}
                </UText>
                <IconArrowRight dimen={20} />
              </XStack>
            </TouchableOpacity>
          </YStack>
        );

      default:
        return null;
    }
  }, [activeTab, router]);

  return (
    <YStack f={1} backgroundColor="$bg2">
      <XStack mt={45} ai="center">
        <UText variant="heading-h1" ml={20}>
          Explore
        </UText>

        <AnimatePresence>
          {searchVisible ? (
            <YStack width="66%" ml="auto" mr={15}>
              <USearchbar
                search={search}
                onSearchChange={setSearch}
                placeholder="Search"
                onClear={() => {
                  setSearch('');
                  setSearchVisible(false);
                }}
              />
            </YStack>
          ) : (
            <UIconButton
              icon={IconMagnifyingGlass}
              onPress={() => setSearchVisible(true)}
              ml="auto"
            />
          )}
        </AnimatePresence>
      </XStack>

      <UButtonTabs
        items={tabs}
        selectedItem={activeTab}
        onItemSelect={setActiveTab}
        innerContainerProps={{ marginTop: 25, marginBottom: 20 }}
      />

      {isLoading ? (
        <YStack flex={1} jc="center" ai="center" mt={50}>
          <ActivityIndicator size="large" color="#007AFF" />
        </YStack>
      ) : filteredData.length === 0 ? (
        <YStack flex={1} jc="center" ai="center" mt={80}>
          <UText variant="text-md" color="$neutral7">
            {getEmptyMessage()}
          </UText>
        </YStack>
      ) : (
        <FlatList
          key={activeTab}
          data={filteredData}
          keyExtractor={(item) => String(item.id)}
          numColumns={activeTab === 'Videos' ? 2 : 1}
          columnWrapperStyle={
            activeTab === 'Videos'
              ? { justifyContent: 'space-between' }
              : undefined
          }
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        />
      )}

    </YStack>
  );
};

export default ExploreScreen;
