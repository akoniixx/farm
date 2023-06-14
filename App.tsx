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
import { Alert, BackHandler, Linking, Platform } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import VersionCheck from 'react-native-version-check';
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
import RNExitApp from 'react-native-kill-app';
import packageJson from './package.json';
const App = () => {
  const latestVersion = packageJson.version;
  const checkVersion = async () => {
    const isIOS = Platform.OS === 'ios';
    const currentVersion = VersionCheck.getCurrentVersion();

    const needUpdate = await VersionCheck.needUpdate({
      currentVersion,
      latestVersion,
    });

    const storeUrl = await VersionCheck.getAppStoreUrl({
      appID: '1668317592',
      appName: 'เรียกโดรน - ไอคอนเกษตร',
    });

    const playStoreUrl = await VersionCheck.getPlayStoreUrl({
      packageName: 'com.iconkaset.droner',
    });

    if (needUpdate.isNeeded) {
      Alert.alert('มีการอัพเดทใหม่', undefined, [
        {
          text: 'อัพเดท',
          onPress: () => {
            if (isIOS) {
              Linking.openURL(storeUrl);
            } else {
              Linking.openURL(playStoreUrl);
            }
            RNExitApp.exitApp();
          },
        },
      ]);
    }
  };
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
  }, []);

  const getToken = async () => {
    console.log(`farmerid = ${await AsyncStorage.getItem('farmer_id')}`);
    console.log(`token = ${await AsyncStorage.getItem('token')}`);
    console.log(`fcmtoken = ${await AsyncStorage.getItem('fcmtoken')}`);
  };
  return (
    <>
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
    </>
  );
};

export default App;
