// import { RootState } from '@/src/redux2/Store';
// import { Redirect } from 'expo-router';
// import { useSelector } from 'react-redux';

// export default function Index() {
//   const token = useSelector((state: RootState) => state.auth.token);

//   console.log("THIS IS THE TOKEN", token);
  

//   // PersistGate has not finished rehydration yet
//   if (token === undefined) {
//     return null; // or splash screen
//   }

//   return token
//     ? <Redirect href="/(app)/(tabs)/(home)" />
//     : <Redirect href="/(public)/onboarding" />;
// }


import { persistor, RootState } from '@/src/redux2/Store';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function Index() {
  // const isLoggedIn = false; 
  // const token = useSelector((state: RootState) => state.auth.token);

  const token = useSelector((state: RootState) => state.auth.token);

  console.log("THIS IS TOKEN FROM MAIN SCREEN", token);
  

  if (token) {
    return <Redirect href="/(app)/(tabs)/(home)" />;
  }
  return <Redirect href="/(public)/onboarding" />;

}
