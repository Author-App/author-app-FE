/**
 * useHomeData Hook
 *
 * Clean hook for home screen data fetching.
 * Uses new homeApi and memoized selectors.
 */

import { useGetHomeFeedQuery } from '@/src/store/api/homeApi';
import { useAppSelector } from '@/src/store/hooks';
import {
  selectHomeBanner,
  selectHomeSections,
  selectHomeFeedError,
} from '@/src/store/selectors/homeSelectors';
import type { HomeBanner, HomeSection } from '@/src/types/api/home.types';

interface UseHomeDataReturn {
  banner: HomeBanner | null;
  sections: HomeSection[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  refetch: () => void;
}

/**
 * Extracts error message from RTK Query error
 */
const getErrorMessage = (error: unknown): string | null => {
  if (!error) return null;
  if (typeof error === 'object' && 'data' in error) {
    const data = (error as { data: unknown }).data;
    if (typeof data === 'object' && data && 'message' in data) {
      return (data as { message: string }).message;
    }
  }
  return 'Something went wrong';
};

export const useHomeData = (): UseHomeDataReturn => {
  // Trigger the query
  const { isLoading, refetch } = useGetHomeFeedQuery();

  // Use memoized selectors for data
  const banner = useAppSelector(selectHomeBanner);
  const sections = useAppSelector(selectHomeSections);
  const error = useAppSelector(selectHomeFeedError);

  return {
    banner,
    sections,
    isLoading,
    isError: !!error,
    errorMessage: getErrorMessage(error),
    refetch,
  };
};
