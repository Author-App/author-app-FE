/**
 * Hook to initialize auth state on app startup
 * Restores tokens from SecureStore if user was previously logged in
 */

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ENV } from '@/src/config/env';
import { getAuthTokens, saveAuthTokens, clearAuthTokens } from '@/src/storage/authStorage';
import { updateTokens, logOut } from '@/src/store/slices/authSlice';
import { selectAuthToken, selectIsLoggedIn } from '@/src/store/selectors/authSelectors';
import type { RootState } from '@/src/store';
import type { RefreshResponse } from '@/src/types/api/auth.types';

type InitStatus = 'idle' | 'initializing' | 'ready' | 'unauthenticated';

export const useAuthInitialization = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectAuthToken);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const [status, setStatus] = useState<InitStatus>('idle');

  useEffect(() => {
    const initializeAuth = async () => {
      // If we have a token already, we're ready
      if (token) {
        setStatus('ready');
        return;
      }

      // If not logged in (from persisted state), nothing to restore
      if (!isLoggedIn) {
        setStatus('unauthenticated');
        return;
      }

      // User was logged in but token is missing - try to restore from SecureStore
      setStatus('initializing');

      try {
        const storedTokens = await getAuthTokens();

        if (!storedTokens?.refreshToken) {
          // No stored tokens - log out
          dispatch(logOut());
          setStatus('unauthenticated');
          return;
        }

        // Try to refresh the token
        const response = await fetch(`${ENV.API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-refresh': storedTokens.refreshToken,
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) {
          // Refresh failed - log out
          await clearAuthTokens();
          dispatch(logOut());
          setStatus('unauthenticated');
          return;
        }

        const data = await response.json();
        const session = data?.data?.session as RefreshResponse | undefined;
        const newAccessToken = session?.access;
        const newRefreshToken = session?.refresh;

        if (newAccessToken && newRefreshToken) {
          // Update Redux state
          dispatch(updateTokens({
            access: newAccessToken,
            refresh: newRefreshToken,
          }));

          // Save new refresh token to SecureStore
          const userIdToUse = userId || storedTokens.userId;
          if (userIdToUse) {
            await saveAuthTokens(newRefreshToken, userIdToUse);
          }

          setStatus('ready');
        } else {
          // Invalid response - log out
          await clearAuthTokens();
          dispatch(logOut());
          setStatus('unauthenticated');
        }
      } catch (error) {
        console.error('[useAuthInitialization] Error:', error);
        await clearAuthTokens();
        dispatch(logOut());
        setStatus('unauthenticated');
      }
    };

    initializeAuth();
  }, [token, isLoggedIn, userId, dispatch]);

  return {
    isInitializing: status === 'idle' || status === 'initializing',
    isAuthenticated: status === 'ready',
    isUnauthenticated: status === 'unauthenticated',
  };
};
