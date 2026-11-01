/**
 * Sentry Service - Central export for all Sentry functionality
 *
 * Architecture:
 * - SentryService: Singleton service with all Sentry methods (Facade pattern)
 * - SentryErrorBoundary: Catches React component errors
 * - SentryNavigationTracker: Tracks navigation changes
 * - initSentry: Initialize Sentry at app startup
 *
 * Usage Examples:
 *
 * 1. Initialize at app entry:
 *    import { initSentry } from '@/src/services/sentry';
 *    initSentry();
 *
 * 2. Use the service directly:
 *    import { sentryService } from '@/src/services/sentry';
 *    sentryService.captureError(error);
 *
 * 3. Wrap app with error boundary:
 *    <SentryErrorBoundary>
 *      <App />
 *    </SentryErrorBoundary>
 *
 * 4. Track navigation:
 *    <SentryNavigationTracker />
 */

// Service (Singleton)
export { sentryService, SentryService } from './SentryService';

// Types
export type {
  SentryUser,
  BreadcrumbOptions,
  CaptureOptions,
  PaymentStep,
} from './SentryService';

// Components
export { SentryErrorBoundary } from './SentryErrorBoundary';
export { SentryErrorFallback } from './SentryErrorFallback';
export { SentryNavigationTracker } from './SentryNavigationTracker';
export { SentryUserSync } from './SentryUserSync';

// Initialization
export { initSentry, navigationIntegration } from './initSentry';

// Re-export Sentry.wrap for wrapping the root component
export { wrap as sentryWrap } from '@sentry/react-native';
