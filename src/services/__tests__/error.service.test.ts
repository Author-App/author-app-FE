import { extractErrorMessage } from '../error.service';

describe('extractErrorMessage', () => {
  describe('API errors from the server', () => {
    it('shows the message the server sent', () => {
      const error = { status: 401, data: { message: 'Invalid credentials' } };
      expect(extractErrorMessage(error)).toBe('Invalid credentials');
    });

    it('falls back when the server sends no message', () => {
      const error = { status: 500, data: {} };
      expect(extractErrorMessage(error)).toBe('Request failed. Please try again.');
    });

    // data: null passes the type guard because typeof null === 'object'.
    it('falls back when data is null instead of crashing', () => {
      const error = { status: 500, data: null };
      expect(extractErrorMessage(error)).toBe('Request failed. Please try again.');
    });
  });

  describe('thrown Error objects', () => {
    it('tells the user to check their connection on a network error', () => {
      expect(extractErrorMessage(new Error('Network request failed'))).toBe(
        'No internet connection. Please check your network.'
      );
    });

    it('tells the user to retry on a timeout', () => {
      expect(extractErrorMessage(new Error('Request Timeout'))).toBe(
        'Request timed out. Please try again.'
      );
    });

    it('passes any other error message through unchanged', () => {
      expect(extractErrorMessage(new Error('Book not found'))).toBe('Book not found');
    });

    // 'network' is checked before 'timeout', so a message with both words is treated as offline.
    it('prefers the connection message when the text mentions both network and timeout', () => {
      expect(extractErrorMessage(new Error('Network request timed out'))).toBe(
        'No internet connection. Please check your network.'
      );
    });
  });

  describe('everything else', () => {
    it('returns a plain string error as-is', () => {
      expect(extractErrorMessage('Session expired')).toBe('Session expired');
    });

    it('falls back for null, undefined and numbers', () => {
      const fallback = 'Something went wrong. Please try again.';
      expect(extractErrorMessage(null)).toBe(fallback);
      expect(extractErrorMessage(undefined)).toBe(fallback);
      expect(extractErrorMessage(404)).toBe(fallback);
    });

    // Current behaviour, not desired behaviour: an offline RTK Query rejection has no
    // `data` key and is not an Error instance, so it never reaches the network branch above.
    it('falls back on a real offline RTK Query error', () => {
      const error = { status: 'FETCH_ERROR', error: 'TypeError: Network request failed' };
      expect(extractErrorMessage(error)).toBe('Something went wrong. Please try again.');
    });
  });
});
