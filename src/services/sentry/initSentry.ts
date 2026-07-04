import * as Sentry from '@sentry/react-native';
import { sentryService } from './SentryService';

const SENTRY_DSN =
  'https://a40a79f14db0d784bc8d0c0cde25a692@o4510721974403072.ingest.us.sentry.io/4510721976303616';

export interface SentryConfig {
  dsn?: string;
  enableInDev?: boolean;
  tracesSampleRate?: number;
}

export function initSentry(config: SentryConfig = {}): void {
  const {
    dsn = SENTRY_DSN,
    enableInDev = false,
    tracesSampleRate = 0.2,
  } = config;

  if (__DEV__ && !enableInDev) {
    console.log('[Sentry] Disabled in development mode');
    return;
  }

  Sentry.init({
    dsn,
    environment: __DEV__ ? 'development' : 'production',
    sendDefaultPii: true,
    enableLogs: true,
    tracesSampleRate,
    // Session Replay disabled - was causing crashes on reload with 
    // New Architecture + @sentry/react-native v7. Re-enable in a future 
    // native build once stable.
    integrations: [
      Sentry.feedbackIntegration(),
    ],
    beforeSend(event) {
      if (event.request?.headers) {
        delete event.request.headers['Authorization'];
        delete event.request.headers['authorization'];
      }
      return event;
    },
    ignoreErrors: [
      'Network request failed',
      'Failed to fetch',
      'cancelled',
      'Canceled',
      'AbortError',
    ],
  });

  sentryService.markInitialized();
  console.log('[Sentry] Initialized successfully');
}