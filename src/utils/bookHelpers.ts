import type { BookType } from '@/src/types/api/library.types';

/**
 * Check if book type is a print format
 */
export const isPrintBook = (type: BookType): boolean =>
  type === 'hardcover' || type === 'paperback';

/**
 * Get display label for book type
 */
export const getBookTypeLabel = (type: BookType): string => {
  switch (type) {
    case 'audiobook': return 'Audio';
    case 'ebook': return 'E-Book';
    case 'paperback': return 'Paperback';
    case 'hardcover': return 'Hardcover';
    default: return 'E-Book';
  }
};

/**
 * Badge tone for book type: audio cyan, e-book purple, print gold
 */
export const getBookTypeTone = (type: BookType): 'cyan' | 'purple' | 'gold' => {
  if (type === 'audiobook') return 'cyan';
  if (isPrintBook(type)) return 'gold';
  return 'purple';
};
