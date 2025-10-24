import { Tabs, useRouter } from 'expo-router';
import BottomNavbar from './bottomNavbar';
import { NavigationOptions } from './navigationOptions';
import UHeader from '../components/core/layout/uHeader';
import IconBack from '@/assets/icons/iconBack';
import UIconButton from '../components/core/buttons/uIconButtonVariants';
import UHeaderWithImage from '../components/core/layout/uHeaderWithImage';
import UText from '../components/core/text/uText';
import IconNotifications from '@/assets/icons/iconNotifications';

const BottomNavTabLayout = () => {

  const router = useRouter();

  return (
    <Tabs
      initialRouteName="(home)"
      screenOptions={{
        // headerShown: false,
        headerShown: true,
        animation: 'shift',
      }}
      tabBar={(props) => <BottomNavbar {...props} />}
    >
      <Tabs.Screen name="(home)" options={{
        header: () => (
          <UHeader
            // title="Home"
            leftControl={
              <UHeaderWithImage
                // heroImage={null}
                heroFallbackText='PJ'
                title="Hi, Peter John"
                headerSubtitle={
                  <UText variant="text-xs" color="$neutral7">
                    Welcome back 👋
                  </UText>
                }
              />
            }
            rightControl={<UIconButton
              variant="tertiary-md"
              icon={IconNotifications}
              onPress={() => console.log()}
            />}
          />
        ),
      }} />
      <Tabs.Screen name="library" options={{
        header: () => (
          <UHeader
            title="Library"
          />
        ),
      }} />
      <Tabs.Screen name="media" options={{ headerShown: false }} />
      <Tabs.Screen name="store" options={{ headerShown: false }} />
      <Tabs.Screen name="profile" options={{ headerShown: false }} />
    </Tabs>
  );
};

export default BottomNavTabLayout;

