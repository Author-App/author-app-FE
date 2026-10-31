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

  // ==========================================================================
  // User Management
  // ==========================================================================

  /**
   * Set the current user for error tracking
   */
  setUser(user: SentryUser | null): void {
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
        // Without this Sentry groups by stack trace, which changes with the
        // caller, so one broken endpoint becomes several issues.
        fingerprint: ['api-error', endpoint, String(statusCode ?? 'unknown')],
        level: statusCode && statusCode >= 500 ? 'error' : 'warning',
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
   * Set multiple tags at once
   */
  setTags(tags: Record<string, string>): void {
    Object.entries(tags).forEach(([key, value]) => {
      Sentry.setTag(key, value);
    });
  }

  /**
   * Set context (structured data group)
   */
  setContext(name: string, context: Record<string, unknown>): void {
    Sentry.setContext(name, context);
  }
}

// Export singleton instance
export const sentryService = SentryService.getInstance();

// Export class for testing
export { SentryService };
