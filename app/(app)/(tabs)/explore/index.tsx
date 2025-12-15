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
import { useGetBlogsQuery, useGetCommunitiesQuery, useGetEventsQuery, useGetMediaQuery } from '@/src/redux2/Apis/Explore';
import { formatDate, formatDuration, formatTime12h } from '@/src/utils/helper';


import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Image, View } from 'react-native';
import { AnimatePresence, XStack, YStack } from 'tamagui';

type TabType = 'Blog' | 'Podcasts' | 'Videos' | 'Events' | 'Community';

const ExploreScreen = () => {
  const router = useRouter();

  const tabs: TabType[] = ['Blog', 'Podcasts', 'Videos', 'Events', 'Community'];
  const [activeTab, setActiveTab] = useState<TabType>('Blog');

  const [searchVisible, setSearchVisible] = useState(false);
  const [search, setSearch] = useState('');

  /* ---------------- API CALLS ---------------- */

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

  /* ---------------- DATA SELECTOR ---------------- */

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

  /* ---------------- SEARCH FILTER ---------------- */

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

  /* ---------------- CARD RENDER ---------------- */

  const renderCard = (item: any) => {
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
            // onPress={() =>
            //   router.push({
            //     pathname: '/(app)/blogDetails/[id]',
            //     params: { id: item.id },
            //   })
            // }
            pressStyle={{ opacity: 0.85 }}
            key={item.id}
            width={'100%'}
            jc={'center'}
            mb={15}
          >
            {/* <View style={{ width: 130, height: 130, borderRadius: 15, overflow: 'hidden' }}>
                    <Image
                      source={item.cover}
                      style={{
                        width: 130,
                        height: 'auto',
                        aspectRatio: 0.5,
                        alignSelf: 'center',
                        resizeMode: 'cover',
                        top: 0,
                        position: 'absolute',
                      }}
                    />
                  </View> */}

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
                {/* <UText numberOfLines={1} variant="text-sm" color={'$neutral8'} marginLeft={'auto'} >
                        {item.readTime}
                      </UText> */}
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
            marginHorizontal={20}
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
                {item?.durationSec}
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

            {/* <View style={{ width: '100%', height: 120, overflow: 'hidden', borderRadius: 15 }}>
              <Image
                source={item.cover}
                style={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: 0.5,
                  alignSelf: 'center',
                  resizeMode: 'cover',
                  top: 0,
                  position: 'absolute',
                }}
              />
            </View> */}

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


      // case 'videos':
      //   return (
      //     <YStack width="48%" mb={15}>
      //       <Image
      //         source={{ uri: item.cover }}
      //         style={{ width: '100%', height: 120, borderRadius: 15 }}
      //       />
      //       <UText numberOfLines={2} mt={5}>
      //         {item.title}
      //       </UText>
      //     </YStack>
      //   );


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
            marginHorizontal={20}
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
            ai={'center'} >
            <YStack width={'70%'}
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
              width={'28%'}
              textColor={'$black'}
            >
              DETAILS
            </UTextButton>
          </XStack >
        );

      // case 'events':
      //   return (
      //     <XStack mb={15} px={15} py={15} backgroundColor="#fff" borderRadius={16}>
      //       <YStack width="70%">
      //         <UText variant="heading-h1">{item.title}</UText>
      //         <XStack mt={8}>
      //           <IconCalender />
      //           <UText ml={5}>{item.date}</UText>
      //         </XStack>
      //       </YStack>
      //       <UTextButton variant="secondary-md">DETAILS</UTextButton>
      //     </XStack>
      //   );

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
            marginHorizontal={20}
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

            <XStack jc="flex-end" mt={10} ai={'center'}>
              <UText
                variant="text-sm"
                color="$primary"
                fontWeight="600"
                numberOfLines={1}
              >
                Join Discussion
              </UText>
              <IconArrowRight dimen={20} />
            </XStack>
          </YStack>
        );

      // case 'community':
      //   return (
      //     <YStack mb={15} px={18} py={16} backgroundColor="#fff" borderRadius={16}>
      //       <UText variant="heading-h1">{item.title}</UText>
      //       <UText mt={8}>{item.description}</UText>
      //     </YStack>
      //   );

      default:
        return null;
    }
  };

  /* ---------------- UI ---------------- */

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
        <UText ai="center" mt={50}>
          Loading...
        </UText>
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
          renderItem={({ item }) => renderCard(item)}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        />
      )}
    </YStack>
  );
};

export default ExploreScreen;


// import IconArrowRight from '@/assets/icons/iconArrowRight';
// import IconCalender from '@/assets/icons/iconCalender';
// import IconDuration from '@/assets/icons/iconDuration';
// import IconLocation from '@/assets/icons/iconLocation';
// import IconMagnifyingGlass from '@/assets/icons/iconMagnifyingGlass';
// import IconPlay from '@/assets/icons/iconPlay';
// import assets from '@/assets/images';
// import UAnimatedYStack from '@/src/components/core/animated/uAnimatedYStack';
// import UButtonTabs from '@/src/components/core/buttons/uButtonTabs';
// import UIconButton from '@/src/components/core/buttons/uIconButtonVariants';
// import UTextButton from '@/src/components/core/buttons/uTextButton';
// import USearchbar from '@/src/components/core/inputs/uSearchbar';
// import UText from '@/src/components/core/text/uText';
// import { exploreData } from '@/src/data/exploreData';
// import { useRouter } from 'expo-router';
// import { useState } from 'react';
// import { FlatList, Image, View } from 'react-native';
// import { AnimatePresence, XStack, YStack } from 'tamagui';

// const ExploreScreen = () => {

//   const [selectedTab, setSelectedTab] = useState<'Books' | 'Audiobooks'>('Books');

//   const items = ['Blog', 'Podcasts', 'Videos', 'Events', 'Community'];
//   const [activeTab, setActiveTab] = useState<'Blog' | 'Podcasts' | 'Videos' | 'Events' | 'Community'>('Blog');


//   const [searchVisible, setSearchVisible] = useState(false);
//   const [search, setSearch] = useState('');

//   const activeSection = exploreData.find(
//     (section) => section.subtype.toLowerCase() === activeTab.toLowerCase()
//   );

//   const router = useRouter();

//   const filteredData = activeSection
//     ? activeSection.data.filter((item) => {
//       const query = (search ?? '').trim().toLowerCase();
//       if (!query) return true;

//       const title = item?.title?.toLowerCase() ?? '';
//       const description = item?.description?.toLowerCase() ?? '';
//       const date = item?.date?.toLowerCase() ?? '';
//       const location = item?.location?.toLowerCase() ?? '';
//       const time = item?.time?.toLowerCase() ?? '';
//       const duration = item?.duration?.toLowerCase() ?? '';

//       return (
//         title.includes(query) ||
//         description.includes(query) ||
//         date.includes(query) ||
//         location.includes(query) ||
//         time.includes(query) ||
//         duration.includes(query)
//       );
//     })
//     : [];


//   const renderCard = (subtype: string, item: any) => {
//     const baseImageStyle = {
//       width: "100%",
//       height: 130,
//       borderRadius: 12,
//       marginBottom: 8,
//     };

//     switch (subtype) {
//       case "blog":
//         return (
//           <XStack
//             onPress={() =>
//               router.push({
//                 pathname: '/(app)/blogDetails/[id]',
//                 params: { id: item.id },
//               })
//             }
//             pressStyle={{ opacity: 0.85 }}
//             key={item.id}
//             width={'100%'}
//             jc={'center'}
//             mb={15}
//           >
//             {/* <View style={{ width: 130, height: 130, borderRadius: 15, overflow: 'hidden' }}>
//               <Image
//                 source={item.cover}
//                 style={{
//                   width: 130,
//                   height: 'auto',
//                   aspectRatio: 0.5,
//                   alignSelf: 'center',
//                   resizeMode: 'cover',
//                   top: 0,
//                   position: 'absolute',
//                 }}
//               />
//             </View> */}

//             <Image
//               source={item.cover}
//               style={{
//                 width: 130,
//                 height: 130,
//                 borderRadius: 15
//               }}
//             />

//             <YStack
//               ml={15}
//               width={'55%'}
//               jc={'center'}
//             >

//               <UText numberOfLines={2} variant="heading-h1" width={'100%'} mt={10} >
//                 {item?.title}
//               </UText>

//               <XStack mt={7} width={'90%'}>
//                 <UText numberOfLines={1} variant="text-sm" color={'$neutral8'}>
//                   {item.date}
//                 </UText>
//                 <UText numberOfLines={1} variant="text-sm" color={'$neutral8'} marginLeft={'auto'} >
//                   {item.readTime}
//                   {/* read */}
//                 </UText>
//               </XStack>
//             </YStack>


//           </XStack>
//         );

//       case "podcasts":
//         return (
//           <YStack
//             onPress={() =>
//               router.push({
//                 pathname: '/(app)/podcastDetail/[id]',
//                 params: { id: item.id },
//               })
//             }
//             pressStyle={{ opacity: 0.85 }}
//             key={item.id}
//             jc={'center'}
//             marginHorizontal={20}
//             mb={10}>
//             <XStack ai={'center'} >
//               <UText numberOfLines={2} variant="heading-h1" width={'90%'} >
//                 {item?.title}
//               </UText>
//               <IconPlay dimen={40} />
//             </XStack>

//             <XStack mt={10} ai={'center'}>
//               <IconDuration />
//               <UText numberOfLines={2} variant="text-sm" width={'100%'} ml={3}>
//                 {item?.duration}
//               </UText>
//             </XStack>

//             <UText numberOfLines={2} variant="text-sm" width={'100%'} mt={10} >
//               {item?.description}
//             </UText>

//             <View
//               style={{
//                 width: '100%',
//                 backgroundColor: 'silver',
//                 height: 1,
//                 marginTop: 15
//               }}
//             />

//           </YStack>
//         );

//       case "videos":
//         return (
//           <YStack
//             width={'48%'}
//             marginTop={15}
//             paddingBottom={10}
//             onPress={() =>
//               router.push({
//                 pathname: '/(app)/videoDetails/[id]',
//                 params: { id: item.id },
//               })
//             }
//             pressStyle={{ opacity: 0.85 }}
//             backgroundColor={'#ffffffff'}
//             borderRadius={15}
//             ai={'center'}
//             borderWidth={1}
//             shadowColor={'#cfcfcfff'}
//             shadowOffset={{ width: 0, height: 2 }}
//             shadowOpacity={0.08}
//             shadowRadius={6}
//             elevation={4}
//             borderColor={'#efefefff'}>

//             {/* <View style={{ width: '100%', height: 120, overflow: 'hidden', borderRadius: 15 }}>
//               <Image
//                 source={item.cover}
//                 style={{
//                   width: '100%',
//                   height: 'auto',
//                   aspectRatio: 0.5,
//                   alignSelf: 'center',
//                   resizeMode: 'cover',
//                   top: 0,
//                   position: 'absolute',
//                 }}
//               />
//             </View> */}

//             <Image
//               source={item.cover}
//               style={{
//                 width: '100%',
//                 height: 120,
//                 borderRadius: 15
//               }}
//             />
//             <YStack
//               backgroundColor={'rgba(0, 0, 0, 0.6)'}
//               position='absolute'
//               borderRadius={5}
//               paddingHorizontal={5}
//               paddingVertical={2}
//               top={90}
//               left={125}
//             >
//               <UText fontFamily='$dmsans' numberOfLines={2} variant="text-xs" color={'white'}>
//                 {item.duration}
//               </UText>

//             </YStack>

//             <UText numberOfLines={2} variant="text-sm" textAlign='left' width={'90%'} mt={4}>
//               {item.title}
//             </UText>

//           </YStack>
//         );

//       case "events":
//         return (
//           <XStack
//             key={item.id}
//             onPress={() =>
//               router.push({
//                 pathname: '/(app)/eventDetails/[id]',
//                 params: { id: item.id },
//               })
//             }
//             pressStyle={{ opacity: 0.85 }}
//             marginHorizontal={20}
//             marginBottom={15}
//             borderRadius={16}
//             overflow="hidden"
//             backgroundColor={'#ffffff'}
//             shadowColor={'#000'}
//             shadowOffset={{ width: 0, height: 2 }
//             }
//             shadowOpacity={0.08}
//             shadowRadius={6}
//             elevation={4}
//             px={15}
//             py={15}
//             ai={'center'} >
//             <YStack width={'70%'}
//             >
//               <UText numberOfLines={2} variant="heading-h1">
//                 {item?.title}
//               </UText>

//               <XStack mt={8}>
//                 <XStack ai={'center'}>
//                   <IconCalender />
//                   <UText numberOfLines={2} variant="text-sm" ml={4}>
//                     {item?.date}
//                   </UText>
//                 </XStack>
//               </XStack>

//               <XStack ai={'center'} mt={8}>
//                 <IconDuration />
//                 <UText numberOfLines={2} variant="text-sm" ml={4}>
//                   {item?.time}
//                 </UText>
//               </XStack>
//               <XStack ai={'center'} mt={8}>
//                 <IconLocation />
//                 <UText numberOfLines={2} variant="text-sm" ml={4}>
//                   {item?.location}
//                 </UText>
//               </XStack>
//             </YStack >
//             <UTextButton
//               onPress={() => console.log('fsddfs')}
//               variant='secondary-md'
//               height={40}
//               width={'28%'}
//               textColor={'$black'}
//             >
//               DETAILS
//             </UTextButton>
//           </XStack >
//         );

//       case "community":
//         return (
//           <YStack
//             key={item.id}
//             onPress={() =>
//               router.push({
//                 pathname: '/(app)/communityDetail/[id]',
//                 params: { id: item.id },
//               })
//             }
//             pressStyle={{ opacity: 0.9, scale: 0.98 }}
//             marginHorizontal={20}
//             marginBottom={15}
//             borderRadius={16}
//             overflow="hidden"
//             backgroundColor={'#ffffff'}
//             borderWidth={1}
//             borderColor={'rgba(0,0,0,0.05)'}
//             shadowColor={'#000'}
//             shadowOffset={{ width: 0, height: 2 }}
//             shadowOpacity={0.08}
//             shadowRadius={6}
//             elevation={4}
//             px={18}
//             py={16}
//           >
//             <XStack ai="center" jc="space-between">
//               <UText
//                 variant="heading-h1"
//                 numberOfLines={2}
//                 fontWeight="700"

//                 width="75%"

//               >
//                 {item?.title}
//               </UText>
//               <YStack
//                 backgroundColor="rgba(227,233,255,0.8)"
//                 borderRadius={8}
//                 px={8}
//                 py={4}
//               >
//                 <UText variant="text-xs" color="$primary" fontWeight="600">
//                   {item?.threads} threads
//                 </UText>
//               </YStack>
//             </XStack>
//             <View
//               style={{
//                 height: 1,
//                 backgroundColor: 'rgba(0,0,0,0.05)',
//                 marginVertical: 10,
//                 width: '100%',
//               }}
//             />


//             <UText
//               numberOfLines={3}
//               variant="text-sm"
//               color="$neutral7"
//               lineHeight={20}
//             >
//               {item?.description}
//             </UText>

//             <XStack jc="flex-end" mt={10} ai={'center'}>
//               <UText
//                 variant="text-sm"
//                 color="$primary"
//                 fontWeight="600"
//                 numberOfLines={1}
//               >
//                 Join Discussion
//               </UText>
//               <IconArrowRight dimen={20} />
//             </XStack>
//           </YStack>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <YStack
//       f={1}
//       backgroundColor={'$bg2'}
//     >
//       <XStack mt={45} ai={'center'}>
//         <UText variant="heading-h1" ml={20}>
//           Explore
//         </UText>

//         <AnimatePresence>
//           {searchVisible ? (
//             <YStack
//               animation="quick"
//               enterStyle={{ opacity: 0, y: -10 }}
//               exitStyle={{ opacity: 0, y: -10 }}
//               width="66%"
//               marginLeft={'auto'}
//               marginRight={15}
//             >
//               <USearchbar
//                 search={search}
//                 onSearchChange={setSearch}
//                 placeholder="Search"
//                 variant="quaternary"
//                 onClear={() => {
//                   setSearch('');
//                   setSearchVisible(false);
//                 }}
//               />
//             </YStack>
//           ) : (
//             <UIconButton
//               icon={IconMagnifyingGlass}
//               variant="quaternary-md"
//               iconProps={{ dimen: 24 }}
//               onPress={() => setSearchVisible(true)}
//               ml={'auto'}
//             />
//           )}
//         </AnimatePresence>
//       </XStack>

//       <UButtonTabs
//         items={items}
//         selectedItem={activeTab}
//         onItemSelect={(tab: 'Blog' | 'Podcasts' | 'Videos' | 'Events' | 'Community') => setActiveTab(tab)}
//         variant="style-1"
//         innerContainerProps={{
//           marginTop: 25,
//           marginLeft: 10,
//           marginBottom: 20
//         }}
//       />

//       {activeSection ? (
//         <FlatList
//           key={activeSection.subtype === 'videos' ? 'videos-grid' : 'list-view'}
//           // data={activeSection?.data ?? []}
//           data={filteredData}
//           keyExtractor={(item) => String(item.id)}
//           horizontal={false}
//           showsVerticalScrollIndicator={false}
//           numColumns={activeSection.subtype === 'videos' ? 2 : 1}
//           columnWrapperStyle={
//             activeSection.subtype === 'videos' ? { justifyContent: 'space-between' } : undefined
//           }
//           renderItem={({ item }) => renderCard(activeSection.subtype, item)}
//           contentContainerStyle={
//             activeSection.subtype === 'videos' ?
//               {
//                 paddingHorizontal: 20,
//                 justifyContent: 'space-between'
//               } :
//               undefined
//           }
//         />
//       ) : (
//         <UText ai="center" mt={50}>
//           No {activeTab} found
//         </UText>
//       )}

//     </YStack>
//   );
// }

// export default ExploreScreen;

