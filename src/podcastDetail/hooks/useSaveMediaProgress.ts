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
    console.log('🎯 [saveProgress] Called | mediaId:', mediaId, '| hasSaved:', hasSavedRef.current);
    
    // Guard: no mediaId, already saved, or ref not available
    if (!mediaId || hasSavedRef.current || !progressRef.current) {
      console.log('⏭️ [saveProgress] Skipping - guard failed');
      return;
    }

    const currentPositionMs = progressRef.current.position;
    const currentPositionSec = Math.floor(currentPositionMs / 1000);

    console.log('📍 [saveProgress] Position:', currentPositionSec, 'sec | Threshold:', minSecondsThreshold, 'sec');

    // Only save if user listened past the threshold
    if (currentPositionSec < minSecondsThreshold) {
      console.log('⏭️ [saveProgress] Skipping - under threshold');
      return;
    }

    // Mark as saved to prevent duplicates
    hasSavedRef.current = true;

    console.log('💾 [saveProgress] Saving progress:', currentPositionSec, 'seconds');

    try {
      await onBeforeSave?.();
      await updateProgress({
        mediaId,
        currentPositionSec,
      }).unwrap();
      console.log('✅ [saveProgress] Progress saved successfully!');
    } catch (error) {
      console.error('❌ [saveProgress] Failed to save:', error);
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
