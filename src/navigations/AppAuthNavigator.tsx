import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '../screens/HomeScreen/HomeScreen'
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import PinScreen from '../screens/PinScreen/PinScreen';
import OtpScreen from '../screens/OtpScreen/OtpScreen';
import MainScreen from '../screens/MainScreen/MainScreen';
import ConditionScreen from '../screens/RegisterScreen/ConditionScreen';
import TelNumberScreen from '../screens/RegisterScreen/TelNumberScreen';
import FirstFormScreen from '../screens/RegisterScreen/FirstFormScreen';
import SecondFormScreen from '../screens/RegisterScreen/SecondFormScreen';
import ThirdFormScreen from '../screens/RegisterScreen/ThirdFormScreen';
import FourthFormScreen from '../screens/RegisterScreen/FourthFormScreen';
import AddIDcardScreen from '../screens/RegisterScreen/AddIDcardScreen';
import SuccessRegister from '../screens/RegisterScreen/SuccessRegister';

const Stack = createStackNavigator()

const AppAuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="OtpScreen" component={OtpScreen} />
      <Stack.Screen name="PinScreen" component={PinScreen} />
      <Stack.Screen name="ConditionScreen" component={ConditionScreen} />
      <Stack.Screen name="TelNumberScreen" component={TelNumberScreen} />
      <Stack.Screen name="FirstFormScreen" component={FirstFormScreen} />
      <Stack.Screen name="SecondFormScreen" component={SecondFormScreen} />
      <Stack.Screen name="ThirdFormScreen" component={ThirdFormScreen} />
      <Stack.Screen name="FourthFormScreen" component={FourthFormScreen} />
      <Stack.Screen name="AddIDCardScreen" component={AddIDcardScreen} />
      <Stack.Screen name="SuccessScreen" component={SuccessRegister} />
    </Stack.Navigator>
  )
}

export default AppAuthNavigator