import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import firebase from '@react-native-firebase/app';
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
  registerDeviceForRemoteMessages,
  requestUserPermission,
} from './src/firebase/notification';

import './src/components/SheetList';
import { AutoBookingProvider } from './src/contexts/AutoBookingContext';
import { AuthProvider } from './src/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mixpanel } from './mixpanel';
import { RecoilRoot } from 'recoil';
import { NetworkProvider } from './src/contexts/NetworkContext';

const App = () => {
  useEffect(() => {
    mixpanel.track('App open');
    BackHandler.addEventListener('hardwareBackPress', () => true);
    SplashScreen.hide();
    if (Platform.OS === 'ios') {
      if (firebase.apps.length === 0) {
        firebaseInitialize();
      } else {
        firebase.app();
      }
      registerDeviceForRemoteMessages();
    }
    requestUserPermission();
    getToken();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getToken = async () => {
    console.log(`farmerid = ${await AsyncStorage.getItem('farmer_id')}`);
    console.log(`token = ${await AsyncStorage.getItem('token')}`);
    console.log(`fcmtoken = ${await AsyncStorage.getItem('fcmtoken')}`);
  };
  return (
    <>
      <NetworkProvider>
        <RecoilRoot>
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
        </RecoilRoot>
      </NetworkProvider>
    </>
  );
};

export default App;
