import React from 'react'
import UHeaderWithBackground from '@/src/components/core/layout/uHeaderWithBackground'
import HeroBanner from '@/src/components/home/banner/heroBanner'
import useHomeController from '@/src/controllers/useHomeController'
import { homeData } from '@/src/data/homeData'
import { FlashList } from '@shopify/flash-list'
import { YStack } from 'tamagui'

const HomeScreen = () => {

  const { functions, states } = useHomeController()

  return (
    <YStack flex={1}>
      <FlashList
        data={homeData}
        renderItem={functions.renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom: 32,
        }}
        ListHeaderComponent={
          <YStack mb={20} position="relative">
            <UHeaderWithBackground
            />
            <HeroBanner image='' title='' />
          </YStack>
        }
      />
    </YStack>
  )
}

export default HomeScreen


