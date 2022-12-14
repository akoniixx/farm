import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const credentials = {
  databaseURL: '',
  clientId:
    '281602709828-2mm0cut3h2lu70ed7vnslj0haf9bemau.apps.googleusercontent.com',
  appId: '1:281602709828:ios:b4e1d3550d4c57c1341f11',
  apiKey: 'AIzaSyDznStatGAHm47Z9ewbKgATGV-P_mVzPyk',
  storageBucket: 'farmer-app1.appspot.com',
  messagingSenderId: '281602709828',
  projectId: 'farmer-app1',
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
    setTimeout(()=>{
      getFCMToken()
    },1000)
  }
}

export const getFCMToken = async () => {
  try{
    const token = await messaging().getToken();
    await AsyncStorage.setItem('fcmtoken', token);
  }catch(err){
    console.log(err)
  }
};

export const fcmOnListen = () => {
  messaging().onMessage(async remoteMessage => {
    // page.current = remoteMessage.notification.body;
  });
};
