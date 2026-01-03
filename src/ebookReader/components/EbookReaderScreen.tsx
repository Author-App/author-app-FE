import React from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { YStack, XStack } from 'tamagui';
import Pdf from 'react-native-pdf';

import UText from '@/src/components/core/text/uText';
import UBackButton from '@/src/components/core/buttons/uBackButton';
import AppLoader from '@/src/components/core/loaders/AppLoader';
import { useEbookReader } from '../hooks/useEbookReader';
import { ReaderHeader } from './ReaderHeader';
import { ReaderFooter } from './ReaderFooter';

export function EbookReaderScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const { top, bottom } = useSafeAreaInsets();

  const {
    book,
    status,
    errorMessage,
    localPdfUri,
    currentPage,
    totalPages,
    initialPage,
    progressPercent,
    onPageChanged,
    onPdfError,
  } = useEbookReader({ bookId });


  if (status === 'loading') {
    return (
      <YStack flex={1} bg="$brandNavy" ai="center" jc="center">
        <StatusBar barStyle="light-content" />
        <AppLoader bg="transparent" />
      </YStack>
    );
  }


  if (status === 'downloading') {
    return (
      <YStack flex={1} bg="$brandNavy" ai="center" jc="center">
        <StatusBar barStyle="light-content" />
        <AppLoader bg="transparent" />
      </YStack>
    );
  }

  if (status === 'no-access') {
    return (
      <YStack flex={1} bg="$brandNavy" pt={top}>
        <StatusBar barStyle="light-content" />
        <XStack px={20} py={12}>
          <UBackButton variant="glass-md" />
        </XStack>
        <YStack flex={1} ai="center" jc="center" px={20}>
          <UText color="$neutral4" textAlign="center">
            {errorMessage || 'You need to purchase this book to read it.'}
          </UText>
        </YStack>
      </YStack>
    );
  }


  if (status === 'error' || !localPdfUri) {
    return (
      <YStack flex={1} bg="$brandNavy" pt={top}>
        <StatusBar barStyle="light-content" />
        <XStack px={20} py={12}>
          <UBackButton variant="glass-md" />
        </XStack>
        <YStack flex={1} ai="center" jc="center" px={20}>
          <UText color="$danger" textAlign="center">
            {errorMessage || 'Something went wrong'}
          </UText>
        </YStack>
      </YStack>
    );
  }
  
  return (
    <YStack flex={1} bg="$white">
      <StatusBar barStyle="dark-content" />

      <Pdf
        source={{ uri: localPdfUri }}
        page={initialPage}
        onLoadComplete={(pages) => onPageChanged(currentPage, pages)}
        onPageChanged={onPageChanged}
        onError={onPdfError}
        style={styles.pdf}
        trustAllCerts={false}
        enablePaging
        horizontal
      />

      {/* Header */}
      <ReaderHeader
        title={book?.title ?? 'Untitled'}
        author={book?.author ?? 'Unknown Author'}
        paddingTop={top}
      />

      {/* Footer */}
      <ReaderFooter
        currentPage={currentPage}
        totalPages={totalPages}
        progressPercent={progressPercent}
        paddingBottom={bottom}
      />
    </YStack>
  );
}

const styles = StyleSheet.create({
  pdf: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
});
