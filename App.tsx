import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import AppNavigator from './src/navigations/AppNavigator';

import { navigationRef } from './src/navigations/RootNavigation';
import SplashScreen from 'react-native-splash-screen'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import AddIDcardScreen from './src/screens/RegisterScreen/AddIDcardScreen';


const App = () => {
  const droner_id = async () =>{
    const dronerid = await AsyncStorage.getItem('droner_id')
    console.log(dronerid)
  }
  useEffect(()=>{
    droner_id()
    SplashScreen.hide();
  },[])
  return (
    <>
    <NavigationContainer ref={navigationRef}>
      <AppNavigator/>
    </NavigationContainer>
     <Toast />
     </>
  );
};



export default App;
