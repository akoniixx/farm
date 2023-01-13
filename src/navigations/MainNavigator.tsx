import React, { createContext, useMemo } from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
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
      <Stack.Screen name="DeleteAcc" component={DeleteAcc} />
      <Stack.Screen name="DeleteSuccess" component={DeleteSuccess} />


    </Stack.Navigator>
  )
}
export default MainNavigator;
