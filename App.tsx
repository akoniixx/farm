import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigations/AppNavigator';
import { navigationRef } from './src/navigations/RootNavigation';
import SplashScreen from 'react-native-splash-screen';
import Toast from 'react-native-toast-message';
import { SheetProvider } from 'react-native-actions-sheet';
import { toastConfig } from './src/config/toast-config';
import { BackHandler } from 'react-native';
import 'moment/locale/th';
const App = () => {
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => true);
    SplashScreen.hide();
  }, []);
  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <SheetProvider>
          <AppNavigator />
        </SheetProvider>
        <Toast config={toastConfig} />
      </NavigationContainer>
    </>
  );
};

export default App;
178