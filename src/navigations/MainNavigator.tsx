import React, { createContext, useMemo } from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import MainTapNavigator from './Bottom/MainTapNavigator';
import MainScreen from '../screens/MainScreen/MainScreen';
const Stack = createStackNavigator()

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} >
      <Stack.Screen name="MainScreen" component={MainTapNavigator} options={{
            gestureEnabled: false,
            headerLeft: () => null,
          }} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="MainScreen" component={MainScreen}/>
    </Stack.Navigator>
  )
}

export default MainNavigator