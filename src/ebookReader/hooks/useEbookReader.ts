import { useEffect, useRef, useState, useCallback } from 'react';
import * as FileSystem from 'expo-file-system/legacy';

import { useLazyGetBookDetailQuery } from '@/src/store/api/libraryApi';
import { 
  getPdfProgress, 
  savePdfProgress,
  getCachedSignedUrl,
  cacheSignedUrl,
} from '@/src/storage/bookProgress';
import type { 
  ReaderStatus, 
  ReadingProgress,
  ReaderBookInfo,
} from '../types/ebookReader.types';

const PDF_CACHE_DIR = 'books/';
const MIN_VALID_FILE_SIZE = 1000; // bytes


interface UseEbookReaderOptions {
  bookId: string | undefined;
}

interface UseEbookReaderReturn {
  // Book info
  book: ReaderBookInfo | null;
  
  // Reader state
  status: ReaderStatus;
  errorMessage: string | null;
  localPdfUri: string | null;
  
  // Progress
  currentPage: number;
  totalPages: number;
  initialPage: number;
  progressPercent: number;
  
  // Actions
  onPageChanged: (page: number, pages: number) => void;
  onPdfError: (error: object) => void;
  refetch: () => void;
}

export function useEbookReader({ bookId }: UseEbookReaderOptions): UseEbookReaderReturn {

  const [fetchBookDetail, { data, isLoading: isFetchingBook }] = useLazyGetBookDetailQuery();

  const [status, setStatus] = useState<ReaderStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [localPdfUri, setLocalPdfUri] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [initialPage, setInitialPage] = useState(1);
  const [book, setBook] = useState<ReaderBookInfo | null>(null);

  // Refs
  const lastSavedPage = useRef(1);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!bookId || isInitialized.current) return;
    isInitialized.current = true;

    (async () => {
      try {
        setStatus('loading');

        // 1. Load reading progress
        const progress: ReadingProgress | null = await getPdfProgress(bookId);
        if (progress?.page) {
          setInitialPage(progress.page);
          setCurrentPage(progress.page);
          lastSavedPage.current = progress.page;
        }

        // 2. Check for cached signed URL (valid for ~55 min)
        const cachedUrl = await getCachedSignedUrl(bookId);
        
        // 3. Check if PDF is already downloaded
        const dir = `${FileSystem.documentDirectory}${PDF_CACHE_DIR}`;
        const fileUri = `${dir}${bookId}.pdf`;
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        const pdfExists = fileInfo.exists && (fileInfo.size ?? 0) > MIN_VALID_FILE_SIZE;

        // 4. If we have cached URL AND PDF file exists, we're ready!
        if (cachedUrl && pdfExists) {
          setBook({ id: bookId, title: '', author: '', masterUrl: cachedUrl, hasAccess: true });
          setLocalPdfUri(fileUri);
          setStatus('ready');
          
          // Fetch book details in background for title/author (but don't wait)
          fetchBookDetail(bookId).then((result) => {
            if (result.data?.data?.book) {
              const b = result.data.data.book;
              setBook({
                id: b.id,
                title: b.title,
                author: b.author,
                masterUrl: b.master ?? cachedUrl,
                hasAccess: b.hasAccess,
                totalPages: b.totalPages,
              });
            }
          });
          return;
        }

        // 5. Need to fetch fresh URL from API
        const result = await fetchBookDetail(bookId).unwrap();
        const bookData = result?.data?.book;

        if (!bookData) {
          setStatus('error');
          setErrorMessage('Book not found');
          return;
        }

        setBook({
          id: bookData.id,
          title: bookData.title,
          author: bookData.author,
          masterUrl: bookData.master ?? null,
          hasAccess: bookData.hasAccess,
          totalPages: bookData.totalPages,
        });

        // 6. Check access
        if (!bookData.master) {
          if (!bookData.hasAccess) {
            setStatus('no-access');
            setErrorMessage('You need to purchase this book to read it');
          } else {
            setStatus('error');
            setErrorMessage('This book is not available for reading yet');
          }
          return;
        }

        // 7. Cache the new signed URL
        await cacheSignedUrl(bookId, bookData.master);

        // 8. Download PDF if needed
        setStatus('downloading');
        await FileSystem.makeDirectoryAsync(dir, { intermediates: true });

        if (!pdfExists) {
          await FileSystem.downloadAsync(bookData.master, fileUri);
        }

        setLocalPdfUri(fileUri);
        setStatus('ready');

      } catch (err) {
        console.error('[useEbookReader] Error:', err);
        setStatus('error');
        setErrorMessage('Failed to load book. Please try again.');
      }
    })();
  }, [bookId, fetchBookDetail]);

  const refetch = useCallback(async () => {
    if (!bookId) return;
    
    isInitialized.current = false;
    setStatus('loading');
    
    // Clear cached URL to force refresh
    await cacheSignedUrl(bookId, ''); // This will be invalid and trigger refetch
  }, [bookId]);

  const onPageChanged = useCallback((page: number, pages: number) => {
    setCurrentPage(page);
    setTotalPages(pages);

    if (bookId && page !== lastSavedPage.current) {
      lastSavedPage.current = page;
      savePdfProgress(bookId, page, pages);
    }
  }, [bookId]);

  const onPdfError = useCallback((error: object) => {
    console.error('[useEbookReader] PDF error:', error);
    setStatus('error');
    setErrorMessage('Failed to load PDF. The file may be corrupted.');
  }, []);

  const progressPercent = totalPages > 0 
    ? Math.round((currentPage / totalPages) * 100) 
    : 0;
  
  return {
    // Book info
    book,
    
    // Reader state
    status,
    errorMessage,
    localPdfUri,
    
    // Progress
    currentPage,
    totalPages,
    initialPage,
    progressPercent,
    
    // Actions
    onPageChanged,
    onPdfError,
    refetch,
  };
}
