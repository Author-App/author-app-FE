import { useGetArticleDetailQuery } from '@/src/store/api/exploreApi';

export function useArticleData(id: string | undefined) {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetArticleDetailQuery(id!, {
    skip: !id,
  });

  const article = data?.data ?? null;

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
