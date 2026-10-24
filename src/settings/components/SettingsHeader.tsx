import React, { memo } from 'react';

import UHeader from '@/src/components/core/layout/uHeader';

const SettingsHeader: React.FC = () => {
  return (
    <UHeader
      variant="premium"
      title="Settings"
      subtitle="Manage your account"
      safeAreaDisabled
      pb={20}
    />
  );
};

export default memo(SettingsHeader);
