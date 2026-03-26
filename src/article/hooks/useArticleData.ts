import { useGetArticleDetailQuery } from '@/src/store/api/exploreApi';
import { useAppSelector } from '@/src/store/hooks';
import { selectArticle } from '@/src/store/selectors/articleSelectors';

export function useArticleData(id: string | undefined) {
  const { isLoading, isFetching, isError, error, refetch } =
    useGetArticleDetailQuery(id!, {
      skip: !id,
    });

  // Select data from cache using memoized selector
  const article = useAppSelector(selectArticle(id ?? ''));

  return {
    // Data
    article,

    // Loading states
    isLoading,
    isFetching,
    isRefreshing: isFetching && !isLoading,

    // Error states
    isError,
    error,

    // Actions
    refetch,
  };
}
