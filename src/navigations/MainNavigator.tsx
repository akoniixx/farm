import React, { createContext, useMemo } from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import MainTapNavigator from './Bottom/MainTapNavigator';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import AllPlotScreen from '../screens/ProfileScreen/AllPlotScreen';
import EditProfileScreen from '../screens/ProfileScreen/EditProfileScreen';

const Stack = createStackNavigator()

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} >
      <Stack.Screen name="MainScreen" component={MainTapNavigator} options={{
            gestureEnabled: false,
            headerLeft: () => null,
          }} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />DronerBooking
      <Stack.Screen name="AllPlotScreen" component={AllPlotScreen} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />

    </Stack.Navigator>
  )
}

export default MainNavigator