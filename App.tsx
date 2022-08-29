import React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import AppNavigator from './src/navigations/AppNavigator';
import { navigationRef } from './src/navigations/RootNavigation';


const App = () => {

  return (
    <NavigationContainer ref={navigationRef}>
      <AppNavigator/>
    </NavigationContainer>
  );
};



export default App;
