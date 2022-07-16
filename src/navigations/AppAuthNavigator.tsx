import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '../screens/HomeScreen/HomeScreen'
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import PinScreen from '../screens/PinScreen/PinScreen';
import OtpScreen from '../screens/OtpScreen/OtpScreen';

const Stack = createStackNavigator()

const AppAuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="OtpScreen" component={OtpScreen} />
      <Stack.Screen name="PinScreen" component={PinScreen} />
     

      
    </Stack.Navigator>
  )
}

export default AppAuthNavigator