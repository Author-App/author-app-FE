/**
 * ProfileHeader Component
 *
 * Header for the profile screen using premium UHeader variant.
 */

import React, { memo } from 'react';

import UHeader from '@/src/components/core/layout/uHeader';

const ProfileHeader: React.FC = () => {
  return (
    <UHeader
      variant="premium"
      title="Author Profile"
      subtitle="Get to know the storyteller"
      safeAreaDisabled
    />
  );
};

export default memo(ProfileHeader);
