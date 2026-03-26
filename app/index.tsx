import { useSelector } from 'react-redux';
import { Redirect } from 'expo-router';
import { useGetMeQuery } from '@/src/store/api/userApi';
import { selectAuthToken, selectIsLoggedIn } from '@/src/store/selectors/authSelectors';
import AppLoader from '@/src/components/core/loaders/AppLoader';

export default function Index() {
  const token = useSelector(selectAuthToken);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  // Only call getMe if we have a token
  const { isSuccess, isLoading, isFetching } = useGetMeQuery(undefined, {
    skip: !token,
  });

  // Still checking auth - show loader while fetching
  if (token && (isLoading || isFetching)) {
    return <AppLoader />;
  }

  // Authenticated - go to home
  // Check both token exists and isLoggedIn (set to false by baseQueryWithReauth on failed refresh)
  if (token && isLoggedIn && isSuccess) {
    return <Redirect href="/(app)/(tabs)/(home)" />;
  }

  // Not authenticated - go to onboarding
  return <Redirect href="/(public)/onboarding" />;
}