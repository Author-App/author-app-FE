import React from 'react';
import { XStack, YStack } from 'tamagui';

import { useLayoutClass } from '@/src/components/core/layout/useLayoutClass';
import { PANE_GAP, paneWidth } from '@/src/components/core/layout/layout';
import ProfileHeader from '../ProfileHeader';
import AuthorCard from '../AuthorCard';
import SocialLinks from '../SocialLinks';
import AboutSection from '../AboutSection';
import WritingProcess from '../WritingProcess';
import type { AuthorProfile } from '../../types/profile.types';

const ProfileWide = ({ author }: { author: AuthorProfile }) => {
  const { size, side, contentWidth } = useLayoutClass();
  const isExpanded = size === 'expanded';

  const card = (
    <AuthorCard name={author.name} title={author.title} image={author.image}>
      <SocialLinks links={author.socialLinks} />
    </AuthorCard>
  );
  const text = (
    <>
      <AboutSection bio={author.bio} />
      <WritingProcess description={author.writingProcess.description} points={author.writingProcess.points} />
    </>
  );

  return (
    <>
      <ProfileHeader px={side} />

      {isExpanded ? (
        <XStack px={side} gap={PANE_GAP} ai="flex-start">
          <YStack w={paneWidth(contentWidth)}>{card}</YStack>
          <YStack flex={1} gap={20}>
            {text}
          </YStack>
        </XStack>
      ) : (
        <YStack px={side} gap={20}>
          {card}
          {text}
        </YStack>
      )}
    </>
  );
};

export default ProfileWide;
