import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import AppNavigator from './src/navigations/AppNavigator';

import { navigationRef } from './src/navigations/RootNavigation';
import SplashScreen from 'react-native-splash-screen'


const App = () => {
  useEffect(()=>{
    SplashScreen.hide();
  },[])
  return (
    <NavigationContainer ref={navigationRef}>
      <AppNavigator/>
    </NavigationContainer>
  );
};



export default App;
