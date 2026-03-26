/**
 * SentryService - Singleton service for Sentry error tracking
 *
 * Design Pattern: Singleton + Facade
 * - Singleton ensures single instance across the app
 * - Facade simplifies the Sentry API into easy-to-use methods
 *
 * Usage:
 *   import { sentryService } from '@/src/services/sentry';
 *   sentryService.captureError(error);
 *   sentryService.trackNavigation('/home');
 */

import * as Sentry from '@sentry/react-native';

// ============================================================================
// Types
// ============================================================================

export interface SentryUser {
  id: string;
  email?: string;
  username?: string;
  [key: string]: unknown;
}

export interface BreadcrumbOptions {
  category: string;
  message: string;
  data?: Record<string, unknown>;
  level?: Sentry.SeverityLevel;
}

export interface CaptureOptions {
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
  level?: Sentry.SeverityLevel;
  fingerprint?: string[];
}

export type PaymentStep =
  | 'start'
  | 'create_order'
  | 'init_payment_sheet'
  | 'present_payment_sheet'
  | 'verify_payment'
  | 'success'
  | 'cancelled'
  | 'error';

// ============================================================================
// SentryService Class
// ============================================================================

class SentryService {
  private static instance: SentryService;
  private isInitialized = false;
  private currentUser: SentryUser | null = null;

  private constructor() {
    // Private constructor for singleton
  }

  /**
   * Get the singleton instance
   */
  static getInstance(): SentryService {
    if (!SentryService.instance) {
      SentryService.instance = new SentryService();
    }
    return SentryService.instance;
  }

  /**
   * Mark as initialized (called after Sentry.init)
   */
  markInitialized(): void {
    this.isInitialized = true;
  }

  /**
   * Check if Sentry is initialized
   */
  get initialized(): boolean {
    return this.isInitialized;
  }

  // ==========================================================================
  // User Management
  // ==========================================================================

  /**
   * Set the current user for error tracking
   */
  setUser(user: SentryUser | null): void {
    this.currentUser = user;

    if (user) {
      const { id, email, username, ...rest } = user;
      Sentry.setUser({
        id,
        email,
        username,
        ...rest,
      });
    } else {
      Sentry.setUser(null);
    }
  }

  /**
   * Get the current user
   */
  getUser(): SentryUser | null {
    return this.currentUser;
  }

  /**
   * Clear user on logout
   */
  clearUser(): void {
    this.setUser(null);
  }

  // ==========================================================================
  // Error Capturing
  // ==========================================================================

  /**
   * Capture an error/exception
   */
  captureError(error: Error | unknown, options: CaptureOptions = {}): string {
    const { tags, extra, level, fingerprint } = options;

    const eventId = Sentry.captureException(error, {
      tags,
      extra,
      level,
      fingerprint,
    });

    return eventId;
  }

  /**
   * Capture a message (for non-error events)
   */
  captureMessage(
    message: string,
    options: CaptureOptions = {}
  ): string {
    const { tags, extra, level = 'info', fingerprint } = options;

    const eventId = Sentry.captureMessage(message, {
      tags,
      extra,
      level,
      fingerprint,
    });

    return eventId;
  }

  /**
   * Capture an API error with structured data
   */
  captureApiError(
    endpoint: string,
    error: unknown,
    statusCode?: number
  ): string {
    return this.captureError(
      error instanceof Error ? error : new Error(`API Error: ${endpoint}`),
      {
        tags: {
          type: 'api_error',
          endpoint,
          ...(statusCode && { status_code: String(statusCode) }),
        },
        extra: {
          endpoint,
          statusCode,
          error,
        },
      }
    );
  }

  // ==========================================================================
  // Breadcrumbs (User Journey Tracking)
  // ==========================================================================

  /**
   * Add a breadcrumb (tracks user actions leading to an error)
   */
  addBreadcrumb(options: BreadcrumbOptions): void {
    Sentry.addBreadcrumb({
      category: options.category,
      message: options.message,
      data: options.data,
      level: options.level ?? 'info',
      timestamp: Date.now() / 1000,
    });
  }

  /**
   * Track navigation/screen changes
   */
  trackNavigation(
    screenName: string,
    params?: Record<string, unknown>
  ): void {
    this.addBreadcrumb({
      category: 'navigation',
      message: `Navigated to ${screenName}`,
      data: { screen: screenName, params },
      level: 'info',
    });
  }

  /**
   * Track user actions (button clicks, form submissions, etc.)
   */
  trackAction(
    action: string,
    data?: Record<string, unknown>
  ): void {
    this.addBreadcrumb({
      category: 'user_action',
      message: action,
      data,
      level: 'info',
    });
  }

  // ==========================================================================
  // Payment Flow Tracking (Critical for Stripe debugging)
  // ==========================================================================

  /**
   * Track payment flow steps with detailed breadcrumbs
   */
  trackPaymentStep(
    step: PaymentStep,
    data?: Record<string, unknown>
  ): void {
    const messages: Record<PaymentStep, string> = {
      start: 'Starting payment flow',
      create_order: 'Creating order',
      init_payment_sheet: 'Initializing payment sheet',
      present_payment_sheet: 'Presenting payment sheet',
      verify_payment: 'Verifying payment',
      success: 'Payment completed successfully',
      cancelled: 'Payment cancelled by user',
      error: 'Payment error occurred',
    };

    this.addBreadcrumb({
      category: 'payment',
      message: messages[step],
      data: { step, ...data },
      level: step === 'error' ? 'error' : 'info',
    });
  }

  /**
   * Capture a payment-specific error
   */
  capturePaymentError(
    error: Error | unknown,
    step: PaymentStep,
    context?: Record<string, unknown>
  ): string {
    return this.captureError(error, {
      tags: {
        type: 'payment_error',
        payment_step: step,
      },
      extra: {
        step,
        ...context,
      },
    });
  }

  /**
   * Capture Stripe-specific error
   */
  captureStripeError(
    stripeError: { code?: string; message?: string; type?: string },
    step: PaymentStep,
    context?: Record<string, unknown>
  ): string {
    return this.captureError(
      new Error(`Stripe Error: ${stripeError.message || 'Unknown'}`),
      {
        tags: {
          type: 'stripe_error',
          stripe_code: stripeError.code ?? 'unknown',
          stripe_type: stripeError.type ?? 'unknown',
          payment_step: step,
        },
        extra: {
          stripeError,
          step,
          ...context,
        },
      }
    );
  }

  // ==========================================================================
  // Context & Tags
  // ==========================================================================

  /**
   * Set a global tag (appears on all events)
   */
  setTag(key: string, value: string): void {
    Sentry.setTag(key, value);
  }

  /**
   * Set multiple tags at once
   */
  setTags(tags: Record<string, string>): void {
    Object.entries(tags).forEach(([key, value]) => {
      Sentry.setTag(key, value);
    });
  }

  /**
   * Set extra context data
   */
  setExtra(key: string, value: unknown): void {
    Sentry.setExtra(key, value);
  }

  /**
   * Set context (structured data group)
   */
  setContext(name: string, context: Record<string, unknown>): void {
    Sentry.setContext(name, context);
  }

  // ==========================================================================
  // Performance Monitoring
  // ==========================================================================

  /**
   * Start a performance transaction
   */
  startTransaction(
    name: string,
    op: string
  ): Sentry.Span | undefined {
    return Sentry.startInactiveSpan({ name, op });
  }

  /**
   * Wrap an async function with performance tracking
   */
  async withPerformance<T>(
    name: string,
    op: string,
    fn: () => Promise<T>
  ): Promise<T> {
    return Sentry.startSpan({ name, op }, async () => {
      return fn();
    });
  }

  // ==========================================================================
  // Utility Methods
  // ==========================================================================

  /**
   * Wrap a component with Sentry error boundary
   */
  wrap = Sentry.wrap;

  /**
   * Get the underlying Sentry instance (escape hatch)
   */
  get native(): typeof Sentry {
    return Sentry;
  }
}

// Export singleton instance
export const sentryService = SentryService.getInstance();

// Export class for testing
export { SentryService };
