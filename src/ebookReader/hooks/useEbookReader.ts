import { useEffect, useRef, useState, useCallback } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import { useRouter } from 'expo-router';

import { useLazyGetBookDetailQuery, useUpdateEbookProgressMutation } from '@/src/store/api/libraryApi';
import type { BookResponse } from '@/src/types/api/library.types';
import {
  getPdfProgress,
  savePdfProgress,
  getCachedSignedUrl,
  cacheSignedUrl,
  clearCachedSignedUrl,
} from '@/src/storage/bookProgress';
import type { ReaderStatus, ReadingProgress, ReaderBookInfo } from '../types/ebookReader.types';

const PDF_CACHE_DIR = `${FileSystem.documentDirectory}books/`;
const MIN_VALID_FILE_SIZE = 1000; // bytes

const pdfPath = (bookId: string) => `${PDF_CACHE_DIR}${bookId}.pdf`;

/**
 * Downloads to a temp file and only moves it into place on HTTP 200. downloadAsync does not throw
 * on an HTTP error, so writing straight to the final path could cache an error body or a partial
 * file that every later open would reuse.
 */
async function downloadPdf(url: string, fileUri: string, onProgress: (percent: number) => void) {
  const tempUri = `${fileUri}.download`;
  await FileSystem.makeDirectoryAsync(PDF_CACHE_DIR, { intermediates: true });
  const result = await FileSystem.createDownloadResumable(url, tempUri, {}, ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
    if (totalBytesExpectedToWrite > 0) onProgress(Math.round((totalBytesWritten / totalBytesExpectedToWrite) * 100));
  }).downloadAsync();

  if (result?.status !== 200) {
    await FileSystem.deleteAsync(tempUri, { idempotent: true });
    throw new Error(`PDF download failed with status ${result?.status}`);
  }
  await FileSystem.moveAsync({ from: tempUri, to: fileUri });
}

export function useEbookReader({ bookId }: { bookId: string | undefined }) {
  const router = useRouter();
  const [fetchBookDetail] = useLazyGetBookDetailQuery();
  const [updateEbookProgress] = useUpdateEbookProgressMutation();

  const [status, setStatus] = useState<ReaderStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [localPdfUri, setLocalPdfUri] = useState<string | null>(null);
  const [downloadPercent, setDownloadPercent] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [initialPage, setInitialPage] = useState(1);
  const [book, setBook] = useState<ReaderBookInfo | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const latestPage = useRef(1);
  const serverPage = useRef<number | null>(null);
  const localUpdatedAt = useRef(0);

  const jumpTo = (page: number) => {
    setInitialPage(page);
    setCurrentPage(page);
    latestPage.current = page;
  };

  // Newest wins: the server only moves the reader if it was read more recently elsewhere,
  // so a page saved locally (offline, or a save that failed) is never thrown away
  const applyServerProgress = useCallback(
    (bookData: Pick<BookResponse, 'progress' | 'totalPages'>) => {
      const page = bookData.progress?.currentPage;
      if (!page || page <= 0) return;
      serverPage.current = page;
      const serverReadAt = Date.parse(bookData.progress?.lastReadAt ?? '') || 0;
      if (serverReadAt <= localUpdatedAt.current) return;
      jumpTo(page);
      if (bookId && bookData.totalPages) savePdfProgress(bookId, page, bookData.totalPages);
    },
    [bookId]
  );

  useEffect(() => {
    if (!bookId) return;
    let cancelled = false;

    const toBookInfo = (b: BookResponse, fallbackUrl: string | null): ReaderBookInfo => ({
      id: b.id,
      title: b.title,
      author: b.author,
      masterUrl: b.master ?? fallbackUrl,
      hasAccess: b.hasAccess,
      totalPages: b.totalPages,
    });

    (async () => {
      try {
        setStatus('loading');
        setErrorMessage(null);

        const localProgress: ReadingProgress | null = await getPdfProgress(bookId);
        if (localProgress?.page) {
          jumpTo(localProgress.page);
          localUpdatedAt.current = localProgress.updatedAt ?? 0;
        }

        const fileUri = pdfPath(bookId);
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        const pdfExists = fileInfo.exists && (fileInfo.size ?? 0) > MIN_VALID_FILE_SIZE;
        const cachedUrl = await getCachedSignedUrl(bookId);

        // Recently opened and on disk: open now, refresh details and progress in the background
        if (cachedUrl && pdfExists) {
          if (cancelled) return;
          setBook({ id: bookId, title: '', author: '', masterUrl: cachedUrl, hasAccess: true });
          setLocalPdfUri(fileUri);
          setStatus('ready');
          fetchBookDetail(bookId).then((result) => {
            const b = result.data?.data?.book;
            if (!b || cancelled) return;
            setBook(toBookInfo(b, cachedUrl));
            applyServerProgress(b);
          });
          return;
        }

        const bookData = (await fetchBookDetail(bookId).unwrap())?.data?.book;
        if (cancelled) return;
        if (!bookData) {
          setStatus('error');
          setErrorMessage('Book not found');
          return;
        }

        setBook(toBookInfo(bookData, null));
        applyServerProgress(bookData);

        if (!bookData.master) {
          setStatus(bookData.hasAccess ? 'error' : 'no-access');
          setErrorMessage(
            bookData.hasAccess ? 'This book is not available for reading yet' : 'You need to buy this book to read it'
          );
          return;
        }

        await cacheSignedUrl(bookId, bookData.master);

        if (!pdfExists) {
          setDownloadPercent(0);
          setStatus('downloading');
          await downloadPdf(bookData.master, fileUri, (percent) => !cancelled && setDownloadPercent(percent));
        }

        if (cancelled) return;
        setLocalPdfUri(fileUri);
        setStatus('ready');
      } catch (err) {
        console.error('[useEbookReader] Error:', err);
        if (cancelled) return;
        setStatus('error');
        setErrorMessage('Failed to load the book. Please try again.');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [bookId, fetchBookDetail, applyServerProgress, reloadKey]);

  const refetch = useCallback(() => setReloadKey((key) => key + 1), []);

  const onPageChanged = useCallback(
    (page: number, pages: number) => {
      setCurrentPage(page);
      setTotalPages(pages);
      if (bookId && page !== latestPage.current) {
        latestPage.current = page;
        localUpdatedAt.current = Date.now();
        savePdfProgress(bookId, page, pages);
      }
    },
    [bookId]
  );

  const saveToServer = useCallback(async () => {
    const page = latestPage.current;
    if (!bookId || page <= 0 || page === serverPage.current) return;
    try {
      await updateEbookProgress({ bookId, currentPage: page }).unwrap();
      serverPage.current = page;
    } catch (error) {
      console.warn('[useEbookReader] Failed to save progress to server:', error);
    }
  }, [bookId, updateEbookProgress]);

  // Swipe back and the Android back button skip saveProgressAndGoBack, so save on unmount too
  useEffect(() => () => void saveToServer(), [saveToServer]);

  const saveProgressAndGoBack = useCallback(async () => {
    await saveToServer();
    router.back();
  }, [saveToServer, router]);

  // A file that cannot be rendered is deleted, so Retry downloads a fresh copy instead of reopening it
  const onPdfError = useCallback(
    (error: object) => {
      console.error('[useEbookReader] PDF error:', error);
      if (bookId) {
        FileSystem.deleteAsync(pdfPath(bookId), { idempotent: true });
        clearCachedSignedUrl(bookId);
      }
      setStatus('error');
      setErrorMessage('This book could not be opened. Please try again.');
    },
    [bookId]
  );

  const progressPercent = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;

  return {
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
  };
}
