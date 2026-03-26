import { useMemo } from 'react';
import { AUTHOR_PROFILE } from '../data/authorData';
import type { AuthorProfile } from '../types/profile.types';

interface UseProfileDataReturn {
  author: AuthorProfile;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  refetch: () => void;
}

export const useProfileData = (): UseProfileDataReturn => {
  // TODO: Replace with API call when endpoint is available
  // const { data, isLoading, isError, error, refetch } = useGetAuthorProfileQuery();

  const author = useMemo(() => AUTHOR_PROFILE, []);

  return {
    author,
    isLoading: false,
    isError: false,
    errorMessage: null,
    refetch: () => {
      // Will trigger API refetch when implemented
    },
  };
};
