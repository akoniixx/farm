import React, {createContext, useEffect, useState} from 'react';
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
import {AuthProvider, useAuth} from './src/contexts/AuthContext';
import {Settings} from 'react-native-fbsdk-next';

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
            <PointProvider>
              <SheetProvider>
                <AppNavigator />
              </SheetProvider>
            </PointProvider>
          </AuthProvider>
          <Toast config={toastConfig} />
        </NavigationContainer>
      </ActionContext.Provider>
    </>
  );
};
export {ActionContext};
export default App;
