import type { AudioPlayer } from 'expo-audio';

export interface AudioProgressData {
  position: number; 
  duration: number; 
  progress: number;  
}

export interface UseAudioPlayerOptions {
  autoPlay?: boolean;
  initialPosition?: number;
  onProgressUpdate?: (data: AudioProgressData) => void;
  onPlaybackComplete?: () => void;
}

export interface UseAudioPlayerReturn {
  player: AudioPlayer;
  isPlaying: boolean;
  isLoading: boolean;
  togglePlayPause: () => Promise<void>;
  seekTo: (positionMs: number) => Promise<void>;
  rewind: (seconds?: number) => Promise<void>;
  forward: (seconds?: number) => Promise<void>;
}
