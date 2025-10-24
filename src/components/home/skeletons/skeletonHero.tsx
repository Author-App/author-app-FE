import React from 'react'
import { YStack } from 'tamagui'
import USkeleton from '../../core/display/uSkeleton'
// import USkeleton from '@/src/components/core/display/uSkeleton'

const SkeletonHero = () => {
  return (
    <YStack w="100%" h={260} borderRadius="$4" overflow="hidden">
      <USkeleton width="100%" height="100%" radius={0} />
    </YStack>
  )
}

export default SkeletonHero


