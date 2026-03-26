import React, { memo } from 'react';
import { ScrollView } from 'react-native';
import { YStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useProfileData } from '../hooks/useProfileData';

import AppLoader from '@/src/components/core/loaders/AppLoader';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import ProfileHeader from './ProfileHeader';
import AuthorCard from './AuthorCard';
import SocialLinks from './SocialLinks';
import AboutSection from './AboutSection';
import WritingProcess from './WritingProcess';

const ProfileScreen: React.FC = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { author, isLoading, isError } = useProfileData();

  if (isLoading) {
    return (
      <UScreenLayout>
        <AppLoader />
      </UScreenLayout>
    );
  }

  // TODO: Add error state component when API is integrated
  if (isError) {
    return (
      <UScreenLayout ai="center" jc="center">
        {/* Error state */}
        <></>
      </UScreenLayout>
    );
  }

  return (
    <UScreenLayout pt={top}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 64 + Math.max(bottom, 24),
        }}
      >
        <ProfileHeader />

        <YStack px={20} gap={16}>
          <AuthorCard
            name={author.name}
            title={author.title}
            image={author.image}
          />

          <SocialLinks links={author.socialLinks} />

          <AboutSection bio={author.bio} />

          <WritingProcess
            description={author.writingProcess.description}
            points={author.writingProcess.points}
          />
        </YStack>
      </ScrollView>
    </UScreenLayout>
  );
};

export default ProfileScreen