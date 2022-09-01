import React, { createContext, useMemo } from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '../screens/HomeScreen/HomeScreen'
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import PinScreen from '../screens/PinScreen/PinScreen';
import OtpScreen from '../screens/OtpScreen/OtpScreen';
import MainTapNavigator from './bottomTabs/MainTapNavigator';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen.tsx/TaskDetailScreen';
const Stack = createStackNavigator()

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainScreen" component={MainTapNavigator} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="TaskDetailScreen" component={TaskDetailScreen} />
    </Stack.Navigator>
  )
}

export default MainNavigator