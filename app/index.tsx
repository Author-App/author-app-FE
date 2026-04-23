import { useSelector } from 'react-redux';
import { Redirect } from 'expo-router';
import { useGetMeQuery } from '@/src/store/api/userApi';
import { selectAuthToken, selectIsLoggedIn } from '@/src/store/selectors/authSelectors';
import { useAuthInitialization } from '@/src/hooks/useAuthInitialization';
import AppLoader from '@/src/components/core/loaders/AppLoader';

export default function Index() {
  const token = useSelector(selectAuthToken);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  
  // Initialize auth on startup - restores tokens from SecureStore if needed
  const { isInitializing, isAuthenticated, isUnauthenticated } = useAuthInitialization();

  // Only call getMe if we have a token
  const { isSuccess, isLoading, isFetching } = useGetMeQuery(undefined, {
    skip: !token,
  });

  // Still initializing auth from SecureStore
  if (isInitializing) {
    return <AppLoader />;
  }

  // No valid session - go to onboarding
  if (isUnauthenticated) {
    return <Redirect href="/(public)/onboarding" />;
  }

  // Still checking auth - show loader while fetching
  if (token && (isLoading || isFetching)) {
    return <AppLoader />;
  }

  // Authenticated - go to home
  if (isAuthenticated && token && isLoggedIn && isSuccess) {
    return <Redirect href="/(app)/(tabs)/(home)" />;
  }

  // Not authenticated - go to onboarding
  return <Redirect href="/(public)/onboarding" />;
}