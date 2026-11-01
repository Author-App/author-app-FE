import * as Sentry from '@sentry/react-native';
import { extractErrorMessage, handleApiError } from '../error.service';

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

  });

  describe('requests that never got an answer', () => {
    it('tells the user to check their connection when the request was dropped', () => {
      const error = { status: 'FETCH_ERROR', error: 'TypeError: Network request failed' };
      expect(extractErrorMessage(error)).toBe(
        'No internet connection. Please check your network.'
      );
    });

    it('tells the user to retry when the request timed out', () => {
      const error = { status: 'TIMEOUT_ERROR', error: 'AbortError' };
      expect(extractErrorMessage(error)).toBe('Request timed out. Please try again.');
    });

    // A numeric status is an answer from the server, so it must not take this branch.
    it('still shows the server message on a numeric status', () => {
      const error = { status: 400, data: { message: 'Email already in use' } };
      expect(extractErrorMessage(error)).toBe('Email already in use');
    });
  });
});

describe('handleApiError', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('does not report a dropped request', () => {
    handleApiError({ status: 'FETCH_ERROR', error: 'Network request failed' }, 'home/feed');
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  it('does not report a wrong password', () => {
    handleApiError({ status: 401, data: { message: 'Invalid credentials' } }, 'auth/login');
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  it('does not report signing up with an email that already exists', () => {
    handleApiError(
      { status: 409, data: { message: 'User with this email already exists' } },
      'auth/signup'
    );
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  // A 400 means our client sent something the server rejected. That is a defect.
  it('reports a payload the server rejected, tagged with the endpoint', () => {
    handleApiError({ status: 400, data: { message: 'Last name is required' } }, 'auth/signup');
    expect(Sentry.captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        level: 'warning',
        fingerprint: ['api-error', 'auth/signup', '400'],
        tags: expect.objectContaining({ endpoint: 'auth/signup', status_code: '400' }),
      })
    );
  });

  // 500 exactly, so a `>` instead of a `>=` in captureApiError fails this.
  it('reports a server failure at error level', () => {
    handleApiError({ status: 500, data: null }, 'print/quote');
    expect(Sentry.captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ level: 'error' })
    );
  });
});
