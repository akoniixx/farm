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

dayjs.extend(buddhaEra);
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
