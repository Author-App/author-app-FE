import React from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTabBarInset } from '@/src/navigations/hooks/useTabBarInset';
import { useLayoutClass } from '@/src/components/core/layout/useLayoutClass';

import { useProfileData } from '../hooks/useProfileData';

import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import ProfileCompact from './layouts/ProfileCompact';
import ProfileWide from './layouts/ProfileWide';

const ProfileScreen: React.FC = () => {
  const { top } = useSafeAreaInsets();
  const { clearance } = useTabBarInset();
  const { author } = useProfileData();
  const { size } = useLayoutClass();
  const Layout = size === 'compact' ? ProfileCompact : ProfileWide;

  return (
    <UScreenLayout pt={top}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: clearance }}>
        <Layout author={author} />
      </ScrollView>
    </UScreenLayout>
  );
};

export default ProfileScreen;
