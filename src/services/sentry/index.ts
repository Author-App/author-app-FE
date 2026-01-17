/**
 * Sentry Service - Central export for all Sentry functionality
 *
 * Architecture:
 * - SentryService: Singleton service with all Sentry methods (Facade pattern)
 * - useSentry: React hook for component-level access
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
 * 2. Use hook in components:
 *    const { captureError, trackAction } = useSentry();
 *    trackAction('Button clicked', { buttonId: 'purchase' });
 *
 * 3. Use service directly (non-React code):
 *    import { sentryService } from '@/src/services/sentry';
 *    sentryService.captureError(error);
 *
 * 4. Wrap app with error boundary:
 *    <SentryErrorBoundary>
 *      <App />
 *    </SentryErrorBoundary>
 *
 * 5. Track navigation:
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

// React Hook
export { useSentry } from './useSentry';
export type { UseSentryReturn } from './useSentry';

// Components
export { SentryErrorBoundary } from './SentryErrorBoundary';
export { SentryErrorFallback } from './SentryErrorFallback';
export { SentryNavigationTracker } from './SentryNavigationTracker';
export { SentryUserSync } from './SentryUserSync';

// Initialization
export { initSentry } from './initSentry';
export type { SentryConfig } from './initSentry';

// Re-export Sentry.wrap for wrapping the root component
export { wrap as sentryWrap } from '@sentry/react-native';
