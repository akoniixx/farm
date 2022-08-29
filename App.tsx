import React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import AppNavigator from './src/navigations/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SecondFormScreen from './src/screens/RegisterScreen/SecondFormScreen';
import ThirdFormScreen from './src/screens/RegisterScreen/ThirdFormScreen';


const App = () => {
  return (
    <NavigationContainer>
      <AppNavigator/>
    </NavigationContainer>
  );
};



export default App;
