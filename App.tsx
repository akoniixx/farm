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
const App = () => {
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => true);
    SplashScreen.hide();
    if (Platform.OS === 'ios') {
      firebaseInitialize();
    }
    requestUserPermission();
  }, []);
  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <PaperProvider>
          <SheetProvider>
            <AppNavigator />
          </SheetProvider>
        </PaperProvider>
        <Toast config={toastConfig} />
      </NavigationContainer>
    </>
  );
};

export default App;
