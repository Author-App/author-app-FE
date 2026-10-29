import { router, Stack } from 'expo-router';
import { YStack } from 'tamagui';

import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import UEmptyState from '@/src/components/core/feedback/UEmptyState';
import { NeonButton } from '@/src/components/core/buttons/neonButton';
import { FORM_WIDTH } from '@/src/components/core/layout/layout';

export default function NotFoundScreen() {
  return (
    <UScreenLayout jc="center" ai="center" px={24}>
      <Stack.Screen options={{ headerShown: false }} />
      <YStack w="100%" maw={FORM_WIDTH} gap={24}>
        <UEmptyState icon="compass-outline" title="Page not found" message="This screen doesn't exist." />
        <NeonButton title="Go Home" onPress={() => router.replace('/')} />
      </YStack>
    </UScreenLayout>
  );
}
