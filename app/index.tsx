import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { persistor, RootState } from "@/src/redux2/Store";
import { Redirect, useRouter } from "expo-router";
import { useGetMeQuery } from "@/src/redux2/Apis/User";
import { logOut } from "@/src/redux2/Slice/AuthSlice";
import Toast from "react-native-toast-message";
import { selectAuthToken, selectRefreshToken } from "@/src/redux2/Selectors";

export default function Index() {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector(selectAuthToken);
  const refreshToken = useSelector(selectRefreshToken);

  const [checkedAuth, setCheckedAuth] = useState(false);

  // Use getMe query to check if token is valid
  const { data, isSuccess, isError } = useGetMeQuery(undefined, {
    skip: !token, // only call if access token exists
  });

  useEffect(() => {
    if (!token) {
      setCheckedAuth(true); // no token → done checking
    } else if (isSuccess) {
      setCheckedAuth(true); // token valid → done checking
    } else if (isError) {
      // token invalid or refresh failed → log out
      dispatch(logOut());
      Toast.show({
        type: "error",
        text1: "Session expired",
        text2: "Please login again",
      });
      setCheckedAuth(true);
    }
  }, [token, refreshToken, isSuccess, isError, dispatch]);

  if (!checkedAuth) {
    // Loading spinner while checking
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (token && isSuccess) {
    // Token valid → navigate to home
    return <Redirect href="/(app)/(tabs)/(home)" />;
  }

  // Token missing or invalid → navigate to onboarding
  return <Redirect href="/(public)/onboarding" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});


// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { persistor, RootState } from "@/src/redux2/Store";
// import { Redirect } from "expo-router";
// import { useGetMeQuery } from "@/src/redux2/Apis/User";

// export default function Index() {
//   const token = useSelector((state: RootState) => state.auth.token);
//   const [checkedAuth, setCheckedAuth] = useState(false);

//   // Use getMe query to check if token is valid and get user data
//   const { data, isSuccess, isError } = useGetMeQuery(undefined, {
//     skip: !token, // only call if token exists
//   });

//   useEffect(() => {
//     if (!token) {
//       // no token → done checking
//       setCheckedAuth(true);
//     } else if (isSuccess || isError) {
//       // either we got user data or failed → done checking
//       setCheckedAuth(true);
//     }
//   }, [token, isSuccess, isError]);

//   if (!checkedAuth) {
//     // You can return a splash/loading screen here
//     return null;
//   }

//   if (token && isSuccess) {
//     // Token is valid → go to home
//     return <Redirect href="/(app)/(tabs)/(home)" />;
//   }

//   // Token missing or invalid → go to onboarding/login
//   return <Redirect href="/(public)/onboarding" />;
// }


// import { persistor, RootState } from '@/src/redux2/Store';
// import { Redirect } from 'expo-router';
// import { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';

// export default function Index() {
//   // const isLoggedIn = false; 
//   // const token = useSelector((state: RootState) => state.auth.token);

//   const token = useSelector((state: RootState) => state.auth.token);

//   console.log("THIS IS TOKEN FROM MAIN SCREEN", token);
  

//   if (token) {
//     return <Redirect href="/(app)/(tabs)/(home)" />;
//   }
//   return <Redirect href="/(public)/onboarding" />;

// }
