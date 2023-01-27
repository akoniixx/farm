import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const credentials = {
  databaseURL: '',
  clientId:
    '480825932340-nt6d5nh1teo5uv5cuct4u0g58p94g02a.apps.googleusercontent.com',
  appId: '1:480825932340:ios:a65128f57e3062976f2861',
  apiKey: 'AIzaSyDPCQdm-luxZ7Z9jKIUGJK6xkTsxPxfJs8',
  storageBucket: 'farmer-app-eb408.appspot.com',
  messagingSenderId: '480825932340',
  projectId: 'farmer-app-eb408',
};

export const firebaseInitialize = async () => {
  await firebase.initializeApp(credentials);
};

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("permission")
    setTimeout(() => {
      getFCMToken();
    }, 1000);
  }
}

export const getFCMToken = async () => {
  try {
    const token = await messaging().getToken();
    console.log(`FCMTOKEN = ${token}`)
    await AsyncStorage.setItem('fcmtoken', token);
  } catch (err) {
    console.log(err);
  }
};

export const fcmOnListen = () => {
  messaging().onMessage(async remoteMessage => {
    // page.current = remoteMessage.notification.body;
  });
};
