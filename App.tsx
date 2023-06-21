import React, {createContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/navigations/AppNavigator';
import {navigationRef} from './src/navigations/RootNavigation';
import SplashScreen from 'react-native-splash-screen';
import Toast from 'react-native-toast-message';
import {SheetProvider} from 'react-native-actions-sheet';
import './src/sheet/Sheets';
import {toastConfig} from './src/config/toast-config';
import {Alert, BackHandler, Linking} from 'react-native';
import buddhaEra from 'dayjs/plugin/buddhistEra';
import dayjs from 'dayjs';
import {AuthProvider} from './src/contexts/AuthContext';
import {Settings} from 'react-native-fbsdk-next';
import VersionCheck from 'react-native-version-check';
import storeVersion from 'react-native-store-version';
dayjs.extend(buddhaEra);
import {
  firebaseInitialize,
  requestUserPermission,
} from './src/firebase/notification';
import {Platform} from 'react-native';
import {mixpanel} from './mixpanel';
import {requestTrackingPermission} from 'react-native-tracking-transparency';
import {checkNotifications} from 'react-native-permissions';
import 'moment/locale/th';
import './src/components/Sheet';
import {PointProvider} from './src/contexts/PointContext';
import moment from 'moment';
import RNExitApp from 'react-native-kill-app';

import AsyncStorage from '@react-native-async-storage/async-storage';
moment.updateLocale('th', {
  relativeTime: {
    future: '%s',
  },
});
type ActionContextType = {
  actiontaskId: string | null;
  setActiontaskId: React.Dispatch<React.SetStateAction<string | null>>;
};

const ActionContextState = {
  actiontaskId: '',
  setActiontaskId: () => {},
};

const ActionContext = createContext<ActionContextType>(ActionContextState);

const App = () => {
  const [actiontaskId, setActiontaskId] = useState<string | null>('');
  const requestTracking = async () => {
    const currentStatus = await Settings.getAdvertiserTrackingEnabled();
    if (currentStatus) {
      return;
    }
    const status = await requestTrackingPermission();

    if (status === 'authorized') {
      Settings.setAdvertiserTrackingEnabled(true);
    } else {
      Settings.setAdvertiserTrackingEnabled(false);
    }
  };
  const checkVersion = async () => {
    const isIOS = Platform.OS === 'ios';
    const currentVersion = VersionCheck.getCurrentVersion();
    const storeUrl = await VersionCheck.getAppStoreUrl({
      appID: '6443516628',
    });

    const playStoreUrl = await VersionCheck.getPlayStoreUrl({
      packageName: 'com.iconkaset.droner',
    });

    const {remote} = await storeVersion({
      version: currentVersion,
      androidStoreURL: playStoreUrl,
      iosStoreURL: storeUrl,
      country: 'TH',
    });

    const needUpdate = await VersionCheck.needUpdate({
      currentVersion,
      latestVersion: remote,
    });

    if (needUpdate.isNeeded) {
      Alert.alert('มีการอัพเดทใหม่', undefined, [
        {
          text: 'อัพเดท',
          onPress: async () => {
            mixpanel.track('กดอัพเดทแอพ');
            await Linking.openURL(isIOS ? storeUrl : playStoreUrl);
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
    const getToken = async () => {
      const token = await AsyncStorage.getItem('token');
      const dronerId = await AsyncStorage.getItem('droner_id');
      console.log('token', token);
      console.log('dronerId', dronerId);
    };
    if (Platform.OS === 'ios') {
      firebaseInitialize();
    }
    requestUserPermission();
    checkPermission();
    requestTracking();
    getToken();
    checkVersion();
  }, []);

  const checkPermission = () => {
    checkNotifications().then(async ({status, settings}) => {
      if (status === 'denied' || status === 'blocked') {
        requestUserPermission();
      }
    });
  };

  return (
    <>
      <ActionContext.Provider value={{actiontaskId, setActiontaskId}}>
        <NavigationContainer ref={navigationRef}>
          <AuthProvider>
            <>
              <PointProvider>
                <SheetProvider>
                  <AppNavigator />
                </SheetProvider>
              </PointProvider>
              <Toast config={toastConfig} />
            </>
          </AuthProvider>
        </NavigationContainer>
      </ActionContext.Provider>
    </>
  );
};
export {ActionContext};
export default App;
