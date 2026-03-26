/**
 * Podcast Detail Types
 *
 * Re-exports from API types and local component types.
 */

// Re-export API types for convenience
export type {
  MediaResponse,
  MediaListResponse,
} from '@/src/types/api/explore.types';

export type {
  MediaDetailResponse,
  MediaProgress,
} from '@/src/store/api/mediaApi';

// Audio player state (local hook state)
export interface AudioPlayerState {
  isPlaying: boolean;
  isLoading: boolean;
  position: number;
  duration: number;
  progress: number;
}
