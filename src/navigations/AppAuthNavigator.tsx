import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import ConditionScreen from '../screens/RegisterScreen/ConditionScreen';
import TelNumScreen from '../screens/RegisterScreen/TelNumberScreen';
import OtpScreen from '../screens/OtpScreen/OtpScreen';
import SecondFormScreen from '../screens/RegisterScreen/SecondFormScreen';
import ThirdFormScreen from '../screens/RegisterScreen/ThirdFormScreen';
import SuccessRegister from '../screens/RegisterScreen/SuccessScreen';
import FourthFormScreen from '../screens/RegisterScreen/FourthFormScreen';
import AddIDcardScreen from '../screens/RegisterScreen/AddIDcardScreen';
import FirstFormScreen from '../screens/RegisterScreen/FirstFromScreen';
import Onboarding from '../screens/Onboarding/Onboarding';

const Stack = createStackNavigator();

const AppAuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="ConditionScreen" component={ConditionScreen} />
      <Stack.Screen name="OtpScreen" component={OtpScreen} />
      <Stack.Screen name="TelNumScreen" component={TelNumScreen} />
      <Stack.Screen name="FirstFormScreen" component={FirstFormScreen} />
      <Stack.Screen name="SecondFormScreen" component={SecondFormScreen} />
      <Stack.Screen name="ThirdFormScreen" component={ThirdFormScreen} />
      <Stack.Screen name="FourthFormScreen" component={FourthFormScreen} />
      <Stack.Screen name="AddIDCardScreen" component={AddIDcardScreen} />
      <Stack.Screen name="SuccessRegister" component={SuccessRegister} />
    </Stack.Navigator>
  );
};

export default AppAuthNavigator;
