import React, { createContext, useMemo } from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import MainScreen from '../screens/MainScreen/MainScreen';
import AllPlotScreen from '../screens/ProfileScreen/AllPlotScreen';
import SelectDateScreen from '../screens/AutoBooking/SelectDateScreen';
import DronerDetail from '../screens/DronerProfile/DronerDetail';
import SeeAllDronerUsed from '../screens/DronerProfile/SeeAllDronerUsed';
import SelectPlotScreen from '../screens/AutoBooking/SelectPlotScreen';
import MainTapNavigator from './BottomTabs/MainTapNavigator';
import DeleteAcc from '../screens/ProfileScreen/DeleteProfile/DeleteAcc';
import DeleteSuccess from '../screens/ProfileScreen/DeleteProfile/DeleteSuccess';
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
      <Stack.Screen name="SelectDateScreen" component={SelectDateScreen} /> 
      <Stack.Screen name="SelectPlotScreen" component={SelectPlotScreen} /> 
      <Stack.Screen name="DronerDetail" component={DronerDetail}/>
      <Stack.Screen name="SeeAllDronerUsed" component={SeeAllDronerUsed} />
      
      <Stack.Screen name="DeleteAcc" component={DeleteAcc} />
      <Stack.Screen name="DeleteSuccess" component={DeleteSuccess} />


    </Stack.Navigator>
  )
}
export default MainNavigator;
