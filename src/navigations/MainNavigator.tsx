import React, { createContext, useMemo } from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import MainTapNavigator from './Tabs/MainTapNavigator';
import SelectDateScreen from '../screens/AutoBooking/SelectDateScreen';
const Stack = createStackNavigator()

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} >
      <Stack.Screen name="MainScreen" component={MainTapNavigator} options={{
            gestureEnabled: false,
            headerLeft: () => null,
          }} />
         <Stack.Screen name="SelectDateScreen" component={SelectDateScreen} /> 
    </Stack.Navigator>
  )
}

export default MainNavigator