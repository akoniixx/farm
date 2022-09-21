import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import AppNavigator from './src/navigations/AppNavigator';

import { navigationRef } from './src/navigations/RootNavigation';
import SplashScreen from 'react-native-splash-screen'
import Toast from 'react-native-toast-message';
import { SheetProvider } from 'react-native-actions-sheet';
import './src/sheet/Sheets'
import AsyncStorage from '@react-native-async-storage/async-storage';

const getToken = async() =>{
  const droneid = await AsyncStorage.getItem('droner_id')
  const token = await AsyncStorage.getItem('token');
  console.log(droneid)
  console.log(token)
}

const App = () => {
  useEffect(()=>{
    getToken()
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
