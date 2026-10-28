import type { useURefreshControl } from '@/src/components/core/feedback/URefreshControl';
import type { ArticleDetailResponse } from '../../types/article.types';

export interface ArticleLayoutProps extends ReturnType<typeof useURefreshControl> {
  article: ArticleDetailResponse;
}
