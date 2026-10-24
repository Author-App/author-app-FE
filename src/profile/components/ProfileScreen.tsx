import React from 'react';
import { ScrollView } from 'react-native';
import { YStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTabBarInset } from '@/src/navigations/hooks/useTabBarInset';

import { useProfileData } from '../hooks/useProfileData';

import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import ProfileHeader from './ProfileHeader';
import AuthorCard from './AuthorCard';
import SocialLinks from './SocialLinks';
import AboutSection from './AboutSection';
import WritingProcess from './WritingProcess';

const ProfileScreen: React.FC = () => {
  const { top } = useSafeAreaInsets();
  const { clearance } = useTabBarInset();
  const { author } = useProfileData();

  return (
    <UScreenLayout pt={top}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: clearance }}>
        <ProfileHeader />

        <YStack px={16} gap={20}>
          <AuthorCard name={author.name} title={author.title} image={author.image}>
            <SocialLinks links={author.socialLinks} />
          </AuthorCard>

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

export default ProfileScreen;
