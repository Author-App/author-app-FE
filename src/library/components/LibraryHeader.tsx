/**
 * LibraryHeader Component
 *
 * Premium header for the library screen using UHeader.
 */

import React, { memo } from 'react';
import UHeader from '@/src/components/core/layout/uHeader';

const LibraryHeader: React.FC = () => {
  return (
    <UHeader
      variant="premium"
      title="Library"
      subtitle="Your personal collection"
      safeAreaDisabled
    />
  );
};

export default memo(LibraryHeader);
