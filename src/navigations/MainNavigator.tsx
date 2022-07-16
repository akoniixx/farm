import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '../screens/HomeScreen/HomeScreen'
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import PinScreen from '../screens/PinScreen/PinScreen';
import OtpScreen from '../screens/OtpScreen/OtpScreen';
import MainTapNavigator from './bottomTabs/MainTapNavigator';

const Stack = createStackNavigator()

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={MainTapNavigator} />
    </Stack.Navigator>
  )
}

export default MainNavigator