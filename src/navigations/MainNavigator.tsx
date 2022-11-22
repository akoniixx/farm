import React, { createContext, useMemo } from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import MainTapNavigator from './Tabs/MainTapNavigator';
const Stack = createStackNavigator()

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} >
      <Stack.Screen name="MainScreen" component={MainTapNavigator} options={{
            gestureEnabled: false,
            headerLeft: () => null,
          }} />
    </Stack.Navigator>
  )
}

export default MainNavigator