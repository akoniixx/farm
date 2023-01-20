import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigations/AppNavigator';
import { navigationRef } from './src/navigations/RootNavigation';
import SplashScreen from 'react-native-splash-screen';
import Toast from 'react-native-toast-message';
import {SheetProvider} from 'react-native-actions-sheet';
import {toastConfig} from './src/config/toast-config';
import {BackHandler, Platform} from 'react-native';
import { firebaseInitialize, requestUserPermission } from './src/firebase/notification';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => true);
    SplashScreen.hide();
    if(Platform.OS === 'ios'){
      firebaseInitialize()
    }
    requestUserPermission()
    getToken()
  }, []);

  const getToken = async()=>{
    console.log(`farmerid = ${await AsyncStorage.getItem("farmer_id")}`)
  }
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