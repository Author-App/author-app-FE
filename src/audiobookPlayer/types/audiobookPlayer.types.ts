import type { BookResponse } from '@/src/types/api/library.types';

// Re-export for convenience
export type { BookResponse } from '@/src/types/api/library.types';

export interface AudiobookPlayerState {
  audioUrl: string | undefined;
  initialPosition: number;
  isDownloading: boolean;
  downloadError: string | null;
}

export interface AudiobookInfo {
  id: string;
  title: string;
  author: string;
  thumbnail?: string;
  durationSec?: number;
}
