import { Tabs } from 'expo-router';
import BottomNavbar from './bottomNavbar';

const BottomNavTabLayout = () => {
  return (
    <Tabs
      initialRouteName="(home)"
      screenOptions={{
        headerShown: false,
        animation: 'shift',
      }}
      tabBar={(props) => <BottomNavbar {...props} />}
    >
      <Tabs.Screen name="(home)"
        options={{ headerShown: false }}
      />
      <Tabs.Screen name="explore" options={{ headerShown: false }} />
      <Tabs.Screen name="library"
        options={{ headerShown: false }}

      />
      <Tabs.Screen name="profile" options={{ headerShown: false }} />
      <Tabs.Screen name="settings" options={{ headerShown: false }} />
    </Tabs>
  );
};

export default BottomNavTabLayout;

