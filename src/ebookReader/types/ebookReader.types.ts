export interface ReadingProgress {
  page: number;
  totalPages: number;
  percentage: number;
  updatedAt?: number;
}

export type ReaderStatus = 
  | 'loading'      // Fetching book data
  | 'downloading'  // Downloading PDF
  | 'ready'        // PDF ready to display
  | 'error'        // Error occurred
  | 'no-access';   // User doesn't have access

export interface ReaderBookInfo {
  id: string;
  title: string;
  author: string;
  masterUrl: string | null;
  hasAccess: boolean;
  totalPages?: number;
}
