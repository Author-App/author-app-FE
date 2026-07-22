/**
 * NotificationDeepLinkHandler
 * 
 * Handles notification deep linking at the root level:
 * - Killed-state taps via getLastNotificationResponseAsync (once per launch)
 * - Live taps via addNotificationResponseReceivedListener
 * - Queues auth-gated navigations until auth resolves
 */

import { useEffect, useRef } from 'react';
import { useRootNavigationState, router, Href } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { useSelector } from 'react-redux';
import { selectAuthToken, selectIsLoggedIn } from '@/src/store/selectors/authSelectors';
import { sentryService } from '@/src/services/sentry';

interface DeepLinkData {
  screen?: string;
  id?: string;
}

/**
 * Maps { screen, id } to the correct route string
 * Handles both path-segment and query-param routes
 */
const buildRouteFromData = (data: DeepLinkData): string | null => {
  const { screen, id } = data;
  
  if (!screen) {
    if (__DEV__) {
      console.log('📱 [DeepLink] No screen in notification data');
    }
    return null;
  }

  // Map screen name to route pattern
  switch (screen) {
    case 'book':
      return id ? `/(app)/book/${id}` : null;
    
    case 'article':
      return id ? `/(app)/article/${id}` : null;
    
    case 'podcast':
      return id ? `/(app)/podcast/${id}` : null;
    
    case 'video':
      return id ? `/(app)/video/${id}` : null;
    
    case 'audiobook':
      // Query param, not path segment
      return id ? `/(app)/audiobookPlayer?bookId=${id}` : null;
    
    case 'ebook':
      // Query param, not path segment
      return id ? `/(app)/ebookReader?bookId=${id}` : null;
    
    case 'event':
      return id ? `/(app)/events/${id}` : null;
    
    case 'community':
      return id ? `/(app)/community/${id}` : null;
    
    case 'subscription':
      return '/(app)/subscription';
    
    default:
      if (__DEV__) {
        console.log(`📱 [DeepLink] Unknown screen type: ${screen}`);
      }
      sentryService.addBreadcrumb({
        category: 'notification',
        message: `Unknown notification screen type: ${screen}`,
        level: 'warning',
      });
      return null;
  }
};

/**
 * Check if a route requires authentication
 * All (app)/ routes are auth-gated
 */
const isAuthGatedRoute = (route: string): boolean => {
  return route.startsWith('/(app)');
};

/**
 * Extract deep link data from notification response
 */
const extractDeepLinkData = (
  response: Notifications.NotificationResponse
): DeepLinkData | null => {
  const data = response.notification.request.content.data as Record<string, unknown>;
  
  if (!data) return null;
  
  return {
    screen: typeof data.screen === 'string' ? data.screen : undefined,
    id: typeof data.id === 'string' ? data.id : undefined,
  };
};

export function NotificationDeepLinkHandler(): null {
  // Router readiness
  const rootNavigationState = useRootNavigationState();
  const isRouterReady = !!rootNavigationState?.key;
  
  // Auth state
  const token = useSelector(selectAuthToken);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isAuthenticated = !!token && isLoggedIn;
  
  // Guards
  const hasHandledInitialResponse = useRef(false);
  const handledResponseId = useRef<string | null>(null);
  
  // Pending navigation for auth-gated screens
  const pendingNavigation = useRef<string | null>(null);

  // Handle killed-state tap (once per launch)
  useEffect(() => {
    if (!isRouterReady) return;
    if (hasHandledInitialResponse.current) return;

    const handleInitialResponse = async () => {
      try {
        const response = await Notifications.getLastNotificationResponseAsync();
        
        if (!response) {
          hasHandledInitialResponse.current = true;
          return;
        }

        const responseId = response.notification.request.identifier;
        
        sentryService.addBreadcrumb({
          category: 'notification',
          message: 'Killed-state notification tap detected',
          data: { responseId },
          level: 'info',
        });

        const data = extractDeepLinkData(response);
        if (!data) {
          hasHandledInitialResponse.current = true;
          return;
        }

        const route = buildRouteFromData(data);
        if (!route) {
          hasHandledInitialResponse.current = true;
          return;
        }

        // Mark as handled before navigating
        hasHandledInitialResponse.current = true;
        handledResponseId.current = responseId;

        // Check if route is auth-gated
        if (isAuthGatedRoute(route)) {
          if (isAuthenticated) {
            if (__DEV__) {
              console.log(`📱 [DeepLink] Navigating (killed-state, authed): ${route}`);
            }
            router.push(route as Href);
          } else {
            // Queue for when auth resolves
            if (__DEV__) {
              console.log(`📱 [DeepLink] Queueing auth-gated route: ${route}`);
            }
            pendingNavigation.current = route;
          }
        } else {
          // Public route, navigate immediately
          if (__DEV__) {
            console.log(`📱 [DeepLink] Navigating (killed-state, public): ${route}`);
          }
          router.push(route as Href);
        }
      } catch (error) {
        sentryService.captureError(error, {
          tags: { type: 'notification_error' },
          extra: { action: 'handleInitialResponse' },
        });
        hasHandledInitialResponse.current = true;
      }
    };

    handleInitialResponse();
  }, [isRouterReady, isAuthenticated]);

  // Execute pending navigation when auth resolves
  useEffect(() => {
    if (!isRouterReady) return;
    if (!isAuthenticated) return;
    if (!pendingNavigation.current) return;

    const route = pendingNavigation.current;
    pendingNavigation.current = null;

    if (__DEV__) {
      console.log(`📱 [DeepLink] Executing pending navigation: ${route}`);
    }
    
    sentryService.addBreadcrumb({
      category: 'notification',
      message: 'Executing pending deep link after auth',
      data: { route },
      level: 'info',
    });

    router.push(route as Href);
  }, [isRouterReady, isAuthenticated]);

  // Live tap listener (foreground/background, app already running)
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const responseId = response.notification.request.identifier;

        // Skip if this is the same response we handled on cold start
        if (handledResponseId.current === responseId) {
          if (__DEV__) {
            console.log('📱 [DeepLink] Skipping duplicate response (already handled)');
          }
          return;
        }

        if (__DEV__) {
          console.log('📱 [DeepLink] Live notification tap:', responseId);
        }

        sentryService.addBreadcrumb({
          category: 'notification',
          message: 'Live notification tap',
          data: { responseId },
          level: 'info',
        });

        const data = extractDeepLinkData(response);
        if (!data) return;

        const route = buildRouteFromData(data);
        if (!route) return;

        handledResponseId.current = responseId;

        // Check if route is auth-gated
        if (isAuthGatedRoute(route)) {
          if (isAuthenticated) {
            if (__DEV__) {
              console.log(`📱 [DeepLink] Navigating (live, authed): ${route}`);
            }
            router.push(route as Href);
          } else {
            // Queue for when auth resolves
            if (__DEV__) {
              console.log(`📱 [DeepLink] Queueing auth-gated route: ${route}`);
            }
            pendingNavigation.current = route;
          }
        } else {
          if (__DEV__) {
            console.log(`📱 [DeepLink] Navigating (live, public): ${route}`);
          }
          router.push(route as Href);
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [isAuthenticated]);

  // This component renders nothing
  return null;
}
