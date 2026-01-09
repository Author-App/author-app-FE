import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) return;

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Notification permission not granted');
    return null;
  }

  const token = (
    await Notifications.getExpoPushTokenAsync({
      projectId: '7a14cd2e-ec7a-4fde-a2d4-8e490efb513e',
    })
  ).data;

  console.log('Expo Push Token (APK):', token);

  return token;
}


// export async function registerForPushNotificationsAsync() {
//   if (!Device.isDevice) {
//     // alert('Push notifications only work on physical devices');
//     return;
//   }

//   const { status: existingStatus } =
//     await Notifications.getPermissionsAsync();

//   let finalStatus = existingStatus;

//   if (existingStatus !== 'granted') {
//     const { status } = await Notifications.requestPermissionsAsync();
//     finalStatus = status;
//   }

//   if (finalStatus !== 'granted') {
//     alert('Failed to get push token permission!');
//     return;
//   }

//   const projectId =
//     Constants.expoConfig?.extra?.eas?.projectId ??
//     Constants.easConfig?.projectId;

//   const token = (
//     await Notifications.getExpoPushTokenAsync({ projectId })
//   ).data;

//   console.log('Expo Push Token:', token);

//   // 👉 Send this token to your backend
//   return token;
// }
