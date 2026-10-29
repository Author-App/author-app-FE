import React, { memo } from 'react';

import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import UEmptyState from '@/src/components/core/feedback/UEmptyState';

interface LibraryEmptyStateProps {
  isFiltered?: boolean;
}

const LibraryEmptyState: React.FC<LibraryEmptyStateProps> = ({ isFiltered = false }) => (
  <UAnimatedView animation="fadeInUp" duration={400}>
    <UEmptyState
      icon={isFiltered ? 'search-outline' : 'library-outline'}
      title={isFiltered ? 'No matches found' : 'Your library is empty'}
      message={
        isFiltered
          ? 'Try adjusting your filters to find what you are looking for'
          : 'Explore our collection and add books to your library'
      }
    />
  </UAnimatedView>
);

export default memo(LibraryEmptyState);
