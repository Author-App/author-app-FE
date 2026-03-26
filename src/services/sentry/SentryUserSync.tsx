import { useEffect } from 'react';
import { useAppSelector } from '@/src/store/hooks';
import { sentryService } from '@/src/services/sentry';

export function SentryUserSync(): null {
  const user = useAppSelector((state) => state.auth.user);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn && user) {
      // Set Sentry user on login or app restore
      sentryService.setUser({
        id: user.id,
        email: user.email,
        username: `${user.firstName} ${user.lastName}`,
      });
    } else {
      // Clear Sentry user on logout
      sentryService.clearUser();
    }
  }, [isLoggedIn, user]);

  // This component doesn't render anything
  return null;
}
