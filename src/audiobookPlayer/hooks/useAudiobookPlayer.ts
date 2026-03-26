import { useState, useEffect, useCallback, useRef } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import { useRouter } from 'expo-router';

import { useGetBookDetailQuery, useUpdateAudiobookProgressMutation } from '@/src/store/api/libraryApi';

interface ProgressData {
  position: number;
  duration: number;
  progress: number;
}

export function useAudiobookPlayer(bookId: string | undefined) {
  const router = useRouter();
  const [updateAudiobookProgress] = useUpdateAudiobookProgressMutation();
  
  // Audio state
  const [audioUrl, setAudioUrl] = useState<string | undefined>();
  const [initialPosition, setInitialPosition] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  // Progress tracking
  const hasSavedRef = useRef(false);
  const lastPositionRef = useRef(0);

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

  // Track progress from AudioPlayer callback
  const handleProgressUpdate = useCallback((progressData: ProgressData) => {
    lastPositionRef.current = progressData.position;
  }, []);

  // Save audiobook progress to server
  const saveProgress = useCallback(async () => {
    if (!bookId || hasSavedRef.current) return;

    const currentPositionMs = lastPositionRef.current;
    const currentPositionSec = Math.floor(currentPositionMs / 1000);

    // Only save if user listened past 5 seconds
    if (currentPositionSec < 5) return;

    hasSavedRef.current = true;

    try {
      await updateAudiobookProgress({
        bookId,
        currentPositionSec,
      }).unwrap();
    } catch (error) {
      console.warn('[useAudiobookPlayer] Failed to save progress:', error);
      hasSavedRef.current = false;
    }
  }, [bookId, updateAudiobookProgress]);

  // Handle back navigation with progress save
  const handleBack = useCallback(async () => {
    await saveProgress();
    router.back();
  }, [saveProgress, router]);

  // Reset refs when bookId changes
  useEffect(() => {
    hasSavedRef.current = false;
    lastPositionRef.current = 0;
  }, [bookId]);

  // Save on unmount
  useEffect(() => {
    return () => {
      if (!hasSavedRef.current) {
        saveProgress();
      }
    };
  }, [saveProgress]);

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
