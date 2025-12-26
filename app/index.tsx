import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'expo-router';
import { useGetMeQuery } from '@/src/redux2/Apis/User';
import { logOut } from '@/src/store/slices/authSlice';
import { selectAuthToken } from '@/src/store/selectors/authSelectors';
import Toast from 'react-native-toast-message';
import AppLoader from '@/src/components/core/loaders/AppLoader';

export default function Index() {
  const dispatch = useDispatch();
  const token = useSelector(selectAuthToken);

  const { isSuccess, isError, isLoading } = useGetMeQuery(undefined, {
    skip: !token,
  });

  // Handle session expiry
  useEffect(() => {
    if (isError && token) {
      dispatch(logOut());
      Toast.show({
        type: 'error',
        text1: 'Session expired',
        text2: 'Please login again',
      });
    }
  }, [isError, token, dispatch]);

  // Still checking auth
  if (token && isLoading) {
    return <AppLoader />;
  }

  // Authenticated - go to home
  if (token && isSuccess) {
    return <Redirect href="/(app)/(tabs)/(home)" />;
  }

  // Not authenticated - go to onboarding
  return <Redirect href="/(public)/onboarding" />;
}