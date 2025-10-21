import useHomeController from '@/src/controllers/useHomeController'
import { homeData } from '@/src/data/homeData'
import { FlashList } from '@shopify/flash-list'
import React from 'react'

const HomeScreen = () => {

  const {functions , states} = useHomeController()

  return (
    <FlashList
      data={homeData}
      renderItem={functions.renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32, paddingTop: 60 }}
    />
  )
}

export default HomeScreen


