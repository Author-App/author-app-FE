import React, { memo, ErrorInfo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

/**
 * CRITICAL: This component MUST NOT use Tamagui or any themed components.
 * 
 * SentryErrorBoundary is the outermost wrapper in the app and renders OUTSIDE
 * the TamaguiProvider. If this fallback uses Tamagui tokens (like $brandNavy),
 * it will throw "Missing theme" and create an infinite error loop that hangs
 * the app and causes a WatchdogTermination crash.
 * 
 * Use plain React Native components with hardcoded colors only.
 */

// Hardcoded brand colors (from tamagui.config.ts)
const COLORS = {
  brandNavy: '#0D1B2A',
  brandCrimson: '#D64550',
  brandTeal: '#7EC8E3',
  white: '#FFFFFF',
  gray: '#9CA3AF',
};

interface SentryErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showErrorDetails?: boolean;
  onRetry: () => void;
}

export const SentryErrorFallback = memo(function SentryErrorFallback({
  error,
  errorInfo,
  showErrorDetails = false,
  onRetry,
}: SentryErrorFallbackProps) {
  return (
    <View style={styles.container}>
      {/* Icon */}
      <View style={styles.iconWrapper}>
        <View style={styles.iconCircle} />
        <View style={styles.iconOverlay}>
          <Feather name="alert-triangle" size={32} color={COLORS.brandCrimson} />
        </View>
      </View>

      {/* Text Content */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.subtitle}>
          We've been notified and are working on a fix.
        </Text>
      </View>

      {/* Error Details (Development Only) */}
      {showErrorDetails && error && (
        <View style={styles.errorDetails}>
          <Text style={styles.errorLabel}>Error Details:</Text>
          <ScrollView
            style={styles.errorScroll}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.errorMessage}>{error.message}</Text>
            {errorInfo?.componentStack && (
              <Text style={styles.stackTrace} numberOfLines={8}>
                {errorInfo.componentStack}
              </Text>
            )}
          </ScrollView>
        </View>
      )}

      {/* Retry Button */}
      <TouchableOpacity
        style={styles.retryButton}
        onPress={onRetry}
        activeOpacity={0.8}
      >
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.brandNavy,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 24,
  },
  iconWrapper: {
    position: 'relative',
    width: 80,
    height: 80,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.brandCrimson,
    opacity: 0.1,
  },
  iconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.white,
    textAlign: 'center',
    fontFamily: 'PlayfairDisplay',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.brandTeal,
    textAlign: 'center',
    opacity: 0.9,
  },
  errorDetails: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    maxWidth: 350,
    maxHeight: 200,
  },
  errorLabel: {
    fontSize: 12,
    color: COLORS.brandCrimson,
    fontWeight: '600',
    marginBottom: 8,
  },
  errorScroll: {
    maxHeight: 160,
  },
  errorMessage: {
    fontSize: 12,
    color: COLORS.white,
    fontFamily: 'DMMono',
    marginBottom: 8,
  },
  stackTrace: {
    fontSize: 10,
    color: COLORS.gray,
  },
  retryButton: {
    backgroundColor: COLORS.brandCrimson,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
