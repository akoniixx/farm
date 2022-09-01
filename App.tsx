import React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import AppNavigator from './src/navigations/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SecondFormScreen from './src/screens/RegisterScreen/SecondFormScreen';
import ThirdFormScreen from './src/screens/RegisterScreen/ThirdFormScreen';
import AddIDcardScreen from './src/screens/RegisterScreen/AddIDcardScreen';
import FourthFormScreen from './src/screens/RegisterScreen/FourthFormScreen';
import SuccessRegister from './src/screens/RegisterScreen/SuccessRegister';


const App = () => {
  return (
    <NavigationContainer>
      <AppNavigator/>
    </NavigationContainer>
  );
};



export default App;
