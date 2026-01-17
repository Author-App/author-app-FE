/**
 * useSentry - React hook for Sentry integration
 *
 * Provides easy access to Sentry functionality within React components.
 *
 * Usage:
 *   const { captureError, trackAction, setUser } = useSentry();
 *   
 *   // Track a button click
 *   trackAction('Purchase button clicked', { bookId: '123' });
 *   
 *   // Capture an error
 *   try { ... } catch (e) { captureError(e); }
 */

import { useCallback, useMemo } from 'react';
import {
  sentryService,
  SentryUser,
  BreadcrumbOptions,
  CaptureOptions,
  PaymentStep,
} from './SentryService';

export interface UseSentryReturn {
  // User Management
  setUser: (user: SentryUser | null) => void;
  clearUser: () => void;

  // Error Capturing
  captureError: (error: Error | unknown, options?: CaptureOptions) => string;
  captureMessage: (message: string, options?: CaptureOptions) => string;
  captureApiError: (endpoint: string, error: unknown, statusCode?: number) => string;

  // Breadcrumbs
  addBreadcrumb: (options: BreadcrumbOptions) => void;
  trackNavigation: (screenName: string, params?: Record<string, unknown>) => void;
  trackAction: (action: string, data?: Record<string, unknown>) => void;

  // Payment Flow
  trackPaymentStep: (step: PaymentStep, data?: Record<string, unknown>) => void;
  capturePaymentError: (error: Error | unknown, step: PaymentStep, context?: Record<string, unknown>) => string;
  captureStripeError: (stripeError: { code?: string; message?: string; type?: string }, step: PaymentStep, context?: Record<string, unknown>) => string;

  // Context & Tags
  setTag: (key: string, value: string) => void;
  setTags: (tags: Record<string, string>) => void;
  setContext: (name: string, context: Record<string, unknown>) => void;

  // Performance
  withPerformance: <T>(name: string, op: string, fn: () => Promise<T>) => Promise<T>;
}

export function useSentry(): UseSentryReturn {
  // User Management
  const setUser = useCallback((user: SentryUser | null) => {
    sentryService.setUser(user);
  }, []);

  const clearUser = useCallback(() => {
    sentryService.clearUser();
  }, []);

  // Error Capturing
  const captureError = useCallback(
    (error: Error | unknown, options?: CaptureOptions) => {
      return sentryService.captureError(error, options);
    },
    []
  );

  const captureMessage = useCallback(
    (message: string, options?: CaptureOptions) => {
      return sentryService.captureMessage(message, options);
    },
    []
  );

  const captureApiError = useCallback(
    (endpoint: string, error: unknown, statusCode?: number) => {
      return sentryService.captureApiError(endpoint, error, statusCode);
    },
    []
  );

  // Breadcrumbs
  const addBreadcrumb = useCallback((options: BreadcrumbOptions) => {
    sentryService.addBreadcrumb(options);
  }, []);

  const trackNavigation = useCallback(
    (screenName: string, params?: Record<string, unknown>) => {
      sentryService.trackNavigation(screenName, params);
    },
    []
  );

  const trackAction = useCallback(
    (action: string, data?: Record<string, unknown>) => {
      sentryService.trackAction(action, data);
    },
    []
  );

  // Payment Flow
  const trackPaymentStep = useCallback(
    (step: PaymentStep, data?: Record<string, unknown>) => {
      sentryService.trackPaymentStep(step, data);
    },
    []
  );

  const capturePaymentError = useCallback(
    (error: Error | unknown, step: PaymentStep, context?: Record<string, unknown>) => {
      return sentryService.capturePaymentError(error, step, context);
    },
    []
  );

  const captureStripeError = useCallback(
    (
      stripeError: { code?: string; message?: string; type?: string },
      step: PaymentStep,
      context?: Record<string, unknown>
    ) => {
      return sentryService.captureStripeError(stripeError, step, context);
    },
    []
  );

  // Context & Tags
  const setTag = useCallback((key: string, value: string) => {
    sentryService.setTag(key, value);
  }, []);

  const setTags = useCallback((tags: Record<string, string>) => {
    sentryService.setTags(tags);
  }, []);

  const setContext = useCallback(
    (name: string, context: Record<string, unknown>) => {
      sentryService.setContext(name, context);
    },
    []
  );

  // Performance
  const withPerformance = useCallback(
    <T,>(name: string, op: string, fn: () => Promise<T>) => {
      return sentryService.withPerformance(name, op, fn);
    },
    []
  );

  return useMemo(
    () => ({
      // User Management
      setUser,
      clearUser,

      // Error Capturing
      captureError,
      captureMessage,
      captureApiError,

      // Breadcrumbs
      addBreadcrumb,
      trackNavigation,
      trackAction,

      // Payment Flow
      trackPaymentStep,
      capturePaymentError,
      captureStripeError,

      // Context & Tags
      setTag,
      setTags,
      setContext,

      // Performance
      withPerformance,
    }),
    [
      setUser,
      clearUser,
      captureError,
      captureMessage,
      captureApiError,
      addBreadcrumb,
      trackNavigation,
      trackAction,
      trackPaymentStep,
      capturePaymentError,
      captureStripeError,
      setTag,
      setTags,
      setContext,
      withPerformance,
    ]
  );
}
