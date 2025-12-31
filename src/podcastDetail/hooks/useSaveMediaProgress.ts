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
  progressRef: React.MutableRefObject<ProgressData>,
  options: UseSaveMediaProgressOptions = {}
) {
  const { minSecondsThreshold = 5, onBeforeSave } = options;
  
  const router = useRouter();
  const [updateProgress] = useUpdateMediaProgressMutation();
  const hasSavedRef = useRef(false);

  // Save progress to API
  const saveProgress = useCallback(async () => {
    // Guard: no mediaId, already saved, or ref not available
    if (!mediaId || hasSavedRef.current || !progressRef.current) {
      return;
    }

    const currentPositionMs = progressRef.current.position;
    const currentPositionSec = Math.floor(currentPositionMs / 1000);

    // Only save if user listened past the threshold
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
  }, [mediaId, progressRef, minSecondsThreshold, onBeforeSave, updateProgress]);

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
  }, [mediaId]);

  return {
    saveProgress,
    handleBack,
  };
}
