/**
 * Article Module Barrel Export
 */

// Components
export { ArticleScreen } from './components/ArticleScreen';
export { ArticleHeader } from './components/ArticleHeader';
export { ArticleContent } from './components/ArticleContent';

// Hooks
export { useArticleData } from './hooks/useArticleData';

// Types
export type {
  ArticleResponse,
  ArticleDetailResponse,
  ArticleAuthor,
} from './types/article.types';
