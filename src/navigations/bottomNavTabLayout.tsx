import { Tabs, useRouter } from 'expo-router';
import BottomNavbar from './bottomNavbar';

const BottomNavTabLayout = () => {

  const router = useRouter();

  return (
    <Tabs
      initialRouteName="(home)"
      screenOptions={{
        // headerShown: false,
        headerShown: true,
        // animation: 'shift',
        
        // unmountOnBlur: false
      }}
      tabBar={(props) => <BottomNavbar {...props} />}
    >
      <Tabs.Screen name="(home)"
        options={{ headerShown: false }}
      />
      <Tabs.Screen name="library"
        options={{ headerShown: false }}
 
      />
      <Tabs.Screen name="media" options={{ headerShown: false }} />
      <Tabs.Screen name="store" options={{ headerShown: false }} />
      <Tabs.Screen name="profile" options={{ headerShown: false }} />
    </Tabs>
  );
};

export default BottomNavTabLayout;

