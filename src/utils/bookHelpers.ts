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
 * Get badge color token for book type
 */
export const getBookTypeColor = (type: BookType): string => {
  switch (type) {
    case 'audiobook': return '$brandTeal';
    case 'ebook': return '$brandCrimson';
    case 'paperback': return '$brandOcean';
    case 'hardcover': return '$brandNavy';
    default: return '$brandCrimson';
  }
};

/**
 * Get icon name for book type
 */
export const getBookTypeIcon = (type: BookType): 'headset' | 'book' => {
  return type === 'audiobook' ? 'headset' : 'book';
};
