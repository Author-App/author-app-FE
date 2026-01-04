import { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system/legacy';

import { useGetBookDetailQuery } from '@/src/store/api/libraryApi';
import { useSaveMediaProgress } from '@/src/hooks/useSaveMediaProgress';

export function useAudiobookPlayer(bookId: string | undefined) {
  // Audio state
  const [audioUrl, setAudioUrl] = useState<string | undefined>();
  const [initialPosition, setInitialPosition] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  // Use shared media progress hook (same as podcast/video)
  const { handleBack, handleProgressUpdate } = useSaveMediaProgress(bookId);

  // API query
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetBookDetailQuery(bookId!, {
    skip: !bookId,
  });

  const book = data?.data?.book;
  const masterUrl = book?.master;

  // Calculate initial position from saved progress (backend returns seconds)
  useEffect(() => {
    if (book?.progress?.currentPositionSec) {
      setInitialPosition(book.progress.currentPositionSec * 1000);
    }
  }, [book?.progress?.currentPositionSec]);

  // Download and cache audio file
  useEffect(() => {
    if (!bookId || !masterUrl) return;

    let mounted = true;

    const setupAudio = async () => {
      setIsDownloading(true);

      try {
        const dir = `${FileSystem.documentDirectory}audiobooks/`;
        await FileSystem.makeDirectoryAsync(dir, { intermediates: true });

        const fileUri = `${dir}${bookId}.mp3`;
        const info = await FileSystem.getInfoAsync(fileUri);

        // Download if not cached or file is corrupt
        if (!info.exists || (info.size ?? 0) < 1000) {
          await FileSystem.downloadAsync(masterUrl, fileUri);
        }

        if (mounted) {
          setAudioUrl(fileUri);
        }
      } catch (err) {
        console.error('Audio setup error:', err);
        // Fallback to streaming URL
        if (mounted && masterUrl) {
          setAudioUrl(masterUrl);
        }
      } finally {
        if (mounted) {
          setIsDownloading(false);
        }
      }
    };

    setupAudio();

    return () => {
      mounted = false;
    };
  }, [bookId, masterUrl]);

  // Format duration for display
  const formattedDuration = (() => {
    if (!book?.durationSec) return '';
    const hours = Math.floor(book.durationSec / 3600);
    const minutes = Math.floor((book.durationSec % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} min`;
  })();

  return {
    // Data
    book,
    audioUrl,
    initialPosition,
    formattedDuration,
    // Loading states
    isLoading: isLoading || isDownloading,
    isFetching,
    isDownloading,
    isAudioReady: !!audioUrl,
    // Error states
    isError,
    // Callbacks
    handleProgressUpdate,
    handleBack,
    refetch,
  };
}
