import * as Sentry from '@sentry/react-native';
import * as Updates from 'expo-updates';

// Public by design: a DSN ships inside every build and only accepts events.
const SENTRY_DSN =
  'https://a40a79f14db0d784bc8d0c0cde25a692@o4510721974403072.ingest.us.sentry.io/4510721976303616';

const ENABLE_IN_DEV = false;

// SentryNavigationTracker hands this the navigation container. Without that call
// the integration loads but never starts a transaction.
export const navigationIntegration = Sentry.reactNavigationIntegration({
  // Time to initial display needs native support that is not in this build.
  enableTimeToInitialDisplay: false,
});

// The EAS channel is the environment: 'preview' for testers, 'production' for the store.
function resolveEnvironment(): string {
  if (__DEV__) return 'development';
  try {
    return Updates.channel || 'unknown';
  } catch {
    return 'unknown';
  }
}

let hasInitialized = false;

export function initSentry(): void {
  // The root layout module was evaluated twice in production, which started two
  // clients and sent every breadcrumb and event twice.
  if (hasInitialized) return;
  if (__DEV__ && !ENABLE_IN_DEV) return;

  hasInitialized = true;
  const environment = resolveEnvironment();

  Sentry.init({
    dsn: SENTRY_DSN,
    environment,
    // Testers are few, so keep every trace. Production is sampled to stay in quota.
    tracesSampleRate: environment === 'production' ? 0.2 : 1.0,
    // Lets Sentry count affected users on events from people who are not logged in.
    sendDefaultPii: true,
    integrations: [navigationIntegration],
    beforeSend(event) {
      if (event.request?.headers) {
        delete event.request.headers['Authorization'];
        delete event.request.headers['authorization'];
      }
      return event;
    },
    // Touch breadcrumbs name the rendered element, never the label, so a trail
    // reads "ExpoLinearGradient, ExpoLinearGradient, TextInput" and says nothing.
    beforeBreadcrumb: (breadcrumb) =>
      breadcrumb.category === 'touch' ? null : breadcrumb,
    // Only reaches events whose final message matches. Anything rewritten before
    // it is sent, like captureApiError does, has to be filtered at the call site.
    ignoreErrors: [
      'Network request failed',
      'Failed to fetch',
      'cancelled',
      'Canceled',
      'AbortError',
    ],
  });
}
