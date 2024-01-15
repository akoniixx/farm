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
import { MaintenanceProvider } from './src/contexts/MaintenanceContext';
import crashlytics from '@react-native-firebase/crashlytics';
import { HighlightProvider } from './src/contexts/HighlightContext';
import { PointProvider } from './src/contexts/PointContext';

crashlytics().setCrashlyticsCollectionEnabled(true);
const App = () => {
  useEffect(() => {
    const firebaseInit = async () => {
      try {
        if (Platform.OS === 'ios') {
          await registerDeviceForRemoteMessages();
          if (firebase.apps.length === 0) {
            firebaseInitialize();
          } else {
            firebase.app();
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    mixpanel.track('App open');
    BackHandler.addEventListener('hardwareBackPress', () => true);
    SplashScreen.hide();
    firebaseInit();

    requestUserPermission();
    getToken();
    // AsyncStorage.getAllKeys().then(keys => console.log(keys));

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
          <PointProvider>
            <HighlightProvider>
              <NavigationContainer ref={navigationRef}>
                <PaperProvider>
                  <AuthProvider>
                    <MaintenanceProvider>
                      <AutoBookingProvider>
                        <SheetProvider>
                          <AppNavigator />
                        </SheetProvider>
                      </AutoBookingProvider>
                    </MaintenanceProvider>
                  </AuthProvider>
                </PaperProvider>
                <Toast config={toastConfig} />
              </NavigationContainer>
            </HighlightProvider>
          </PointProvider>
        </RecoilRoot>
      </NetworkProvider>
    </>
  );
};

export default App;
