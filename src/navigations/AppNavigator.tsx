import React, {useEffect, useState} from 'react';
import AppAuthNavigator from './AppAuthNavigator';
import LoadingNavigator from './LoadingNavigator';
import MainTapNavigator from './Bottom/MainTapNavigator';
import { createStackNavigator } from '@react-navigation/stack';
import DronerDetail from '../screens/DronerProfile/DronerDetail';
import SeeAllDronerUsed from '../screens/DronerProfile/SeeAllDronerUsed';
import DeleteAcc from '../screens/ProfileScreen/DeleteProfile/DeleteAcc';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false, gestureEnabled: false}}>
      <Stack.Screen
        name="initPage"
        component={LoadingNavigator}
        options={{
          gestureEnabled: false,
          headerLeft: () => null,
        }}
      />
      <Stack.Screen name="Auth" component={AppAuthNavigator} />
      <Stack.Screen name="Main" component={MainTapNavigator} />
      <Stack.Screen name="DronerDetail" component={DronerDetail} />
      <Stack.Screen name="SeeAllDronerUsed" component={SeeAllDronerUsed} />
      <Stack.Screen name="DeleteAcc" component={DeleteAcc} />



    </Stack.Navigator>
  );
};

export default AppNavigator;
