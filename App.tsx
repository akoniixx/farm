import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/navigations/AppNavigator';
import {navigationRef} from './src/navigations/RootNavigation';
import SplashScreen from 'react-native-splash-screen';
import Toast from 'react-native-toast-message';
import {SheetProvider} from 'react-native-actions-sheet';
import './src/sheet/Sheets';
import {toastConfig} from './src/config/toast-config';
import {BackHandler} from 'react-native';
import buddhaEra from 'dayjs/plugin/buddhistEra';
import dayjs from 'dayjs';
import {AuthProvider} from './src/contexts/AuthContext';
dayjs.extend(buddhaEra);
import {
  firebaseInitialize,
  getFCMToken,
  requestUserPermission,
} from './src/firebase/notification';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const getDroner = async() => {
    const droner_id = await AsyncStorage.getItem('droner_id')
    const token = await AsyncStorage.getItem('token')
    console.log(droner_id)
    console.log(token)
  }
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => true);
    SplashScreen.hide();
    getDroner();
    if(Platform.OS === "ios"){
      firebaseInitialize()
    }
    requestUserPermission()
    getFCMToken()
  }, []);
  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <AuthProvider>
          <SheetProvider>
            <AppNavigator />
          </SheetProvider>
        </AuthProvider>
        <Toast config={toastConfig} />
      </NavigationContainer>
    </>
  );
};

export default App;
