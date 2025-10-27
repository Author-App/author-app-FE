import { Redirect } from 'expo-router';

export default function Index() {
  const isLoggedIn = true; 

  if (isLoggedIn) {
    return <Redirect href="/(app)/(tabs)/(home)" />;
  }
  return <Redirect href="/(public)/login" />;

}
