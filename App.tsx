import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import AppNavigator from './src/navigations/AppNavigator';

import { navigationRef } from './src/navigations/RootNavigation';
import SplashScreen from 'react-native-splash-screen'
import Toast from 'react-native-toast-message';
import { SheetProvider } from 'react-native-actions-sheet';
import './src/sheet/Sheets'


const App = () => {
  useEffect(()=>{
    SplashScreen.hide();
  },[])
  return (
    <>
    <NavigationContainer ref={navigationRef}>
    <SheetProvider>
      <AppNavigator/>
      </SheetProvider>
    </NavigationContainer>
     <Toast />
     </>
  );
};



export default App;
