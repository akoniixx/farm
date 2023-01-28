import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigations/AppNavigator';
import { navigationRef } from './src/navigations/RootNavigation';
import SplashScreen from 'react-native-splash-screen';
import Toast from 'react-native-toast-message';
import { SheetProvider } from 'react-native-actions-sheet';
import { toastConfig } from './src/config/toast-config';
import { BackHandler, Platform } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import 'moment/locale/th';
import {
  firebaseInitialize,
  requestUserPermission,
} from './src/firebase/notification';

import './src/components/SheetList';

import { AutoBookingProvider } from './src/contexts/AutoBookingContext';
import { AuthProvider } from './src/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { mixpanel } from './mixpanel';
const App = () => {
  useEffect(() => {
    mixpanel.track('App open');
    BackHandler.addEventListener('hardwareBackPress', () => true);
    SplashScreen.hide();
    if (Platform.OS === 'ios') {
      firebaseInitialize();
    }
    requestUserPermission();
    getToken()
  }, []);

  const getToken = async()=>{
    console.log(`farmerid = ${await AsyncStorage.getItem("farmer_id")}`)
    console.log(`token = ${await AsyncStorage.getItem("token")}`)
    // console.log(`fcmtoken = ${await AsyncStorage.getItem("fcmtoken")}`)
  }
  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <PaperProvider>
          <AuthProvider>
            <AutoBookingProvider>
              <SheetProvider>
                <AppNavigator />
              </SheetProvider>
            </AutoBookingProvider>
          </AuthProvider>
        </PaperProvider>
        <Toast config={toastConfig} />
      </NavigationContainer>
    </>
  );
};

export default App;
