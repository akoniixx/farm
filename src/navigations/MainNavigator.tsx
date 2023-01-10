import React, { createContext, useMemo } from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import MainTapNavigator from './Bottom/MainTapNavigator';
import MainScreen from '../screens/MainScreen/MainScreen';
import AllPlotScreen from '../screens/ProfileScreen/AllPlotScreen';
import SelectDateScreen from '../screens/AutoBooking/SelectDateScreen';
import DronerDetail from '../screens/DronerProfile/DronerDetail';
const Stack = createStackNavigator()

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} >
      <Stack.Screen name="MainScreen" component={MainTapNavigator} options={{
            gestureEnabled: false,
            headerLeft: () => null,
          }} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="AllPlotScreen" component={AllPlotScreen} />
      <Stack.Screen name="MainScreen" component={MainScreen}/>
      <Stack.Screen name="SelectDateScreen" component={SelectDateScreen} /> 
      <Stack.Screen name="DronerDetail" component={DronerDetail}/>

    </Stack.Navigator>
  )
}
export default MainNavigator;
