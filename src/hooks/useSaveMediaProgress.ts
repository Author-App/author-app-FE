import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useUpdateMediaProgressMutation } from '@/src/store/api/mediaApi';

interface ProgressData {
  position: number;
  duration: number;
  progress: number;
}

interface UseSaveMediaProgressOptions {
  minSecondsThreshold?: number;
  onBeforeSave?: () => void | Promise<void>;
}

export function useSaveMediaProgress(
  mediaId: string | undefined,
  options: UseSaveMediaProgressOptions = {}
) {
  const { minSecondsThreshold = 5, onBeforeSave } = options;

  const router = useRouter();
  const [updateProgress] = useUpdateMediaProgressMutation();
  const hasSavedRef = useRef(false);
  const lastPositionRef = useRef(0);

  // Track progress from AudioPlayer callback
  const handleProgressUpdate = useCallback((data: ProgressData) => {
    lastPositionRef.current = data.position;
  }, []);

  // Save progress to API
  const saveProgress = useCallback(async () => {
    // Guard: no mediaId, already saved
    if (!mediaId || hasSavedRef.current) {
      return;
    }

    const currentPositionMs = lastPositionRef.current;
    const currentPositionSec = Math.floor(currentPositionMs / 1000);

    // Only save if user consumed past the threshold
    if (currentPositionSec < minSecondsThreshold) {
      return;
    }

    // Mark as saved to prevent duplicates
    hasSavedRef.current = true;

    try {
      await onBeforeSave?.();
      await updateProgress({
        mediaId,
        currentPositionSec,
      }).unwrap();
    } catch (error) {
      console.error('Failed to save progress:', error);
      // Reset flag so it can try again if needed
      hasSavedRef.current = false;
    }
  }, [mediaId, minSecondsThreshold, onBeforeSave, updateProgress]);

  // Handle back navigation with progress save
  const handleBack = useCallback(async () => {
    await saveProgress();
    router.back();
  }, [saveProgress, router]);

  // Save on unmount (swipe back, app background, etc.)
  useEffect(() => {
    return () => {
      if (!hasSavedRef.current) {
        saveProgress();
      }
    };
  }, [saveProgress]);

  // Reset saved flag when mediaId changes
  useEffect(() => {
    hasSavedRef.current = false;
    lastPositionRef.current = 0;
  }, [mediaId]);

  return {
    saveProgress,
    handleBack,
    handleProgressUpdate,
  };
}
