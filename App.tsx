import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import AppNavigator from './src/navigations/AppNavigator';

import { navigationRef } from './src/navigations/RootNavigation';
import SplashScreen from 'react-native-splash-screen'
import AsyncStorage from '@react-native-async-storage/async-storage';


const App = () => {
  useEffect(()=>{
    SplashScreen.hide();
  },[])
  return (
    <NavigationContainer>
    {/* <NavigationContainer ref={navigationRef}> */}
      <AppNavigator/>
    </NavigationContainer>
  );
};



export default App;
