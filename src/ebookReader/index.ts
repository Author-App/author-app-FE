/**
 * Ebook Reader Feature
 * 
 * Barrel exports for the ebook reader module.
 */

// Components
export { EbookReaderScreen } from './components/EbookReaderScreen';
export { ReaderHeader } from './components/ReaderHeader';
export { ReaderFooter } from './components/ReaderFooter';

// Hooks
export { useEbookReader } from './hooks/useEbookReader';

// Types
export type {
  ReadingProgress,
  ReaderStatus,
  ReaderState,
  ReaderBookInfo,
} from './types/ebookReader.types';
