import { useEffect } from 'react';
import { useNavigationContainerRef } from 'expo-router';
import { navigationIntegration } from './initSentry';

export function SentryNavigationTracker(): null {
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    if (!navigationRef) return;
    navigationIntegration.registerNavigationContainer(navigationRef);
  }, [navigationRef]);

  return null;
}
