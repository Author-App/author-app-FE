/**
 * LibraryHeader Component
 *
 * Premium header for the library screen using UHeader.
 */

import React, { memo } from 'react';
import UHeader from '@/src/components/core/layout/uHeader';

const LibraryHeader: React.FC<{ px?: number }> = ({ px }) => {
  return (
    <UHeader
      variant="premium"
      title="Library"
      subtitle="Your personal collection"
      safeAreaDisabled
      pb={16}
      // An explicit undefined would clear UHeader's own padding
      {...(px !== undefined && { px })}
    />
  );
};

export default memo(LibraryHeader);
