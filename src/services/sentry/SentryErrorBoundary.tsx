/**
 * SentryErrorBoundary - Catches React component errors
 * Usage:
 *   <SentryErrorBoundary fallback={<ErrorScreen />}>
 *     <MyComponent />
 *   </SentryErrorBoundary>
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { sentryService } from './SentryService';
import { SentryErrorFallback } from './SentryErrorFallback';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showErrorDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class SentryErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Update state with error info
    this.setState({ errorInfo });

    // Report to Sentry with component stack
    sentryService.captureError(error, {
      tags: {
        type: 'react_error_boundary',
      },
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });

    // Call optional error callback
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback, showErrorDetails = __DEV__ } = this.props;

    if (hasError) {
      // Custom fallback provided
      if (fallback) {
        return fallback;
      }

      // Default fallback UI using Tamagui
      return (
        <SentryErrorFallback
          error={error}
          errorInfo={errorInfo}
          showErrorDetails={showErrorDetails}
          onRetry={this.handleRetry}
        />
      );
    }

    return children;
  }
}
