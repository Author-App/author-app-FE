import * as Sentry from '@sentry/react-native';
import { sentryService } from './SentryService';

// Configuration
const SENTRY_DSN =
  'https://a40a79f14db0d784bc8d0c0cde25a692@o4510721974403072.ingest.us.sentry.io/4510721976303616';

export interface SentryConfig {
  dsn?: string;
  enableInDev?: boolean;
  replaysSessionSampleRate?: number;
  replaysOnErrorSampleRate?: number;
  tracesSampleRate?: number;
}

export function initSentry(config: SentryConfig = {}): void {
  const {
    dsn = SENTRY_DSN,
    enableInDev = false,
    replaysSessionSampleRate = 0.1,
    replaysOnErrorSampleRate = 1,
    tracesSampleRate = 0.2,
  } = config;

  // Skip initialization in development unless explicitly enabled
  if (__DEV__ && !enableInDev) {
    console.log('[Sentry] Disabled in development mode');
    return;
  }

  Sentry.init({
    dsn,
    environment: __DEV__ ? 'development' : 'production',
    // Adds more context data to events (IP address, cookies, user, etc.)
    sendDefaultPii: true,
    enableLogs: true,
    // Performance monitoring
    tracesSampleRate,
    // Session Replay configuration
    replaysSessionSampleRate,
    replaysOnErrorSampleRate,
    // Integrations
    integrations: [
      Sentry.mobileReplayIntegration(),
      Sentry.feedbackIntegration(),
    ],
    // Filter sensitive data before sending
    beforeSend(event) {
      // Remove authorization headers
      if (event.request?.headers) {
        delete event.request.headers['Authorization'];
        delete event.request.headers['authorization'];
      }
      return event;
    },

    // Ignore certain errors that are not actionable
    ignoreErrors: [
      // Network errors (user's connection issue)
      'Network request failed',
      'Failed to fetch',
      // User cancelled actions
      'cancelled',
      'Canceled',
      // AbortController
      'AbortError',
    ],
  });

  // Mark service as initialized
  sentryService.markInitialized();

  console.log('[Sentry] Initialized successfully');
}
