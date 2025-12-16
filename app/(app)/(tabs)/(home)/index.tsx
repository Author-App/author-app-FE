import React from 'react'
import UHeaderWithBackground from '@/src/components/core/layout/uHeaderWithBackground'
import HeroBanner from '@/src/components/home/banner/heroBanner'
import useHomeController from '@/src/controllers/useHomeController'
import { homeData } from '@/src/data/homeData'
import { FlashList } from '@shopify/flash-list'
import { YStack } from 'tamagui'
import { ActivityIndicator } from 'react-native'

const HomeScreen = () => {

  const { functions, components, styles, states } = useHomeController()

  if (states.loading) {
    return (
      <YStack flex={1} jc="center" ai="center">
        <ActivityIndicator size="large" />
      </YStack>
    );
  }

  return (
    <YStack flex={1}>
      <FlashList
        data={states.homeSections}
        renderItem={functions.renderItem}
        keyExtractor={functions.keyExtractor}
        contentContainerStyle={styles.contentContainerStyle}
        ListHeaderComponent={
          components.listHeaderComponent
        }
        showsVerticalScrollIndicator={false}
      />
    </YStack>
  )
}

export default HomeScreen


