import { renderWithProviders, screen, waitFor, fireEvent } from '@/src/test-utils/render';

import { LoginScreen } from '../LoginScreen';
import { authApi } from '@/src/store/api/authApi';
import { userApi } from '@/src/store/api/userApi';
import { buildLoginResponse, buildMeResponse } from '@/src/test-utils/auth.fixture';
import { makeAuthStore, mockFetchRoutes, type AuthStore } from '@/src/test-utils/authStore';

// expo-router and the toast are boundaries. They are also what proves the
// success and failure paths, so the mocks double as assertion targets.
const mockReplace = jest.fn();
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
}));

const mockToastShow = jest.fn();
jest.mock('react-native-toast-message', () => ({
  __esModule: true,
  default: { show: (...args: unknown[]) => mockToastShow(...args) },
}));

// getDeviceInfo reads the device id for the login payload.
jest.mock('expo-application', () => ({
  applicationId: 'com.test.app',
  getAndroidId: () => 'android-test-id',
}));

const EMAIL = 'reader@example.com';
const PASSWORD = 'correct-horse';

const renderLogin = (store: AuthStore) =>
  renderWithProviders(<LoginScreen />, { store });

const fillForm = (email = EMAIL, password = PASSWORD) => {
  fireEvent.changeText(screen.getByPlaceholderText('Enter your email'), email);
  fireEvent.changeText(screen.getByPlaceholderText('Enter your password'), password);
};

const submit = () => fireEvent.press(screen.getByText('Sign In'));

/** Every request the happy path needs: login, then the profile fetch after it. */
const mockSuccessfulLogin = () =>
  mockFetchRoutes([
    { match: '/auth/login', body: buildLoginResponse() },
    { match: '/auth/me', body: buildMeResponse() },
  ]);

describe('LoginScreen', () => {
  let store: AuthStore;

  beforeEach(() => {
    store = makeAuthStore();
  });

  afterEach(() => {
    store.dispatch(authApi.util.resetApiState());
    store.dispatch(userApi.util.resetApiState());
  });

  describe('validation', () => {
    it('shows nothing red before the user touches a field', () => {
      renderLogin(store);

      expect(screen.queryByText('Email is required')).not.toBeOnTheScreen();
      expect(screen.queryByText('Password is required')).not.toBeOnTheScreen();
    });

    it('asks for both fields and sends no request on an empty form', async () => {
      const { fetchMock } = mockSuccessfulLogin();
      renderLogin(store);

      submit();

      await waitFor(() =>
        expect(screen.getByText('Email is required')).toBeOnTheScreen()
      );
      expect(screen.getByText('Password is required')).toBeOnTheScreen();
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('rejects an email that is not an email', async () => {
      const { fetchMock } = mockSuccessfulLogin();
      renderLogin(store);

      fillForm('not-an-email', PASSWORD);
      submit();

      await waitFor(() =>
        expect(screen.getByText('Invalid email format')).toBeOnTheScreen()
      );
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('rejects a password under six characters', async () => {
      const { fetchMock } = mockSuccessfulLogin();
      renderLogin(store);

      fillForm(EMAIL, '12345');
      submit();

      await waitFor(() =>
        expect(
          screen.getByText('Password must be at least 6 characters')
        ).toBeOnTheScreen()
      );
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe('a successful login', () => {
    it('sends what the user typed to the login endpoint', async () => {
      const { fetchMock, release } = mockSuccessfulLogin();
      renderLogin(store);

      fillForm();
      submit();
      release();

      await waitFor(() => expect(mockReplace).toHaveBeenCalled());

      // fetchBaseQuery calls fetch with a single Request object, so the body is
      // on the request itself. Clone it, because RTK Query already read it once.
      const loginCall = fetchMock.mock.calls.find((call) =>
        (call[0] as Request).url.includes('/auth/login')
      );
      const body = await (loginCall?.[0] as Request).clone().json();

      expect(body).toEqual(
        expect.objectContaining({ email: EMAIL, password: PASSWORD, platform: 'mobile' })
      );
    });

    it('takes the user to the home tabs', async () => {
      const { release } = mockSuccessfulLogin();
      renderLogin(store);

      fillForm();
      submit();
      release();

      await waitFor(() =>
        expect(mockReplace).toHaveBeenCalledWith('/(app)/(tabs)/(home)')
      );
    });

    it('confirms with a success toast', async () => {
      const { release } = mockSuccessfulLogin();
      renderLogin(store);

      fillForm();
      submit();
      release();

      await waitFor(() =>
        expect(mockToastShow).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'success',
            text2: "You've logged in successfully",
          })
        )
      );
    });
  });

  describe('a failed login', () => {
    const mockRejectedLogin = () =>
      mockFetchRoutes([
        { match: '/auth/login', body: { message: 'Invalid credentials' }, status: 401 },
      ]);

    it('shows the reason the server gave', async () => {
      const { release } = mockRejectedLogin();
      renderLogin(store);

      fillForm();
      submit();
      release();

      await waitFor(() =>
        expect(mockToastShow).toHaveBeenCalledWith(
          expect.objectContaining({ type: 'error', text2: 'Invalid credentials' })
        )
      );
    });

    it('stays on the login screen', async () => {
      const { release } = mockRejectedLogin();
      renderLogin(store);

      fillForm();
      submit();
      release();

      await waitFor(() => expect(mockToastShow).toHaveBeenCalled());
      expect(mockReplace).not.toHaveBeenCalled();
    });

    // Retyping a password after every failed attempt is the thing users hate most.
    it('keeps what the user typed so they can fix it and retry', async () => {
      const { release } = mockRejectedLogin();
      renderLogin(store);

      fillForm();
      submit();
      release();

      await waitFor(() => expect(mockToastShow).toHaveBeenCalled());
      expect(screen.getByDisplayValue(EMAIL)).toBeOnTheScreen();
      expect(screen.getByDisplayValue(PASSWORD)).toBeOnTheScreen();
    });
  });

  describe('the other ways off this screen', () => {
    it('opens forgot password', () => {
      renderLogin(store);

      fireEvent.press(screen.getByText('Forgot Password?'));

      expect(mockPush).toHaveBeenCalledWith('/(public)/forgotpassword');
    });

    it('opens signup', () => {
      renderLogin(store);

      fireEvent.press(screen.getByText('Sign Up'));

      expect(mockPush).toHaveBeenCalledWith('/(public)/signup');
    });
  });
});
