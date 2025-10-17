import { Redirect } from 'expo-router';

export default function Index() {
  const isLoggedIn = false; 

  if (!isLoggedIn) {
    return <Redirect href="/(public)/login" />;
  }

  return <Redirect href="/(app)/(tabs)" />;
}
