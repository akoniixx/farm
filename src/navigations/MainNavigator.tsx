import React, { createContext, useMemo } from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '../screens/HomeScreen/HomeScreen'
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import PinScreen from '../screens/PinScreen/PinScreen';
import OtpScreen from '../screens/OtpScreen/OtpScreen';
import MainTapNavigator from './bottomTabs/MainTapNavigator';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen.tsx/TaskDetailScreen';

import ProfileDocument from '../screens/ProfileScreen/ProfileDocument';
import FourthFormScreen from '../screens/RegisterScreen/FourthFormScreen';
import AddIDcardScreen from '../screens/RegisterScreen/AddIDcardScreen';
import ViewProfile from '../screens/ProfileScreen/ViewProfile';
import EditProfile from '../screens/ProfileScreen/EditProfile';
const Stack = createStackNavigator()

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} >
      <Stack.Screen name="MainScreen" component={MainTapNavigator} options={{
            gestureEnabled: false,
            headerLeft: () => null,
          }} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="TaskDetailScreen" component={TaskDetailScreen} />
      <Stack.Screen name="EditProfile" component={EditProfile}/>
      <Stack.Screen name="ViewProfile" component={ViewProfile}/>
      <Stack.Screen name="ProfileDocument" component={ProfileDocument} />
      <Stack.Screen name="FourthFormScreen" component={FourthFormScreen} />
      <Stack.Screen name="AddIDCardScreen" component={AddIDcardScreen} />
    </Stack.Navigator>
  )
}

export default MainNavigator