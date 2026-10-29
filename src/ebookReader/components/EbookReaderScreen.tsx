import React, { useEffect, useState } from 'react';
import { AccessibilityInfo, ActivityIndicator, StatusBar, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { YStack, getTokenValue } from 'tamagui';
import Pdf from 'react-native-pdf';

import UText from '@/src/components/core/text/uText';
import UBackButton from '@/src/components/core/buttons/uBackButton';
import UEmptyState from '@/src/components/core/feedback/UEmptyState';
import UScreenError from '@/src/components/core/feedback/UScreenError';
import { useEbookReader } from '../hooks/useEbookReader';
import { ReaderHeader } from './ReaderHeader';
import { ReaderFooter } from './ReaderFooter';

/** Dark surface around white pages, chrome that hides on a tap. */
export function EbookReaderScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const { top, bottom } = useSafeAreaInsets();
  const [chromeVisible, setChromeVisible] = useState(true);
  const [isScreenReaderOn, setScreenReaderOn] = useState(false);

  const {
    book,
    status,
    errorMessage,
    localPdfUri,
    downloadPercent,
    currentPage,
    totalPages,
    initialPage,
    progressPercent,
    onPageChanged,
    onPdfError,
    saveProgressAndGoBack,
    refetch,
  } = useEbookReader({ bookId });

  // Hidden chrome would hide the back button from VoiceOver, so it stays up while a screen reader runs
  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(setScreenReaderOn);
    const sub = AccessibilityInfo.addEventListener('screenReaderChanged', setScreenReaderOn);
    return () => sub.remove();
  }, []);

  const showChrome = chromeVisible || isScreenReaderOn;

  const backButton = (
    <YStack pos="absolute" top={top + 8} left={16} zIndex={2}>
      <UBackButton variant="glass-md" />
    </YStack>
  );

  if (status === 'loading' || status === 'downloading') {
    return (
      <YStack flex={1} bg="$bgReading" ai="center" jc="center" gap={14}>
        <StatusBar barStyle="light-content" />
        {backButton}
        <ActivityIndicator size="large" color={getTokenValue('$accentCyan', 'color')} />
        <UText variant="meta" color="$textSecondary" accessibilityLiveRegion="polite">
          {status === 'downloading' ? `Downloading ${downloadPercent}%` : 'Opening book'}
        </UText>
      </YStack>
    );
  }

  if (status === 'no-access') {
    return (
      <YStack flex={1} bg="$bgReading" jc="center" pt={top}>
        <StatusBar barStyle="light-content" />
        {backButton}
        <UEmptyState icon="lock-closed-outline" title="Not in your library" message={errorMessage ?? undefined} />
      </YStack>
    );
  }

  if (status === 'error' || !localPdfUri) {
    return (
      <YStack flex={1} bg="$bgReading" pt={top} pb={bottom}>
        <StatusBar barStyle="light-content" />
        {backButton}
        <UScreenError message={errorMessage ?? 'Something went wrong'} onRetry={refetch} />
      </YStack>
    );
  }

  return (
    <YStack flex={1} bg="$bgReading">
      <StatusBar barStyle="light-content" hidden={!showChrome} animated />

      <Pdf
        source={{ uri: localPdfUri }}
        page={initialPage}
        onLoadComplete={(pages) => onPageChanged(currentPage, pages)}
        onPageChanged={onPageChanged}
        onPageSingleTap={() => setChromeVisible((visible) => !visible)}
        onError={onPdfError}
        style={[styles.pdf, { backgroundColor: getTokenValue('$bgReading', 'color') }]}
        trustAllCerts={false}
        enablePaging
        horizontal
      />

      {showChrome && (
        <>
          <ReaderHeader
            title={book?.title ?? ''}
            author={book?.author ?? ''}
            paddingTop={top}
            onBack={saveProgressAndGoBack}
          />
          <ReaderFooter
            currentPage={currentPage}
            totalPages={totalPages}
            progressPercent={progressPercent}
            paddingBottom={bottom}
          />
        </>
      )}
    </YStack>
  );
}

const styles = StyleSheet.create({
  pdf: { flex: 1 },
});
