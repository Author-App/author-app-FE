import React, { memo, ErrorInfo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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

// Raw values of the tamagui.config.ts tokens, named after them
const COLORS = {
  bgPage: '#020103',
  textPrimary: '#FFFFFF',
  textSecondary: '#D1D5DB',
  textMuted: '#9CA3AF',
  errorText: '#FCA5A5',
  glass: 'rgba(15,12,35,0.6)',
  glassBorder: 'rgba(255,255,255,0.08)',
  ctaStart: '#7C3AED',
  ctaEnd: '#0E7490',
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
      <View style={styles.iconCircle}>
        <Feather name="alert-triangle" size={30} color={COLORS.errorText} />
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
      <TouchableOpacity onPress={onRetry} activeOpacity={0.85} accessibilityRole="button" style={styles.retryShadow}>
        <LinearGradient
          colors={[COLORS.ctaStart, COLORS.ctaEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.retryButton}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPage,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(248,113,113,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.4)',
  },
  textContainer: {
    alignItems: 'center',
    gap: 8,
  },
  // System fonts: this can render before the font provider has loaded anything
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  errorDetails: {
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    borderRadius: 14,
    padding: 12,
    maxWidth: 350,
    maxHeight: 200,
  },
  errorLabel: {
    fontSize: 12,
    color: COLORS.errorText,
    fontWeight: '600',
    marginBottom: 8,
  },
  errorScroll: {
    maxHeight: 160,
  },
  errorMessage: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontFamily: 'Menlo',
    marginBottom: 8,
  },
  stackTrace: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  retryShadow: {
    borderRadius: 999,
    boxShadow: '0 0 22px rgba(135,54,247,0.5)',
  },
  retryButton: {
    height: 52,
    paddingHorizontal: 40,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButtonText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
