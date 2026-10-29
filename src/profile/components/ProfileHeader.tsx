import React, { memo } from 'react';

import UHeader from '@/src/components/core/layout/uHeader';

const ProfileHeader: React.FC<{ px?: number }> = ({ px }) => {
  return (
    <UHeader
      variant="premium"
      title="Author Profile"
      subtitle="Get to know the storyteller"
      safeAreaDisabled
      {...(px !== undefined && { px })}
    />
  );
};

export default memo(ProfileHeader);
