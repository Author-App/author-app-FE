import React from 'react';
import { YStack } from 'tamagui';

import ProfileHeader from '../ProfileHeader';
import AuthorCard from '../AuthorCard';
import SocialLinks from '../SocialLinks';
import AboutSection from '../AboutSection';
import WritingProcess from '../WritingProcess';
import type { AuthorProfile } from '../../types/profile.types';

const ProfileCompact = ({ author }: { author: AuthorProfile }) => (
  <>
    <ProfileHeader />

    <YStack px={16} gap={20}>
      <AuthorCard name={author.name} title={author.title} image={author.image}>
        <SocialLinks links={author.socialLinks} />
      </AuthorCard>

      <AboutSection bio={author.bio} />

      <WritingProcess description={author.writingProcess.description} points={author.writingProcess.points} />
    </YStack>
  </>
);

export default ProfileCompact;
