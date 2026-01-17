/**
 * SentryNavigationTracker - Automatically tracks navigation changes
 **/

import { useEffect, useRef } from 'react';
import { usePathname, useSegments } from 'expo-router';
import { sentryService } from './SentryService';

export function SentryNavigationTracker(): null {
  const pathname = usePathname();
  const segments = useSegments();
  const previousPathname = useRef<string | null>(null);

  useEffect(() => {
    // Avoid tracking the same route twice
    if (pathname === previousPathname.current) {
      return;
    }

    previousPathname.current = pathname;

    // Track navigation with route segments for more context
    sentryService.trackNavigation(pathname, {
      segments,
      timestamp: new Date().toISOString(),
    });
  }, [pathname, segments]);

  // This component doesn't render anything
  return null;
}
