import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '../screens/HomeScreen/HomeScreen'
import AppAuthNavigator from './AppAuthNavigator';
import MainNavigator from './MainNavigator';

const Stack = createStackNavigator()

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AppAuthNavigator} />
      <Stack.Screen name="Main" component={MainNavigator} />
    </Stack.Navigator>
  )
}

export default AppNavigator